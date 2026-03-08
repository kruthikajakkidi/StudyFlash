import mongoose from "mongoose";

const StudySchema = new mongoose.Schema({
    topic: { type: String, required: true, trim: true },
    format: { 
        type: String, 
        required: true, 
        enum: ["paragraph", "bullet points", "flowchart", "outlines"] 
    },
    level: { 
        type: String, 
        required: true, 
        enum: ["basic", "medium", "advance"] 
    },
    generatedPlan: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const StudyModel = mongoose.model("StudyPlan", StudySchema);