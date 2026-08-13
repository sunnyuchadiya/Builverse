const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    level: { type: String, enum: ["core", "advanced", "new"], default: "core" },
    summary: String,
    lessons: [{ title: String, durationMin: Number, videoUrl: String }],
    mentor: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = model("Course", courseSchema);