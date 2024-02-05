const express = require("express");
const Course = require("../models/Course");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-course", fetchUser, async (req, res) => {
  let success = false;
  try {
    const { title, description, categoryId, userId } = req.body;

    //Validate if the title and description is provided
    if (!title && !description && !categoryId && !userId) {
      return res.status(400).json({
        success,
        error: "title, description, categoryId and userId is required",
      });
    }

    //Create a new course
    const newCourse = new Course({
      title,
      description,
      categoryId,
      status: "Pending",
      userId,
    });

    //Save the Course to the database
    await newCourse.save();

    res.status(201).json({
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success, error: "Internal server error" });
  }
});

router.patch("/edit-course", fetchUser, async (req, res) => {
  try {
    const { identity, title, description, status, data } = req.body;

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

    if (status) {
      course.status = status;
    }

    if (data) {
      course.data = data;
    }

    // Save the updated course
    await course.save();
    res.status(200).json({ success: true, updatedCourse: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/delete-course/:id", fetchUser, async (req, res) => {
  try {
    const identity = req.params.id;

    //Find the course by ID

    const course = await Course.findOne({ _id: identity });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    //Delete the course
    await course.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Course Delete Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server error" });
  }
});

router.get("/all-course", fetchUser, async (req, res) => {
  try {
    const course = await Course.find();

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
