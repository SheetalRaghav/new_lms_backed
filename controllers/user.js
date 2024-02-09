const { userModel } = require("../db/db");
const { createUserSchema } = require("../requestSchema/user");
const { loginUserSchema } = require("../requestSchema/user");
const {
  validationError,
  successResponse,
} = require("../helper/responseTemplate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error && error.details) {
      return res.status(422).json({ errors: error.details });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(value.password, saltRounds);
    const newUser = new userModel({
      ...value,
      password: passwordHash,
    });

    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    user.token = token;
    await user.save();
    res.status(201).json(await successResponse({ success: true, user, token }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error && error.details) {
      return res.status(422).json({ errors: error.details });
    }
    const { email, password } = value;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    user.token = token;
    await user.save();

    res.status(200).json(await successResponse({ success: true, user }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required in the request body" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(await successResponse({ success: true, user }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

const fetchAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(await successResponse({ success: true, users }));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { identity, result } = req.body;

    const user = await userModel.findOne({ _id: identity });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, error: "Permission denied" });
    }

    const userToBlock = await userModel.findOneAndUpdate(
      { _id: req.body.identity },
      { blocked: req.body.result },
      { new: true }
    );

    if (!userToBlock) {
      return res
        .status(404)
        .json({ success: false, error: "User to block not found" });
    }

    res
      .status(200)
      .json(
        await successResponse({ success: true, updateResponse: userToBlock })
      );
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({ errors: validationError(err) });
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { identity, newRole } = req.body;

    const user = await userModel.findOne({ _id: identity });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, error: "Permission denied" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: identity },
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: "User to update not found" });
    }

    res.status(200).json({ success: true, updateResponse: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, courses } = req.body;

    await userModel
      .findByIdAndUpdate(userId, { courses: courses })
      .then(() => {
        res.json({
          success: true,
          message: "User details updated successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, error: err.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  fetchAllUser,
  blockUser,
  updateUserRole,
  updateUser,
};
