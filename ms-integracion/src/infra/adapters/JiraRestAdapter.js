
import axios from 'axios';
import { Secrets } from '../config/secrets.js'; 

const JIRA_BASE_URL = 'https://jiratmario-1761191600669.atlassian.net/rest/api/3/issue'; 
const JIRA_USER_EMAIL = Secrets.getJiraEmail(); 
const JIRA_API_TOKEN = Secrets.getJiraToken(); 

const AUTH_HEADER = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');


export const JiraRestAdapter = {
    /**
     * @description
     * @param {Object} taskDetails
     * @returns {Promise<{jiraKey: string, jiraUrl: string}>}
     */
    async createIssue(taskDetails) {
        if (!JIRA_API_TOKEN || !JIRA_USER_EMAIL) {
            throw new Error("Credenciales de Jira (JIRA_EMAIL/JIRA_TOKEN) no configuradas en Secrets.");
        }
        
        const issueData = {
            fields: {
                project: { key: taskDetails.projectKey },
                summary: taskDetails.summary,
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", text: taskDetails.description }]
                        }
                    ]
                },
                issuetype: { name: taskDetails.issueType },
                priority: { name: taskDetails.priority }
            }
        };

        try {
            const response = await axios.post(JIRA_BASE_URL, issueData, {
                headers: {
                    'Authorization': `Basic ${AUTH_HEADER}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const jiraKey = response.data.key;
            return {
                jiraKey: jiraKey,
                jiraUrl: `https://${JIRA_BASE_URL.split('/')[2]}/browse/${jiraKey}`
            };

        } catch (error) {
            console.error("ERROR AL LLAMAR A LA API DE JIRA:", error.response ? error.response.data : error.message);
            throw new Error(`Fallo en la creación de la tarea en Jira. Código: ${error.response ? error.response.status : 'N/A'}`);
        }
    }
};