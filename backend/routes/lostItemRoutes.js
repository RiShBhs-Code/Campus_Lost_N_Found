const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const LostItem = require("../models/LostItem");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

const itemValidation = [
  body("itemName").trim().notEmpty().withMessage("Item name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("status")
    .isIn(["Lost", "Found"])
    .withMessage("Status must be Lost or Found")
];

function returnValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post("/", protect, itemValidation, returnValidationErrors, async (req, res) => {
  try {
    const item = await LostItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Please provide valid item data" });
    }

    console.error("Failed to create item:", error.message);
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

router.put(
  "/:id",
  protect,
  itemValidation,
  returnValidationErrors,
  async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Please provide valid item data" });
    }

    res.status(500).json({ error: "Failed to update item" });
  }
  }
);

router.delete("/:id", protect, authorizeRole("admin"), async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const item = await LostItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
