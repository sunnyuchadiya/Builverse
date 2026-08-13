const service = require("../services/course.service");
const asyncHandler = require("../utils/asyncHandler");

exports.list = asyncHandler(async (_req, res) => {
  res.json({ data: await service.list() });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  res.json({ data: await service.getBySlug(req.params.slug) });
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await service.create(req.body) });
});