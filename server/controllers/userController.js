import User from "../models/User.js";

export const upsertUser = async (req, res) => {
  const { uid, name, email } = req.body;
  console.log("🟢 Received upsertUser request:", { uid, name, email });

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { name, email },
      { upsert: true, new: true }
    );
    console.log("✅ Mongo response:", user);
    res.json(user);
  } catch (err) {
    console.error("❌ Upsert user failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

