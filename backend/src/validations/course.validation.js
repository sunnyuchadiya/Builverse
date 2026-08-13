const { z } = require("zod");

exports.createCourse = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  level: z.enum(["core", "advanced", "new"]).optional(),
  summary: z.string().optional(),
});