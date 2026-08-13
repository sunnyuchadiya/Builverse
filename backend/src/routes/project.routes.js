const router = require("express").Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.route("/").get(getProjects).post(createProject);
router.route("/:id").put(updateProject).patch(updateProject).delete(deleteProject);

module.exports = router;
