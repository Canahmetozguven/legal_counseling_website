const mongoose = require("mongoose");

const homeCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A card must have a title"],
      trim: true,
      maxlength: [
        100,
        "A title must have less than or equal to 100 characters",
      ],
    },
    description: {
      type: String,
      required: [true, "A card must have a description"],
      trim: true,
      maxlength: [
        500,
        "A description must have less than or equal to 500 characters",
      ],
    },
    image: {
      type: String,
      default: null,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    linkText: {
      type: String,
      trim: true,
      default: "Learn More",
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const HomeCard = mongoose.model("HomeCard", homeCardSchema);

module.exports = HomeCard;
