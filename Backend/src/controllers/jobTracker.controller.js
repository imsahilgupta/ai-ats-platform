const jobApplicationModel = require("../models/jobApplication.model");

async function createJobApplicationController(req, res) {
    try {
        const { company, role, jobDescription, status, interviewDate, notes } = req.body;
        if (!company || !role) {
            return res.status(400).json({ message: "Company and role are required." });
        }

        const app = await jobApplicationModel.create({
            user: req.user.id,
            company,
            role,
            jobDescription: jobDescription || "",
            status: status || "Saved",
            interviewDate: interviewDate || null,
            notes: notes || ""
        });

        res.status(201).json({ message: "Job application tracked.", application: app });
    } catch (error) {
        console.error("Create job application error:", error);
        res.status(500).json({ message: "Failed to track job application.", error: error.message });
    }
}

async function getJobApplicationsController(req, res) {
    try {
        const applications = await jobApplicationModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ applications });
    } catch (error) {
        console.error("Get job applications error:", error);
        res.status(500).json({ message: "Failed to load applications.", error: error.message });
    }
}

async function updateJobApplicationController(req, res) {
    try {
        const { id } = req.params;
        const { company, role, jobDescription, status, interviewDate, notes } = req.body;

        const app = await jobApplicationModel.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { company, role, jobDescription, status, interviewDate, notes },
            { new: true }
        );

        if (!app) {
            return res.status(404).json({ message: "Job application not found." });
        }

        res.status(200).json({ message: "Job application updated.", application: app });
    } catch (error) {
        console.error("Update job application error:", error);
        res.status(500).json({ message: "Failed to update job application.", error: error.message });
    }
}

async function deleteJobApplicationController(req, res) {
    try {
        const { id } = req.params;
        const app = await jobApplicationModel.findOneAndDelete({ _id: id, user: req.user.id });
        if (!app) {
            return res.status(404).json({ message: "Job application not found." });
        }
        res.status(200).json({ message: "Job application deleted successfully." });
    } catch (error) {
        console.error("Delete job application error:", error);
        res.status(500).json({ message: "Failed to delete job application.", error: error.message });
    }
}

module.exports = {
    createJobApplicationController,
    getJobApplicationsController,
    updateJobApplicationController,
    deleteJobApplicationController
};
