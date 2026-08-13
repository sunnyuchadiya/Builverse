const router = require("express").Router();
const {
  getIssues,
  createIssue,
  toggleIssueResolved,
  deleteIssue,
} = require("../controllers/issue.controller");

router.route("/").get(getIssues).post(createIssue);
router.route("/:id/toggle").patch(toggleIssueResolved);
router.route("/:id").delete(deleteIssue);

module.exports = router;
