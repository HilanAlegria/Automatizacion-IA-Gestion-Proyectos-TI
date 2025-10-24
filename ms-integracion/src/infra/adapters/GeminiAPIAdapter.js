

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Secrets } from '../config/secrets.js';

const ai = new GoogleGenerativeAI(Secrets.getGeminiKey());

const JIRA_SCHEMA = {
    type: "object",
    properties: {
        summary: { type: "string", description: "Breve resumen de la tarea o bug." },
        description: { type: "string", description: "Descripción detallada y contexto de la solicitud del usuario." },
        priority: { type: "string", enum: ["Highest", "High", "Medium", "Low"], description: "Prioridad basada en la urgencia percibida en la solicitud." },
        issueType: { type: "string", enum: ["Bug", "Task", "Story", "Epic"], description: "Tipo de tarea en Jira." },
        projectKey: { type: "string", description: "Clave del proyecto Jira, debe ser 'SINERGIA'." }
    },
    required: ["summary", "description", "priority", "issueType", "projectKey"]
};

export const GeminiAPIAdapter = {
    /**
     * @description
     * @param {string} prompt
     * @returns {Promise<Object>}
     */
    async analyzeText(prompt) {
        if (!prompt) {
            throw new Error("El prompt no puede estar vacío.");
        }

        const model = "gemini-2.5-flash";

        const config = {
            responseMimeType: "application/json",
            responseSchema: JIRA_SCHEMA,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        };

        const contents = [
            {
                role: "user",
                parts: [{ 
                    text: `Convierte la siguiente solicitud de usuario en un objeto JSON que se adhiera estrictamente al esquema proporcionado. El proyecto siempre debe ser 'SINERGIA': ${prompt}`
                }],
            },
        ];

        const response = await ai.models.generateContent({
            model,
            contents,
            config,
        });

        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Error al parsear la respuesta JSON de Gemini:", response.text);
            throw new Error("La IA no pudo generar una respuesta JSON válida para la automatización.");
        }
    }
};