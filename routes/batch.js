const express = require("express");
const Batch = require("../models/Batch");
const Course = require("../models/Course");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-batch", fetchUser, async (req, res) => {
  try {
    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        error: "Title and courseId are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    const newBatch = new Batch({
      title,
      courseId: course._id,
      courseDetails: {...course},
    });

    await newBatch.save().then((value)=>{
      res.status(201).json({
        success: true,
        newBatch: value,
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.patch("/edit-batch", fetchUser, async (req, res) => {
  try {
    const { identity, newTitle } = req.body;

    const updatedBatch = await Batch.findByIdAndUpdate(
      identity,
      { title: newTitle },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    res.status(200).json({ success: true, updatedBatch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/delete-batch/:id", fetchUser, async (req, res) => {
  try {
    const identity = req.params.id;

    const batch = await Batch.findOne({ _id: identity });

    if (!batch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    await batch.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Batch Delete Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/all-batch/:id", fetchUser, async (req, res) => {
  try {
    const identity = req.params.id;

    const batch = await Batch.find({ courseId: identity }).populate('courseId').exec();

    if (!batch || batch.length === 0) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    res.status(200).json({ success: true, batch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/single-batch/:id", fetchUser, async (req, res) => {
  try {
    const identity = req.params.id;

    const batch = await Batch.find({_id: identity});

    if (!batch || batch.length === 0) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    res.status(200).json({ success: true, batch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


module.exports = router;
