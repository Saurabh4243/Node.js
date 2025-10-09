const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");

const app = express();
const port = 8000;

// ======================
// Schema
// ======================
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true } // ✅ corrected key name
);

// ======================
// MongoDB Connection
// ======================
mongoose
  .connect("mongodb://127.0.0.1:27017/node-1")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Failed to connect to DB:", err));

const User = mongoose.model("User", userSchema);

// ======================
// Middleware
// ======================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  console.log("🧩 Middleware triggered");
  next();
});

// ======================
// Routes
// ======================

// 1️⃣ Display Users in HTML
app.get("/users", async (req, res) => {
  try {
    const allDbUsers = await User.find({}); // ✅ corrected model name
    const html = `
      <ul>
        ${allDbUsers
          .map(
            (user) => `<li>${user.firstName} - ${user.email}</li>`
          )
          .join("")}
      </ul>
    `;
    res.send(html);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// 2️⃣ Get Users as JSON
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.json(allUsers);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 3️⃣ Get / Update / Delete user by ID
app.route("/api/users/:id")
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ error: "User not found" });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: "Invalid ID format" });
    }
  })
  .patch(async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({ error: "User not found" });
      return res.json({ msg: "User updated", user: updatedUser });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser)
        return res.status(404).json({ error: "User not found" });
      return res.json({ msg: "User deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

// 4️⃣ Create New User
app.post("/api/users", async (req, res) => {
  const body = req.body;

  // Validation
  if (
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.gender ||
    !body.jobTitle
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const result = await User.create(body);
    console.log("✅ User created:", result);
    return res
      .status(201)
      .json({ msg: "User created successfully", user: result });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
});

// ======================
// Start Server
// ======================
app.listen(port, () =>
  console.log(`🚀 Server started at http://localhost:${port}`)
);