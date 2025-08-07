import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db } from '../firebase';

// Forms Collection
export const saveFormTemplate = async (userId, template) => {
  try {
    // Log the template data for debugging
    console.log('Saving template:', { userId, template });
    
    // Ensure all required fields are present
    if (!template.name || !template.fields) {
      throw new Error('Template must have name and fields');
    }
    
    const templateRef = doc(collection(db, 'formTemplates'), template.id.toString());
    const templateData = {
      userId,
      name: template.name,
      fields: template.fields || [],
      rows: template.rows || [],
      settings: template.settings || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Template data to save:', templateData);
    
    await setDoc(templateRef, templateData);
    
    // Update user form count - first ensure user doc exists
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        formCount: increment(1)
      });
    } catch (updateError) {
      // If user doc doesn't exist, create it
      if (updateError.code === 'not-found') {
        await setDoc(userRef, {
          formCount: 1,
          submissionCount: 0,
          plan: 'free',
          createdAt: serverTimestamp()
        });
      } else {
        console.warn('Could not update user form count:', updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving form template:', error);
    throw error; // Re-throw to provide more detail to the caller
  }
};

export const getUserFormTemplates = async (userId) => {
  try {
    console.log('Fetching templates for user:', userId);
    
    // Simplified query - remove orderBy to avoid index requirement
    const q = query(
      collection(db, 'formTemplates'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    console.log('Found templates:', querySnapshot.size);
    
    // Sort in JavaScript instead
    const templates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    
    // Sort by createdAt descending
    templates.sort((a, b) => b.createdAt - a.createdAt);
    
    return templates;
  } catch (error) {
    console.error('Error fetching form templates:', error);
    throw error; // Re-throw to provide more detail
  }
};

export const deleteFormTemplate = async (userId, templateId) => {
  try {
    const templateRef = doc(db, 'formTemplates', templateId.toString());
    await deleteDoc(templateRef);
    
    // Update user form count
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        formCount: increment(-1)
      });
    } catch (updateError) {
      console.warn('Could not update user form count on delete:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting form template:', error);
    return false;
  }
};

// Published Forms Collection - see FORM SHARING FUNCTIONALITY section below

// Function moved to FORM SHARING FUNCTIONALITY section below

// Functions moved to FORM SHARING FUNCTIONALITY section below

// User Statistics
export const getUserStats = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        formCount: data.formCount || 0,
        submissionCount: data.submissionCount || 0,
        plan: data.plan || 'free',
        createdAt: data.createdAt?.toDate() || new Date(),
        pdfGenerations: data.pdfGenerations || {}
      };
    }
    return {
      formCount: 0,
      submissionCount: 0,
      plan: 'free',
      createdAt: new Date(),
      pdfGenerations: {}
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      formCount: 0,
      submissionCount: 0,
      plan: 'free',
      createdAt: new Date(),
      pdfGenerations: {}
    };
  }
};

// Plan Limits
export const getPlanLimits = (plan) => {
  switch (plan) {
    case 'pro':
      return { 
        maxForms: -1, // unlimited
        maxSubmissions: 1000,
        maxPDFsPerMonth: -1, // unlimited
        features: ['custom_branding', 'priority_support', 'advanced_fields']
      };
    case 'business':
      return { 
        maxForms: -1, // unlimited
        maxSubmissions: 10000,
        maxPDFsPerMonth: -1, // unlimited
        features: ['custom_branding', 'priority_support', 'advanced_fields', 'white_label', 'api_access']
      };
    default: // free
      return { 
        maxForms: 3,
        maxSubmissions: 50,
        maxPDFsPerMonth: 10, // 10 PDFs per month for free users
        features: []
      };
  }
};

export const checkPlanLimits = async (userId, action) => {
  try {
    const stats = await getUserStats(userId);
    const limits = getPlanLimits(stats.plan);
    
    switch (action) {
      case 'create_form':
        return limits.maxForms === -1 || stats.formCount < limits.maxForms;
      case 'submit_form':
        return limits.maxSubmissions === -1 || stats.submissionCount < limits.maxSubmissions;
      case 'generate_pdf':
        // Check monthly PDF limit
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const monthlyPDFs = stats.pdfGenerations?.[currentMonth] || 0;
        return limits.maxPDFsPerMonth === -1 || monthlyPDFs < limits.maxPDFsPerMonth;
      default:
        return true;
    }
  } catch (error) {
    console.error('Error checking plan limits:', error);
    return false;
  }
};

// Track PDF generation
export const trackPDFGeneration = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() || {};
    const pdfGenerations = userData.pdfGenerations || {};
    const currentCount = pdfGenerations[currentMonth] || 0;
    
    // Update the count for current month
    await updateDoc(userRef, {
      [`pdfGenerations.${currentMonth}`]: currentCount + 1,
      lastPDFGeneration: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking PDF generation:', error);
    return false;
  }
};

