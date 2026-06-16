'use client';

import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../contexts/InterviewContext";
import { useParams } from "next/navigation";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const params = useParams();
    const interviewId = params?.interviewId;

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response && response.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response?.interviewReport;
    };

    const getReportById = async (id) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(id);
            if (response && response.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    };

    const getReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            if (response && response.interviewReports) {
                setReports(response.interviewReports);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

        return response?.interviewReports || [];
    };

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [ interviewId ]);

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
};
