const express = require("express");
const Course = require("../models/Course");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-course", fetchUser, async (req, res) => {
  let success = false;
  try {
    const { title, description, categoryId } = req.body;

    //Validate if the title and description is provided
    if (!title && !description && !categoryId) {
      return res.status(400).json({
        success,
        error: "Title, Description and categoryId is required",
      });
    }

    //Create a new course
    const newCourse = new Course({ title, description, categoryId });

    //Save the Course to the database
    await newCourse.save();

    res.status(201).json({
      success: true,
      newCourse: {
        _id: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        categoryId: newCourse.categoryId,
        __v: newCourse.__v,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success, error: "Internal server error" });
  }
});

router.patch("/edit-course", fetchUser, async (req, res) => {
  try {
    const { identity, title, description } = req.body;

    //Find the course by ID
    const course = await Course.findOne({ _id: identity });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    // Update the course properties
    if (title) {
      course.title = title;
    }

    if (description) {
      course.description = description;
    }

    // Save the updated course
    await course.save();
    res.status(200).json({ success: true, updatedCourse: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
