const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  createJob,
  getJob,
  updatejob,
  deletejob,
  showStats,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);

router.route("/stats").get(showStats);

router.route("/:id").get(getJob).patch(updatejob).delete(deletejob);

module.exports = router;
