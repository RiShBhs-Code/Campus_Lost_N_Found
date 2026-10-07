const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many authentication attempts. Try again later." }
});

function returnValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

const registrationValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

const loginValidation = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

router.post(
  "/register",
  authLimiter,
  registrationValidation,
  returnValidationErrors,
  registerUser
);
router.post(
  "/login",
  authLimiter,
  loginValidation,
  returnValidationErrors,
  loginUser
);

module.exports = router;
