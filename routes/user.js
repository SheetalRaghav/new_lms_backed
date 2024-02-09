const router = require("express").Router();
const { verifyJwtToken } = require("../middleware/auth");

const { createUser } = require("../controllers/user");
const { loginUser } = require("../controllers/user");
const { getUser } = require("../controllers/user");
const { fetchAllUser } = require("../controllers/user");
const { blockUser } = require("../controllers/user");
const { updateUserRole } = require("../controllers/user");
const { updateUser } = require("../controllers/user");

router.post("/newuser", createUser);
router.post("/login", verifyJwtToken, loginUser);
router.get("/getuser", verifyJwtToken, getUser);
router.get("/fetchallusers", verifyJwtToken, fetchAllUser);
router.post("/blockuser", verifyJwtToken, blockUser);
router.patch("/updateUserRole", verifyJwtToken, updateUserRole);
router.patch("/updateuser", verifyJwtToken, updateUser);

module.exports = router;
