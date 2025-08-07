// Manual script to update user plan in Firebase
// Run this in your browser console while logged in

async function manuallyUpgradeToPro() {
  const { auth, db } = window.firebase;
  const user = auth.currentUser;
  
  if (!user) {
    console.error('No user logged in');
    return;
  }
  
  console.log('Updating plan for user:', user.uid);
  
  try {
    // Update the user document
    await db.collection('users').doc(user.uid).update({
      plan: 'pro',
      planStatus: 'active',
      planUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      // Add a note about manual update
      manuallyUpdated: true,
      manualUpdateReason: 'Webhook failed to process payment'
    });
    
    // Also create/update user stats
    await db.collection('userStats').doc(user.uid).set({
      userId: user.uid,
      plan: 'pro',
      planLimits: {
        maxForms: -1,
        maxSubmissions: 1000,
        maxPdfGenerations: 100
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Successfully upgraded to Pro plan!');
    console.log('Please refresh the page to see your new plan.');
    
  } catch (error) {
    console.error('Failed to update plan:', error);
  }
}

// Run the upgrade
manuallyUpgradeToPro();