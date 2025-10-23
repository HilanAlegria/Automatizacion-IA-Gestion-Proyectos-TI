
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { Secrets } from "../config/secrets";

const JIRA_FUNCTION_SPEC = {
    functionDeclarations: [
        {
            name: "create_jira_issue",
            description: "Crea una nueva tarea de Jira basada en la solicitud de un usuario. Es esencial capturar el título, la descripción, el tipo de tarea y la clave del proyecto.",
            parameters: {
                type: "OBJECT",
                properties: {
                    projectKey: {
                        type: "STRING",
                        description: "La clave del proyecto de Jira (ej. 'SINERGIA' o 'PMBOK'). Obligatorio. Usar 'SINERGIA' por defecto si no es claro.",
                    },
                    title: {
                        type: "STRING",
                        description: "Título breve y descriptivo para la tarea de Jira.",
                    },
                    description: {
                        type: "STRING",
                        description: "Descripción detallada de la tarea y el contexto proporcionado por el usuario.",
                    },
                    issueType: {
                        type: "STRING",
                        description: "El tipo de tarea (ej. 'Bug', 'Task', 'Story'). Usar 'Task' por defecto.",
                    },
                    riskLevel: {
                        type: "STRING",
                        description: "Nivel de riesgo percibido para la tarea ('Alto', 'Medio', 'Bajo'). Usar 'Medio' por defecto.",
                    }
                },
                required: ["projectKey", "title", "description"],
            },
        },
    ],
};


export class GeminiAdapter {
    constructor() {
        this.ai = new GoogleGenerativeAI({ apiKey: Secrets.getGeminiKey() }); 
        this.model = 'gemini-2.5-flash'; 
    }

    /**
     * @param {string} prompt
     * @returns {Promise<Object|null>}
     */
    async analyzePromptForJiraCreation(prompt) {
        const systemInstruction = "Eres un Asistente de Proyectos que ayuda a automatizar la creación de tareas en Jira. Analiza el siguiente prompt y usa la herramienta 'create_jira_issue' para extraer los datos necesarios.";

        try {
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                    systemInstruction: systemInstruction,
                    tools: [JIRA_FUNCTION_SPEC],
                },
            });

            if (response.functionCalls && response.functionCalls.length > 0) {
                console.log("Gemini ha detectado intención de creación de tarea.");
                return response.functionCalls[0];
            }

            console.log("Gemini no detectó intención de creación de tarea. Respuesta:", response.text);
            return null;
            
        } catch (error) {
            console.error("Error al comunicarse con la API de Gemini:", error.message);
            throw new Error("Fallo en el servicio de Integración de IA.");
        }
    }
}