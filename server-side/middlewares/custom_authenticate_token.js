const jwt = require("jsonwebtoken");
require("dotenv").config();
const token_key = process.env.JWT_SECRET;
const Admin = require("../models/AdminModel");
const Student = require("../models/StudentModel");
const { admin_model, user_model } = require("../model_template/model_data");

const admin_authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, token_key, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const admin = await Admin.findOne({ id_number: decoded.user?.id_number });

      if (admin) {
        req.user = admin_model(admin);
        next();
      } else res.status(403).json({ message: "Access Denied" });
    } catch (error) {
      console.error(error);
    }
  });
};

const student_authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, token_key, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const student = await Student.findOne({
        id_number: decoded.user?.id_number,
      });

      if (student) {
        req.user = user_model(student);
        next();
      } else res.status(403).json({ message: "Access Denied" });
    } catch (error) {
      console.error(error);
    }
  });
};

const both_authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, token_key, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const student = await Student.findOne({
        id_number: decoded.user?.id_number,
      });

      if (!student) {
        const admin = await Admin.findOne({
          id_number: decoded.user?.id_number,
        });
        if (admin) {
          req.user = admin_model(admin);
          next();
        } else res.status(403).json({ message: "Access Denied" });
      } else if (student) {
        req.user = user_model(student);
        next();
      } else res.status(403).json({ message: "Access Denied" });
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = {
  admin_authenticate,
  student_authenticate,
  both_authenticate,
};
