// controllers/userController.js
import User from "../models/User.js";

// controllers/userController.js
export const upsertUser = async (req, res) => {
  const { uid, name, email } = req.body;
  console.log("📥 Received user upsert request:", { uid, name, email });

  if (!uid || !email) {
    console.warn("⚠️ Missing UID or email");
    return res.status(400).json({ message: "UID and email are required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, name, email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ MongoDB user saved:", user);
    res.json(user);
  } catch (err) {
    console.error("❌ DB error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
