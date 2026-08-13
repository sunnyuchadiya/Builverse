const repo = require("../repositories/course.repository");
const cache = require("../redis/cache");
const ApiError = require("../utils/ApiError");
const { publish } = require("../kafka/producer");
const { TOPICS } = require("../constants");

const CACHE_KEY = "courses:all";

exports.list = async () => {
  const cached = await cache.get(CACHE_KEY);
  if (cached) return cached;
  const courses = await repo.findAll();
  await cache.set(CACHE_KEY, courses, 60);
  return courses;
};

exports.getBySlug = async (slug) => {
  const course = await repo.findBySlug(slug);
  if (!course) throw new ApiError(404, "Course not found");
  return course;
};

exports.create = async (payload) => {
  const course = await repo.create(payload);
  await cache.del(CACHE_KEY);
  await publish(TOPICS.COURSE_CREATED, { id: String(course._id), slug: course.slug });
  return course;
};