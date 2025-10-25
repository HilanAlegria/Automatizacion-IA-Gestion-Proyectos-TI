
import * as dotenv from 'dotenv';
dotenv.config();

function getGeminiApiKey() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("CRITICO: GEMINI_API_KEY no definida en el archivo .env.");
    }
    return key;
}

function getJiraEmail() {
    return process.env.JIRA_USER_EMAIL;
}

function getJiraToken() {
    return process.env.JIRA_API_TOKEN;
}

function getJiraCloudUrl() {
    const url = process.env.JIRA_CLOUD_URL;
    if (!url) throw new Error("CRITICO: JIRA_CLOUD_URL no definida en el archivo .env. Usar formato https://tudominio.atlassian.net");
    return url;
}

function getServiceNowToken() {
    return process.env.SNOW_API_TOKEN;
}

function getIntegrationPort() {
    return process.env.INTEGRATION_PORT ? parseInt(process.env.INTEGRATION_PORT) : 3001;
}

export const Secrets = {
    getGeminiApiKey,
    getJiraEmail,
    getJiraToken,
    getJiraCloudUrl,
    getServiceNowToken,
    getIntegrationPort
};