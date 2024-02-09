const router = require("express").Router();
const { verifyJwtToken } = require("../middleware/auth");

const { addCategory } = require("../controllers/category");
const { editCategory } = require("../controllers/category");
const { deleteCategory } = require("../controllers/category");
const { getAllCategory } = require("../controllers/category");

router.post("/add-category", verifyJwtToken, addCategory);
router.patch("/edit-category", verifyJwtToken, editCategory);
router.delete("/delete-category/:id", verifyJwtToken, deleteCategory);
router.get("/all-categories", verifyJwtToken, getAllCategory);

module.exports = router;
