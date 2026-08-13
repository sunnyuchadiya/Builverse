const router = require("express").Router();
const controller = require("../controllers/course.controller");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const { createCourse } = require("../validations/course.validation");

router.get("/", controller.list);
router.get("/:slug", controller.getBySlug);
router.post("/", auth(), validate(createCourse), controller.create);

module.exports = router;