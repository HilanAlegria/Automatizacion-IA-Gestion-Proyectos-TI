import 'dotenv/config';

const requireSecret = (key) => {
    const secret = process.env[key];
    if (!secret) {
        console.error(`ERROR: La variable de entorno ${key} no está configurada.`);
        throw new Error(`CRÍTICO: Falta la configuración para ${key}. Verifique su archivo .env.`);
    }
    return secret;
};

export const Secrets = {
    getGeminiKey: () => requireSecret('GEMINI_API_KEY'),
    getJiraToken: () => requireSecret('JIRA_API_TOKEN'),
    getJiraUrl: () => process.env.JIRA_URL || 'https://sinergia-demo.atlassian.net',
    getServiceNowToken: () => process.env.SNOW_API_TOKEN || 'SNOW_DEMO_TOKEN'
};