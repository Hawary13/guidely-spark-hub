import { db } from "./firebase";
import { collection, addDoc, getDocs, connectFirestoreEmulator } from "firebase/firestore";

export async function testFirestoreConnection() {
  try {
    console.log("Testing Firestore connection...");
    
    // Create a promise that times out after 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });
    
    // Test simple read operation first (less likely to fail than write)
    const testPromise = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        console.log("Read test successful, documents found: ", querySnapshot.size);
        
        return {
          success: true,
          message: "Firestore connection successful (read test)",
          documentsCount: querySnapshot.size
        };
      } catch (error: any) {
        // If read fails, likely a connection issue
        throw error;
      }
    };
    
    const result = await Promise.race([testPromise(), timeoutPromise]);
    return result;
    
  } catch (error: any) {
    console.error("Firestore connection failed:", error);
    
    // Provide more specific error messages
    if (error.message.includes('timeout')) {
      return {
        success: false,
        error: "Connection timeout - Firestore may not be properly configured"
      };
    } else if (error.code === 'permission-denied') {
      return {
        success: false,
        error: "Permission denied - Check Firestore security rules"
      };
    } else if (error.code === 'unavailable') {
      return {
        success: false,
        error: "Firestore service unavailable - Check internet connection"
      };
    } else {
      return {
        success: false,
        error: `Connection failed: ${error.message}`
      };
    }
  }
}

// Initialize default admin user in Firestore
export async function initializeDefaultAdmin() {
  try {
    const defaultAdmin = {
      id: 'admin-default',
      email: 'admin@gsf.org.eg',
      displayName: 'GSF Administrator',
      role: 'super_admin',
      permissions: ['all'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'users'), defaultAdmin);
    console.log("Default admin created with ID: ", docRef.id);
    
    return {
      success: true,
      adminId: docRef.id
    };
  } catch (error: any) {
    console.error("Failed to create default admin:", error);
    return {
      success: false,
      error: error.message
    };
  }
}