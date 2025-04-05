const mongoose = require("mongoose");

const practiceAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A practice area must have a title"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "A practice area must have a description"],
  },
  image: {
    type: String,
    required: [true, "A practice area must have an image"],
  },
  content: {
    type: String,
    required: [true, "A practice area must have detailed content"],
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

practiceAreaSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PracticeArea = mongoose.model("PracticeArea", practiceAreaSchema);

module.exports = PracticeArea;
