const { courseModel } = require("../db/db");
const {
  validationError,
  successResponse,
} = require("../helper/responseTemplate");

const addCourse = async (req, res) => {
  try {
    const { title, description, categoryId, userId } = req.body;

    if (!title && !description && !categoryId && !userId) {
      return res.status(400).json({
        success,
        error: "title, description, categoryId and userId is required",
      });
    }

    const newCourse = new courseModel({
      title,
      description,
      categoryId,
      status: "Pending",
      userId,
    });
    await newCourse.save();

    res.status(201).json(
      await successResponse({
        success: true,
        newCourse: {
          _id: newCourse._id,
          title: newCourse.title,
          description: newCourse.description,
          categoryId: newCourse.categoryId,
          userId: newCourse.userId,
          status: newCourse.status,
          __v: newCourse.__v,
        },
      })
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success, error: "Internal server error" });
  }
};

const editCourse = async (req, res) => {
  try {
    const { identity, title, description, status, data } = req.body;
    const course = await courseModel.findOne({ _id: identity });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    if (title) {
      course.title = title;
    }

    if (description) {
      course.description = description;
    }

    if (status) {
      course.status = status;
    }

    if (data) {
      course.data = data;
    }

    await course.save();
    res
      .status(200)
      .json(await successResponse({ success: true, updatedCourse: course }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const identity = req.params.id;
    const course = await courseModel.findOne({ _id: identity });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    await course.deleteOne();
    res
      .status(200)
      .json(await successResponse({ success: true, message: "Course Delete Successfully" }));
  } catch (error) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal Server error" });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const course = await courseModel.find();

    res.status(200).json(await successResponse({ success: true, course }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  addCourse,
  editCourse,
  deleteCourse,
  getAllCourse,
};
