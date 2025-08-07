// Complete Stripe Webhook Handler with Firebase Integration
// Deploy this to /api/stripe-webhook

import Stripe from 'stripe';
import { buffer } from 'micro';
import { adminDb } from './lib/firebase-admin.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Plan mapping from Stripe price IDs to plan names
const PLAN_MAPPING = {
  'price_1RtK6lINrI1hWn86srxsunLx': 'pro',
  'price_1RtK7FINrI1hWn86TtcLgEMt': 'business',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        await handleCheckoutComplete(session);
        break;

      case 'customer.subscription.created':
        const newSubscription = event.data.object;
        console.log('Subscription created:', newSubscription.id);
        await handleSubscriptionCreated(newSubscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log('Subscription updated:', updatedSubscription.id);
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription deleted:', deletedSubscription.id);
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('Payment failed for invoice:', failedInvoice.id);
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutComplete(session) {
  try {
    // Get full session details with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer', 'subscription']
    });

    const userId = session.metadata?.userId;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    // Get the price ID from the line items
    const priceId = fullSession.line_items?.data[0]?.price?.id;
    const planName = PLAN_MAPPING[priceId] || 'free';

    // Update user document in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    
    await userRef.update({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      plan: planName,
      planStatus: 'active',
      planUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`User ${userId} upgraded to ${planName} plan`);

    // Update user stats
    await updateUserStats(userId, planName);
    
  } catch (error) {
    console.error('Error handling checkout complete:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0]?.price?.id;
    const planName = PLAN_MAPPING[priceId] || 'free';

    // Find user by Stripe customer ID
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription info
    await userDoc.ref.update({
      stripeSubscriptionId: subscription.id,
      plan: planName,
      planStatus: subscription.status,
      planUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Subscription created for user ${userId}: ${planName}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0]?.price?.id;
    const planName = PLAN_MAPPING[priceId] || 'free';

    // Find user by Stripe customer ID
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription info
    await userDoc.ref.update({
      plan: planName,
      planStatus: subscription.status,
      planUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user stats for new plan
    await updateUserStats(userId, planName);

    console.log(`Subscription updated for user ${userId}: ${planName} (${subscription.status})`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const customerId = subscription.customer;

    // Find user by Stripe customer ID
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Downgrade to free plan
    await userDoc.ref.update({
      plan: 'free',
      planStatus: 'cancelled',
      planCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      stripeSubscriptionId: null
    });

    // Reset user stats to free tier limits
    await updateUserStats(userId, 'free');

    console.log(`User ${userId} downgraded to free plan (subscription cancelled)`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    const customerId = invoice.customer;
    
    // Find user by Stripe customer ID
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      
      // Update last payment date
      await userDoc.ref.update({
        lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
        lastPaymentAmount: invoice.amount_paid / 100, // Convert from cents
        planStatus: 'active'
      });

      console.log(`Payment recorded for user ${userDoc.id}`);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    const customerId = invoice.customer;
    
    // Find user by Stripe customer ID
    const usersSnapshot = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      
      // Update payment status
      await userDoc.ref.update({
        planStatus: 'past_due',
        lastPaymentFailedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Payment failed for user ${userDoc.id}`);
      
      // TODO: Send email notification to user about failed payment
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function updateUserStats(userId, planName) {
  try {
    // Get plan limits
    const planLimits = {
      free: {
        maxForms: 3,
        maxSubmissions: 100,
        maxPdfGenerations: 10
      },
      pro: {
        maxForms: -1, // unlimited
        maxSubmissions: 1000,
        maxPdfGenerations: 100
      },
      business: {
        maxForms: -1, // unlimited
        maxSubmissions: 10000,
        maxPdfGenerations: 1000
      }
    };

    const limits = planLimits[planName] || planLimits.free;

    // Update or create user stats document
    const statsRef = adminDb.collection('userStats').doc(userId);
    const statsDoc = await statsRef.get();

    if (statsDoc.exists) {
      // Update existing stats with new limits
      await statsRef.update({
        planLimits: limits,
        plan: planName,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new stats document
      await statsRef.set({
        userId,
        plan: planName,
        planLimits: limits,
        currentUsage: {
          forms: 0,
          submissions: 0,
          pdfGenerations: 0
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    console.log(`Updated stats for user ${userId} with ${planName} plan limits`);
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}