

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Secrets } from '../config/secrets.js'; 

let aiInstance = null;

/**
 * @description
 * @returns {GoogleGenerativeAI}
 */
function getGeminiClient() {
    if (aiInstance === null) {
        try {
            const apiKey = Secrets.getGeminiKey();
            if (!apiKey) {
                 throw new Error("Clave API de Gemini no disponible.");
            }
            aiInstance = new GoogleGenerativeAI(apiKey);
            console.log("[INT:G] Cliente Gemini inicializado con éxito.");
        } catch (error) {
            console.error("Fallo al inicializar cliente Gemini:", error.message);
            return { models: { generateContent: () => { throw new Error(error.message); } } };
        }
    }
    return aiInstance;
}

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
    async analyzeText(prompt) {
        if (!prompt) {
            throw new Error("El prompt no puede estar vacío.");
        }
        
        const ai = getGeminiClient();
        
        if (typeof ai.models?.generateContent !== 'function') {
            throw new Error("Fallo de inicialización de Gemini: La clave API no es válida o está ausente.");
        }
        
        const model = "gemini-2.5-flash"; 
        
        const config = {
            responseMimeType: "application/json",
            responseSchema: JIRA_SCHEMA,
            safetySettings: [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }],
        };

        const contents = [
            {
                role: "user",
                parts: [{ 
                    text: `Convierte la siguiente solicitud de usuario en un objeto JSON que se adhiera estrictamente al esquema proporcionado. El proyecto siempre debe ser 'SINERGIA' y no añadas texto extra, solo el JSON: ${prompt}`
                }],
            },
        ];

        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config,
            });

            const jsonText = response.text.trim(); 
            
            if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
                 console.error("Respuesta inesperada de Gemini:", jsonText);
                 throw new Error("La IA no devolvió un formato JSON válido.");
            }

            return JSON.parse(jsonText);
            
        } catch (e) {
            console.error("Fallo completo en la llamada a Gemini:", e.message);
            throw new Error(`Error en la llamada a la API de Gemini: ${e.message}`);
        }
    }
};