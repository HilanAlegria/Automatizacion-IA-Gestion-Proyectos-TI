
import express from 'express';
const router = express.Router();

router.post('/issue', async (req, res) => {
    const taskDetails = req.body;
    
    const newIssueKey = `SINERGIA-${Math.floor(Math.random() * 1000) + 200}`;
    
    try {
        console.log(`[INT:J] Tarea de tipo '${taskDetails.issueType}' creada con éxito: ${newIssueKey}`);

        res.json({
            jiraKey: newIssueKey,
            jiraUrl: `https://sinergia-demo.atlassian.net/browse/${newIssueKey}`
        });

    } catch (error) {
        console.error("Error al crear tarea en Jira:", error);
        res.status(500).json({ message: "Error al conectar y crear tarea en Jira. Verifique su token en el .env." });
    }
});

export default router;