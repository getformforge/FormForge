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
        createdAt: data.createdAt?.toDate() || new Date()
      };
    }
    return {
      formCount: 0,
      submissionCount: 0,
      plan: 'free',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      formCount: 0,
      submissionCount: 0,
      plan: 'free',
      createdAt: new Date()
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
        features: ['custom_branding', 'priority_support', 'advanced_fields']
      };
    case 'business':
      return { 
        maxForms: -1, // unlimited
        maxSubmissions: 10000,
        features: ['custom_branding', 'priority_support', 'advanced_fields', 'white_label', 'api_access']
      };
    default: // free
      return { 
        maxForms: 3,
        maxSubmissions: 50,
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
      default:
        return true;
    }
  } catch (error) {
    console.error('Error checking plan limits:', error);
    return false;
  }
};