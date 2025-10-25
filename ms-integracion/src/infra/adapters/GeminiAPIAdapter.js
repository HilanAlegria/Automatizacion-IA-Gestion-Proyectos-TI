

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Secrets } from '../config/secrets.js'; 

/** @type {GoogleGenerativeAI | null} */
let aiInstance = null;

/**
 * @description
 * @returns {GoogleGenerativeAI}
 */
function initializeGeminiClient() {
    if (aiInstance === null) {
        try {
            const apiKey = Secrets.getGeminiApiKey(); 

            if (!apiKey) {
                throw new Error("CRITICO: GEMINI_API_KEY está vacía en .env.");
            }

            aiInstance = new GoogleGenerativeAI(apiKey); 
            
            if (!aiInstance.models || typeof aiInstance.models.generateContent !== 'function') {
                 throw new Error("El cliente de GoogleGenerativeAI no se pudo construir. (Clave API rechazada o API no habilitada).");
            }

            console.log("[INT:G] Cliente Gemini inicializado con éxito.");
        } catch (error) {
            const errorMsg = `Fallo de inicialización de Gemini. Verifique si la clave en .env es válida y el servicio 'Generative Language API' está habilitado en Google Cloud. Detalle: ${error.message}`;
            console.error(errorMsg);
            
            aiInstance = { models: { generateContent: () => { throw new Error(errorMsg); } } };
            throw new Error(errorMsg);
        }
    }
    return aiInstance;
}


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
        
        try {
            const ai = initializeGeminiClient(); 
            
            const response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash',
                 contents: [
                    { role: "user", parts: [{ text: prompt }] },
                 ],
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            summary: { type: "string", description: "Título breve y conciso de la tarea." },
                            description: { type: "string", description: "Descripción detallada de la solicitud del usuario." },
                            priority: { type: "string", enum: ["High", "Medium", "Low"], description: "Prioridad de la tarea." },
                            issueType: { type: "string", enum: ["Bug", "Story", "Task"], description: "Tipo de tarea a crear." },
                            projectKey: { type: "string", description: "Clave del proyecto (ej: 'SINERGIA' o 'KAN')." }
                        },
                        required: ["summary", "description", "priority", "issueType", "projectKey"]
                    }
                 }
            });

            return JSON.parse(response.text.trim());

        } catch (error) {
            const keyError = error.message.includes("Fallo de inicialización de Gemini") ? "" : " (El cliente Gemini se inicializó, pero la llamada API falló).";
            console.error("Error en la llamada a Gemini:", error.message);
            throw new Error(`Error en el análisis de Gemini: ${error.message}${keyError}.`);
        }
    }
};