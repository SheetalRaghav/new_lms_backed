const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-category", fetchUser, async (req, res) => {
  let success = false;
  try {
    const { title } = req.body;

    // Validate if the title is provided
    if (!title) {
      return res.status(400).json({ success, error: "Title is required" });
    }

    // Create a new category
    const newCategory = new Category({ title });

    // Save the category to the database
    await newCategory.save();
    const formattedDate = newCategory.date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    res
      .status(201)
      .json({
        success: true,
        newCategory: {
          title: newCategory.title,
          _id: newCategory._id,
          date: formattedDate,
          __v: newCategory.__v,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, error: "Internal server error" });
  }
});

router.patch("/edit-category", fetchUser, async (req, res) => {
  try {
    const { identity, newCategory } = req.body;

    //Find the category by ID
    const category = await Category.findOne({ _id: identity });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    //Update the category
    category.title = newCategory;
    const updatedCategory = await category.save();

    res.status(200).json({ success: true, updatedCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/delete-category", fetchUser, async (req, res) => {
  try {
    const { identity } = req.body;

    //Find the category by ID
    const category = await Category.findOne({ _id: identity });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    //Delete the category
    await category.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Category Delete Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/all-categories", fetchUser, async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
