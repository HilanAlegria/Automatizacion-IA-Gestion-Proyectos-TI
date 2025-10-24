
import express from 'express';
import { JiraRestAdapter } from '../infra/adapters/JiraRestAdapter.js';
const router = express.Router();

router.post('/issue', async (req, res) => {
    const taskDetails = req.body;
    
    try {
        const jiraResult = await JiraRestAdapter.createIssue(taskDetails); 
        
        console.log(`[INT:J] Tarea de tipo '${taskDetails.issueType}' creada con éxito: ${jiraResult.jiraKey}`);

        res.json({
            jiraKey: jiraResult.jiraKey,
            jiraUrl: jiraResult.jiraUrl
        });

    } catch (error) {
        console.error("Error al crear tarea en Jira:", error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;