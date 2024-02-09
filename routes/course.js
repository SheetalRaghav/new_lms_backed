const router = require("express").Router();
const { verifyJwtToken } = require("../middleware/auth");

const { addCourse } = require("../controllers/course");
const { editCourse } = require("../controllers/course");
const { deleteCourse } = require("../controllers/course");
const { getAllCourse } = require("../controllers/course");

router.post("/add-course", verifyJwtToken, addCourse);
router.patch("/edit-course", verifyJwtToken, editCourse);
router.delete("/delete-course/:id", verifyJwtToken, deleteCourse);
router.get("/all-course", verifyJwtToken, getAllCourse);

module.exports = router;
