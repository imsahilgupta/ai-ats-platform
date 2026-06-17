const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const {
    createJobApplicationController,
    getJobApplicationsController,
    updateJobApplicationController,
    deleteJobApplicationController
} = require("../controllers/jobTracker.controller");

const router = express.Router();

router.get("/", authUser, getJobApplicationsController);
router.post("/", authUser, createJobApplicationController);
router.put("/:id", authUser, updateJobApplicationController);
router.delete("/:id", authUser, deleteJobApplicationController);

module.exports = router;
