const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TodoModel = mongoose.model("Todo", TodoSchema);
module.exports = TodoModel;
