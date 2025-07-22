"use client";

import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log("🔁 useEffect ran");

    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("👀 Firebase auth state changed:", u);

      if (!u) return;
      setUser(u);

      try {
        console.log("📤 Sending request to backend...");
        const res = await fetch("http://localhost:5000/api/friends/user/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: u.uid,
            name: u.displayName,
            email: u.email,
          }),
        });

        const data = await res.json();
        console.log("✅ User saved to DB:", data);
      } catch (err) {
        console.error("❌ Backend save failed:", err);
      }
    });

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      console.log("🔐 Opening Google popup...");
      await signInWithPopup(auth, provider);
      console.log("hii");
    } catch (err) {
      console.error("❌ Sign-in failed:", err);
    }
  };

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
