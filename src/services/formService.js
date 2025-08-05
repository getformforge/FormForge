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
    const templateRef = doc(collection(db, 'forms'), template.id.toString());
    await setDoc(templateRef, {
      ...template,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update user form count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      formCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error saving form template:', error);
    return false;
  }
};

export const getUserFormTemplates = async (userId) => {
  try {
    const q = query(
      collection(db, 'forms'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching form templates:', error);
    return [];
  }
};

export const deleteFormTemplate = async (userId, templateId) => {
  try {
    const templateRef = doc(db, 'forms', templateId.toString());
    await deleteDoc(templateRef);
    
    // Update user form count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      formCount: increment(-1)
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting form template:', error);
    return false;
  }
};

// Published Forms Collection
export const publishForm = async (userId, formData) => {
  try {
    const formRef = doc(collection(db, 'publishedForms'), formData.id);
    await setDoc(formRef, {
      ...formData,
      userId,
      createdAt: serverTimestamp(),
      submissions: []
    });
    
    // Update user form count when publishing a form
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      formCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error publishing form:', error);
    return false;
  }
};

export const getPublishedForm = async (formId) => {
  try {
    const formRef = doc(db, 'publishedForms', formId);
    const formSnap = await getDoc(formRef);
    
    if (formSnap.exists()) {
      return {
        id: formSnap.id,
        ...formSnap.data(),
        createdAt: formSnap.data().createdAt?.toDate() || new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching published form:', error);
    return null;
  }
};

export const submitFormResponse = async (formId, submissionData) => {
  try {
    const formRef = doc(db, 'publishedForms', formId);
    const formSnap = await getDoc(formRef);
    
    if (!formSnap.exists()) {
      return false;
    }
    
    const submission = {
      id: Date.now(),
      data: submissionData,
      submittedAt: new Date().toISOString()
    };
    
    const currentSubmissions = formSnap.data().submissions || [];
    await updateDoc(formRef, {
      submissions: [...currentSubmissions, submission]
    });
    
    // Update user submission count
    const userId = formSnap.data().userId;
    if (userId) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        submissionCount: increment(1)
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting form response:', error);
    return false;
  }
};

export const getFormSubmissions = async (formId) => {
  try {
    const formRef = doc(db, 'publishedForms', formId);
    const formSnap = await getDoc(formRef);
    
    if (formSnap.exists()) {
      return formSnap.data().submissions || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return [];
  }
};

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