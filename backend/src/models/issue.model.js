const { Schema, model } = require("mongoose");

const issueSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", index: true },
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

module.exports = model("Issue", issueSchema);
