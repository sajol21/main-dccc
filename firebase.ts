import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseConfig } from './firebaseConfig'; // Import the new config file

let firestoreDB: Firestore;
let auth: Auth;

try {
  // Check if the essential config has been replaced from placeholders.
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_")) {
    throw new Error("Firebase configuration is missing or uses placeholder values. Please update `firebaseConfig.ts` with your actual project credentials.");
  }

  // Initialize Firebase
  const app: FirebaseApp = initializeApp(firebaseConfig);

  // Assign references to the exported variables
  firestoreDB = getFirestore(app);
  auth = getAuth(app);

} catch (error: any) {
  console.error("FATAL: Firebase initialization failed", error);
  
  // Display a developer-friendly error message on the page.
  document.body.innerHTML = `
    <div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #fef2f2; padding: 1rem;">
      <div style="background-color: white; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 2rem; max-width: 600px; text-align: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
        <h1 style="color: #b91c1c; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Application Initialization Error</h1>
        <p style="color: #dc2626; margin-bottom: 1.5rem;">There was a problem connecting to the backend services. This is likely due to a missing or invalid configuration.</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 0.25rem; text-align: left; font-family: monospace; color: #475569; word-break: break-all;">
          <strong>Error:</strong> ${error.message || 'Unknown Firebase Error'}
        </div>
        <p style="color: #475569; margin-top: 1.5rem; font-size: 0.875rem;">
          <strong>Next Steps:</strong> Please open the <code>firebaseConfig.ts</code> file in your project and follow the instructions to add your Firebase project credentials.
        </p>
      </div>
    </div>
  `;
  
  // Re-throw the error to halt further script execution.
  throw error;
}

// Export the initialized services
export { firestoreDB, auth };