// FORM SHARING FUNCTIONALITY

// Save/Publish a form template for sharing
export const publishForm = async (userId, formData) => {
  try {
    // Check if user can create more forms
    const canCreate = await checkPlanLimits(userId, 'create_form');
    if (!canCreate) {
      throw new Error('Form creation limit reached for your plan');
    }

    // Generate unique form ID
    const formId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Create form document
    const formRef = doc(db, 'forms', formId);
    const formDocument = {
      id: formId,
      title: formData.title || 'Untitled Form',
      description: formData.description || '',
      fields: formData.fields || [],
      ownerId: userId,
      isPublished: true,
      theme: formData.theme || 'modern', // Add theme support
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submissionCount: 0,
      settings: {
        allowMultipleSubmissions: true,
        showProgressBar: true,
        customTheme: formData.settings?.customTheme || 'default',
        theme: formData.theme || 'modern' // Store theme in settings too
      }
    };

    await setDoc(formRef, formDocument);

    // Update user's form count
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() || {};
    const currentFormCount = userData.formCount || 0;

    await updateDoc(userRef, {
      formCount: currentFormCount + 1,
      lastFormCreated: serverTimestamp()
    });

    return { success: true, formId, formUrl: `${window.location.origin}/form/${formId}` };
  } catch (error) {
    console.error('Error publishing form:', error);
    return { success: false, error: error.message };
  }
};

// Get published form by ID (public access)
export const getPublishedForm = async (formId) => {
  try {
    const formRef = doc(db, 'forms', formId);
    const formDoc = await getDoc(formRef);
    
    if (!formDoc.exists()) {
      throw new Error('Form not found');
    }

    const formData = formDoc.data();
    if (!formData.isPublished) {
      throw new Error('Form is not published');
    }

    return { success: true, form: formData };
  } catch (error) {
    console.error('Error getting published form:', error);
    return { success: false, error: error.message };
  }
};

// Submit a response to a published form
export const submitFormResponse = async (formId, responseData) => {
  try {
    // Get form info first
    const formResult = await getPublishedForm(formId);
    if (!formResult.success) {
      throw new Error(formResult.error);
    }

    const form = formResult.form;

    // Check submission limits for form owner
    const canSubmit = await checkPlanLimits(form.ownerId, 'submit_form');
    if (!canSubmit) {
      throw new Error('Submission limit reached for this form');
    }

    // Generate unique submission ID
    const submissionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Create submission document
    const submissionRef = doc(db, 'submissions', submissionId);
    const submissionDocument = {
      id: submissionId,
      formId: formId,
      formOwnerId: form.ownerId,
      responses: responseData,
      submittedAt: serverTimestamp(),
      ipAddress: null, // Could be added later for analytics
      userAgent: navigator.userAgent
    };

    await setDoc(submissionRef, submissionDocument);

    // Update form submission count
    const formRef = doc(db, 'forms', formId);
    await updateDoc(formRef, {
      submissionCount: (form.submissionCount || 0) + 1,
      lastSubmission: serverTimestamp()
    });

    // Update form owner's submission count
    const ownerRef = doc(db, 'users', form.ownerId);
    const ownerDoc = await getDoc(ownerRef);
    const ownerData = ownerDoc.data() || {};
    const currentSubmissionCount = ownerData.submissionCount || 0;

    await updateDoc(ownerRef, {
      submissionCount: currentSubmissionCount + 1,
      lastSubmissionReceived: serverTimestamp()
    });

    return { success: true, submissionId };
  } catch (error) {
    console.error('Error submitting form response:', error);
    return { success: false, error: error.message };
  }
};

// Get form submissions for owner
export const getFormSubmissions = async (userId, formId = null) => {
  try {
    let q;
    if (formId) {
      // Get submissions for specific form
      q = query(
        collection(db, 'submissions'),
        where('formId', '==', formId),
        where('formOwnerId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
    } else {
      // Get all submissions for user
      q = query(
        collection(db, 'submissions'),
        where('formOwnerId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const submissions = [];

    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, submissions };
  } catch (error) {
    console.error('Error getting form submissions:', error);
    return { success: false, error: error.message, submissions: [] };
  }
};

// Get user's published forms
export const getUserForms = async (userId) => {
  try {
    const q = query(
      collection(db, 'forms'),
      where('ownerId', '==', userId),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const forms = [];

    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, forms };
  } catch (error) {
    console.error('Error getting user forms:', error);
    return { success: false, error: error.message, forms: [] };
  }
};