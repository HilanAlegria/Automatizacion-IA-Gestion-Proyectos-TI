# app/routers/jira.py
from fastapi import APIRouter, Depends, status
from app.dependencies import get_current_user_jira_token
from typing import List, Dict

router = APIRouter(
    prefix="/jira",
    tags=["jira"],
    dependencies=[Depends(get_current_user_jira_token)], # Aplica protección a todas las rutas
    responses={404: {"description": "No encontrado"}},
)

# Estructura de respuesta que Vue.js espera:
# [{ key: 'SINERGIA', name: 'SinergIA Project' }, ...]

@router.get(
    "/projects", 
    response_model=List[Dict[str, str]], 
    status_code=status.HTTP_200_OK
)
async def get_jira_projects(
    jira_token: str = Depends(get_current_user_jira_token)
):
    """
    Obtiene la lista de proyectos de Jira a los que el usuario tiene acceso.
    Esta función simula la llamada a la Jira REST API.
    """
    
    # NOTA: En la práctica, aquí usarías la librería 'requests' o 'httpx' para
    # llamar a la API REST de Atlassian (e.g., /rest/api/3/project/search)
    # y usarías el 'jira_token' para la autenticación (Bearer Token o Basic Auth).

    print(f"Token de Jira recibido (simulado): {jira_token[:5]}...")

    # -----------------------------------------------------------------
    # SIMULACIÓN DEL ÉXITO DE LA API DE JIRA
    # -----------------------------------------------------------------
    # Retorna la estructura que el Vue.js useProjectStore espera.
    
    simulated_projects = [
        {"key": "SINERGIA", "name": "Plataforma SinergIA (PMBOK)"},
        {"key": "PRJAGILE", "name": "Projecto Ágil Scrum"},
        {"key": "XPDEV", "name": "eXtreme Programming Dev"},
        {"key": "OLDLEGACY", "name": "Sistema Legado (Mantenimiento)"},
    ]
    
    # En el futuro, puedes agregar lógica para filtrar por el token real
    
    return simulated_projects