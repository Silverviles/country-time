import { db } from '../js/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

/**
 * Service for managing user favorites in Firestore
 */

/**
 * Get user favorites
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of favorite country objects
 */
export const getUserFavorites = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().favorites) {
      return userDoc.data().favorites;
    } else {
      // If user document doesn't exist or has no favorites, initialize it
      await setDoc(userDocRef, { favorites: [] }, { merge: true });
      return [];
    }
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

/**
 * Add a country to user favorites
 * @param {string} userId - The user ID
 * @param {Object} country - The country object to add to favorites
 * @returns {Promise<void>}
 */
export const addToFavorites = async (userId, country) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        favorites: arrayUnion(country)
      });
    } else {
      // Create new document
      await setDoc(userDocRef, {
        favorites: [country]
      });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Remove a country from user favorites
 * @param {string} userId - The user ID
 * @param {Object} country - The country object to remove from favorites
 * @returns {Promise<void>}
 */
export const removeFromFavorites = async (userId, country) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      favorites: arrayRemove(country)
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Check if a country is in user favorites
 * @param {string} userId - The user ID
 * @param {string} countryCode - The country code to check
 * @returns {Promise<boolean>} True if country is in favorites
 */
export const isCountryInFavorites = async (userId, countryCode) => {
  try {
    const favorites = await getUserFavorites(userId);
    return favorites.some(country => country.cca3 === countryCode);
  } catch (error) {
    console.error('Error checking if country is in favorites:', error);
    throw error;
  }
};