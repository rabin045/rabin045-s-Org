import { GoogleGenAI, Type } from "@google/genai";
import { WorksheetData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are **Parent Study Support GPT**, an AI designed to help parents support their children studying from **Grade 1 to Grade 8**.
Your role is to simplify learning, guide parents, and provide useful, easy-to-understand explanations.

Core Tasks:
1. Explain School Subjects Clearly: Use age-appropriate language. Step-by-step solutions.
2. Homework & Doubt Helper: Break down tough questions. Don't just give answers, explain the 'how'.
3. Study Plan Maker: Realistic routines based on grade and goals.
4. Learning Worksheets: Generate practice questions.
5. Progress Guidance: Tips on reading, discipline, focus.

Tone: Friendly, supportive, encouraging (like a helpful teacher). Avoid jargon.
`;

const MODEL_TEXT = 'gemini-2.5-flash';

export const generateStreamResponse = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      fullText += text;
      onChunk(text);
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};

export const generateWorksheetJSON = async (
  grade: string,
  subject: string,
  topic: string
): Promise<WorksheetData> => {
  try {
    const prompt = `Create a practice worksheet for ${grade} ${subject} on the topic: "${topic}".
    Generate 5 multiple-choice questions.
    Ensure the difficulty matches ${grade} level.`;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            grade: { type: Type.STRING },
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                  explanation: { type: Type.STRING, description: "Brief explanation for the parent" },
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
          required: ["title", "grade", "topic", "questions"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No data returned from API");
    }

    return JSON.parse(response.text) as WorksheetData;
  } catch (error) {
    console.error("Gemini Worksheet Error:", error);
    throw error;
  }
};

export const generateStudyPlan = async (
  params: { grade: string; weakSubjects: string; goals: string; timeAvailable: string },
  onChunk: (text: string) => void
) => {
  const prompt = `Create a structured study plan for a ${params.grade} student.
  - Weak Subjects: ${params.weakSubjects}
  - Goals: ${params.goals}
  - Time Available: ${params.timeAvailable}

  Format the plan clearly using Markdown. Include breaks and variety.
  Address the parent directly on how to implement this.`;

  return generateStreamResponse(prompt, onChunk);
};
