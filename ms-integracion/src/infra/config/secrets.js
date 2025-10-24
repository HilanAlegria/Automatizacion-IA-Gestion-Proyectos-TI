
//import * as dotenv from 'dotenv';
//dotenv.config();

export const Secrets = {
    /** @returns {string} */
    getGeminiKey: () => {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("CRÍTICO: GEMINI_API_KEY no definida en el archivo .env.");
        return key;
    },

    /** @returns {string} */
    getJiraEmail: () => {
        const email = process.env.JIRA_USER_EMAIL;
        if (!email) throw new Error("CRÍTICO: JIRA_USER_EMAIL no definida en el archivo .env.");
        return email;
    },

    /** @returns {string} */
    getJiraToken: () => {
        const token = process.env.JIRA_API_TOKEN;
        if (!token) throw new Error("CRÍTICO: JIRA_API_TOKEN no definida en el archivo .env.");
        return token;
    },

    /** @returns {string} */
    getJiraBaseUrl: () => {
        const url = process.env.JIRA_CLOUD_URL;
        if (!url) throw new Error("CRÍTICO: JIRA_CLOUD_URL no definida en el archivo .env. Usar formato https://tudominio.atlassian.net");
        return `${url.replace(/\/$/, '')}/rest/api/3/issue`; 
    }
};