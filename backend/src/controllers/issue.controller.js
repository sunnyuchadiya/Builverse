const Issue = require("../models/issue.model");

// GET /api/v1/issues
exports.getIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ resolved: 1, createdAt: -1 });
    res.json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/issues
exports.createIssue = async (req, res, next) => {
  try {
    const { title, priority, projectId } = req.body;
    const issue = await Issue.create({
      title,
      priority: priority || "Medium",
      projectId: projectId || null,
      userId: req.user?._id,
    });
    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/issues/:id/toggle
exports.toggleIssueResolved = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

    issue.resolved = !issue.resolved;
    issue.resolvedAt = issue.resolved ? new Date() : null;
    await issue.save();

    res.json({ success: true, data: issue });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/issues/:id
exports.deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });
    res.json({ success: true, message: "Issue deleted successfully" });
  } catch (err) {
    next(err);
  }
};
