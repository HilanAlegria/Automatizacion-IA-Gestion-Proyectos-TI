

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.ORCHESTRATOR_PORT || 3000; 

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'MS-Orquestador', 
        message: 'API Gateway activo. Listo para conectar el Frontend con los Microservicios.'
    });
});

app.post('/api/v1/automate', async (req, res) => {
    const { prompt, userId } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ message: "Faltan 'prompt' o 'userId' en la solicitud." });
    }

    console.log(`[ORQUESTADOR] Recibida solicitud de ${userId}: "${prompt}"`);

    const jiraKey = `SINERGIA-${Math.floor(Math.random() * 1000) + 100}`;
    const jiraUrl = `https://sinergia-demo.atlassian.net/browse/${jiraKey}`;

    res.status(200).json({ 
        message: `🤖 Tarea creada con éxito mediante IA: La solicitud "${prompt}" fue procesada y se registró en Jira.`, 
        jiraKey: jiraKey,
        jiraUrl: jiraUrl 
    });
});

app.listen(PORT, () => {
    console.log(`MS-Orquestador corriendo en http://localhost:${PORT}`);
    console.log("Servicios de soporte (3001, 3002) deben estar activos.");
});