const { categoryModel } = require("../db/db");
const {
  validationError,
  successResponse,
} = require("../helper/responseTemplate");

const addCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success, error: "Title is required" });
    }

    const newCategory = new categoryModel({ title });

    await newCategory.save();
    const formattedDate = newCategory.date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    res.status(201).json(await successResponse({
      success: true,
      newCategory: {
        title: newCategory.title,
        _id: newCategory._id,
        date: formattedDate,
        __v: newCategory.__v,
      },
    }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success, error: "Internal server error" });
  }
};

const editCategory = async (req, res) => {
  try {
    const { identity, newCategory } = req.body;

    const category = await categoryModel.findOne({ _id: identity });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    category.title = newCategory;
    const updatedCategory = await category.save();

    res.status(200).json({ success: true, updatedCategory });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const identity = req.params.id;

    const category = await categoryModel.findOne({ _id: identity });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    await category.deleteOne();
    res
      .status(200)
      .json(await successResponse({ success: true, message: "Category Delete Successfully" }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    res.status(200).json(await successResponse({ success: true, categories }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategory,
};
