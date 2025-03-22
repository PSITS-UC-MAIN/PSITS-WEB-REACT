const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/StudentModel");
const Admin = require("../models/AdminModel");
const Log = require("../models/LogModel");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middlewares/authenticateToken");
const { admin_model, user_model } = require("../model_template/model_data");
const {
  admin_authenticate,
  student_authenticate,
} = require("../middlewares/custom_authenticate_token");

const router = express.Router();
const token_key = process.env.JWT_SECRET;
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
  const { id_number, password } = req.body;
  const currentDate = new Date();

  try {
    let users;
    let role;
    let admin = null;
    let student = null;
    let campus;

    if (id_number.includes("-admin")) {
      admin = await Admin.findOne({ id_number });
    }

    if (!admin) {
      student = await Student.findOne({ id_number });
      if (!student) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, student.password);

      if (passwordMatch && student.status === "False") {
        return res
          .status(400)
          .json({ message: "Your account has been deleted!" });
      } else if (passwordMatch && student.status === "True") {
        users = student;
        role = "Student";
      } else {
        return res
          .status(400)
          .json({ message: "Invalid ID number or password" });
      }
    } else {
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch && admin.status === "Active") {
        users = admin;
        role = "Admin";
      } else if (passwordMatch && admin.status === "Suspend") {
        return res.status(400).json({
          message: "Your account has been suspended! Please contact president",
        });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid ID number or password" });
      }
    }

    const user = {
      id_number: users.id_number,
    };
    campus = users.campus;
    const token = jwt.sign({ user }, token_key, {
      expiresIn: role === "Admin" ? "2h" : "10m",
    });

    // Create a log only if the user is an Admin
    if (role === "Admin") {
      const log = new Log({
        admin: users.name,
        admin_id: users._id,
        action: "Admin Login",
      });

      await log.save();
    }

    return res.json({ message: "Signed in successfully", role, token, campus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/protected-route", authenticateToken, (req, res) => {
  return res.json({
    message: "Access granted",
    user: req.user,
    role: req.role,
  });
});

//protected route for admin
router.get("/protected-route-admin", admin_authenticate, async (req, res) => {
  try {
    const admin = await Admin.findOne({ id_number: req.user.id_number });
    if (admin) {
      return res.status(200).json({
        user: admin_model(admin),
        role: "Admin",
      });
    } else return res.status(400).json({ message: "Access Denied" });
  } catch (error) {
    console.error(error);
  }
});
//Student route
router.get(
  "/protected-route-student",
  student_authenticate,
  async (req, res) => {
    try {
      const student = await Student.findOne({ id_number: req.user.id_number });
      if (student) {
        return res.status(200).json({
          user: user_model(student),
          role: "Student",
        });
      } else return res.status(400).json({ message: "Access Denied" });
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
