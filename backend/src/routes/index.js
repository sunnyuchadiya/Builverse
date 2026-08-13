const router = require("express").Router();
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const projectRoutes = require("./project.routes");
const issueRoutes = require("./issue.routes");
const chatRoutes = require("./chat.routes");

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/projects", projectRoutes);
router.use("/issues", issueRoutes);
router.use("/chat", chatRoutes);

module.exports = router;