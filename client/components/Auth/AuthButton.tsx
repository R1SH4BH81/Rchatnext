"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  // Save user to backend MongoDB
  const saveUserToDB = async (firebaseUser: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/user/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "No Name",
          email: firebaseUser.email || "No Email",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log("✅ User saved:", data);
    } catch (err: any) {
      console.error("❌ Failed to save user:", err.message);
    }
  };

  // Watch Firebase auth state changes
  useEffect(() => {
    console.log("🔁 useEffect ran");

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("👀 Firebase auth state changed:", firebaseUser);

      if (!firebaseUser) return;
      setUser(firebaseUser);

      await saveUserToDB(firebaseUser);
    });

    return () => unsub();
  }, []);

  // Trigger Google login
  const handleLogin = async () => {
    try {
      console.log("🔐 Opening Google popup...");
     const result = await signInWithPopup(auth, provider);
      const user = result.user;

    console.log("✅ Google Sign-in successful");
    console.log("🧑‍💻 Name:", user.displayName);
    console.log("📧 Email:", user.email);
    console.log("🆔 UID:", user.uid);

      console.log("✅ Google sign-in successful");
    } catch (err) {
      console.error("❌ Sign-in failed:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    console.log("👋 Logged out");
  };

  return (
    <div className="p-4">
      {user ? (
        <div>
          <p>👤 {user.displayName}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 rounded">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
