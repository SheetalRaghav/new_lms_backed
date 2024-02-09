const mongoose = require("mongoose");
const moment = require("moment");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      required: true,
    },
    data: [],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt).format("DD MMM YYYY");
        ret.updatedAt = moment(ret.updatedAt).format("DD MMM YYYY");
        return ret;
      },
    },
  }
);

module.exports = {
  CourseSchema,
};
