import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Function to fix existing users who don't have proper stats
export const ensureUserStats = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const updates = {};
      
      // Add missing fields with default values
      if (data.formCount === undefined) updates.formCount = 0;
      if (data.submissionCount === undefined) updates.submissionCount = 0;
      if (data.plan === undefined) updates.plan = 'free';
      if (data.createdAt === undefined) updates.createdAt = new Date();
      
      // Only update if there are missing fields
      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
        console.log('Updated user stats for:', userId);
      }
    }
  } catch (error) {
    console.error('Error ensuring user stats:', error);
  }
};