const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');


const interviewRouter = express.Router();



/**
 * @route POST /api/interview
 * @desc Generate interview report based on candidate's resume, self description and job description
 * @access PRIVATE
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController );

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


/**
 * @route DELETE /api/interview/report/:reportId
 * @description Delete a single interview report by id (must belong to authenticated user).
 * @access private
 */
interviewRouter.delete("/report/:reportId", authMiddleware.authUser, interviewController.deleteReportController)


module.exports = interviewRouter;