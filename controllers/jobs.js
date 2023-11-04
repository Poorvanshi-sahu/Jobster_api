const { StatusCodes } = require("http-status-codes");
const { BadRequestError, notFoundError } = require("../errors");
const Job = require("../models/jobs");

const getAllJobs = async (req, res) => {
  debugger;
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new notFoundError(`No job found with id ${jobId}`);
  }

  console.log(userId, jobId, job);

  res.status(StatusCodes.OK).json({ job });
};

const updatejob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new notFoundError("Job not found with that id");
  }

  res.status(StatusCodes.OK).json({ job });
};

const deletejob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete(
    { _id: jobId, createdBy: userId },
    { new: true }
  );

  if (!job) {
    throw new notFoundError(`No Job with the id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updatejob,
  deletejob,
};
