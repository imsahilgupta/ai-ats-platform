require("dotenv").config();
const mongoose = require("mongoose");
const mockInterviewSessionModel = require("../models/mockInterviewSession.model");
const mockCtrl = require("../controllers/mockInterview.controller");

async function run() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    // Simulate req, res
    const req = {
        user: { id: "6a480bb5eb9ab44e2ee51379" },
        body: {
            sessionId: "6a4b1bbd7a3c78c262ca0217",
            answer: "Hello testing",
            durationSeconds: 10
        }
    };
    
    const res = {
        status: function(code) {
            console.log("Status called with:", code);
            return this;
        },
        json: function(data) {
            console.log("Json called with:", JSON.stringify(data, null, 2));
            return this;
        }
    };
    
    try {
        await mockCtrl.submitAnswerController(req, res);
    } catch(err) {
        console.error("CRASHED:", err);
    }
    
    await mongoose.disconnect();
}

run().catch(console.error);
