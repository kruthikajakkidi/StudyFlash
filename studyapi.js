import express from "express";
import OpenAI from "openai";
import { StudyModel } from '../models/StudyModel.js'; 

export const studyApp = express.Router();

// Groq client setup
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});
// Generate study plan
studyApp.post("/plans", async (req, res) => {
    try {
        // Get request data
        const { topic, format, level } = req.body;
        // Prompt for AI
        const prompt = `Create a study plan for ${topic}. Format: ${format}. Level: ${level}.`;
        // Call AI model
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
        });
        // Extract AI response
        const generatedPlan = completion.choices[0].message.content;
        // Save plan to MongoDB
        const newPlan = new StudyModel({
            topic,
            format,
            level,
            generatedPlan
        });
        await newPlan.save();
        console.log("Plan saved to MongoDB");
        // Send response
        res.json({
            message: "AI study plan generated and saved!",
            plan: generatedPlan
        });
    } catch (err) {
        // Handle errors
        console.error("Error:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

