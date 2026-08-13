const Project = require("../models/project.model");

// GET /api/v1/projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/projects
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, tag, progress, status } = req.body;
    const project = await Project.create({
      name,
      description,
      tag: tag || "Active",
      progress: progress || 0,
      status: status || "active",
      userId: req.user?._id,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};
