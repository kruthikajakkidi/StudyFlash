import express from "express";
import OpenAI from "openai";
// FIX: Ensure this path correctly points to your models folder
import { StudyModel } from '../models/StudyModel.js'; 

export const studyApp = express.Router();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

studyApp.post("/plans", async (req, res) => {
    try {
        const { topic, format, level } = req.body;

        const prompt = `Create a study plan for ${topic}. Format: ${format}. Level: ${level}.`;

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Use the supported model
            messages: [{ role: "user", content: prompt }]
        });

        const generatedPlan = completion.choices[0].message.content;

        // CRITICAL FIX: Ensure 'await' is used and all fields match the Schema
        const newPlan = new StudyModel({
            topic,
            format,
            level,
            generatedPlan // Ensure your Schema in StudyModel.js has this field!
        });

        await newPlan.save(); 
        console.log(" Data successfully saved to MongoDB");

        res.json({
            message: "AI study plan generated and saved!",
            plan: generatedPlan
        });

    } catch (err) {
        console.error(" Database or AI Error:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});