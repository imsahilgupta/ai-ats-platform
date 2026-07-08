require("dotenv").config();
const mongoose = require("mongoose");
const mockInterviewSessionModel = require("../models/mockInterviewSession.model");

async function run() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    const sessionId = "6a4b1bbd7a3c78c262ca0217";
    console.log("Searching for session ID:", sessionId);
    const session = await mockInterviewSessionModel.findById(sessionId);
    if (!session) {
        console.log("Session not found!");
    } else {
        console.log("Session Details:");
        console.log(JSON.stringify(session, null, 2));
    }
    await mongoose.disconnect();
}

run().catch(console.error);
