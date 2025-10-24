
import express from 'express';
const router = express.Router();

router.post('/analyze', async (req, res) => {
    const { prompt } = req.body;
    
    const structuredTask = {
        summary: `Tarea IA: ${prompt.substring(0, 45)}...`,
        description: `Tarea generada por SinergIA (flujo automatizado): ${prompt}`,
        priority: prompt.toLowerCase().includes('crítico') ? 'Highest' : 'Medium',
        issueType: prompt.toLowerCase().includes('bug') ? 'Bug' : 'Task',
        projectKey: 'SINERGIA'
    };
    
    try {
        console.log('[INT:G] Prompt analizado y estructurado.');
        res.json(structuredTask);

    } catch (error) {
        console.error("Error en el análisis de Gemini:", error);
        res.status(500).json({ message: "Error al estructurar el prompt con la IA." });
    }
});

export default router;