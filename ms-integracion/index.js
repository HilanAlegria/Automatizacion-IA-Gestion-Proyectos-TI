import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const cors = require('cors');

import { Secrets } from './src/infra/config/secrets.js'; 

const app = express();
const PORT = process.env.INTEGRATION_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'MS-Integracion', 
        message: 'Adaptadores listos para el Orquestador.',
        configReady: !!Secrets.getGeminiKey()
    });
});

try {
    Secrets.getGeminiKey(); 
    
    app.listen(PORT, () => {
        console.log(`MS-Integración corriendo en http://localhost:${PORT}`);
        console.log("Adaptadores listos: Gemini, Jira, ServiceNow.");
    });
} catch (error) {
    console.error("CRÍTICO: El MS-Integración no pudo inicializarse por error de configuración.");
    console.error(error.message);
    process.exit(1); 
}