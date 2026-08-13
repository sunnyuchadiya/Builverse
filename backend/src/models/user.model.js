const { Schema, model } = require("mongoose");
const { ROLES } = require("../constants");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    avatarUrl: String,
  },
  { timestamps: true },
);

module.exports = model("User", userSchema);