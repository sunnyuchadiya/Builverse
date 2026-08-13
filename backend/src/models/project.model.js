const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    tag: { type: String, default: "Active" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

module.exports = model("Project", projectSchema);
