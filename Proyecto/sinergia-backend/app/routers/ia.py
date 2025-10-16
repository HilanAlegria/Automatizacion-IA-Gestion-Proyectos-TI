# sinergia-backend/app/routers/ia.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.dependencies import get_current_user_jira_token # Reutiliza la dependencia de seguridad

router = APIRouter(
    prefix="/ia",
    tags=["ia"],
    dependencies=[Depends(get_current_user_jira_token)], 
)

# ----------------------------------------------------
# Modelos de Datos (Pydantic)
# ----------------------------------------------------

class Source(BaseModel):
    """Representa la fuente de información (RAG) usada para la respuesta."""
    type: str  # JIRA, DOCUMENTO, NORMA
    id: str    # SINERGIA-15, P1. Plan_Gestión_del_Alcance, ISO/IEC 29148
    description: str

class ChatRequest(BaseModel):
    """Estructura esperada en el POST del frontend."""
    project_key: str  # La clave del proyecto de Jira seleccionado (e.g., 'SINERGIA')
    query: str        # La pregunta del usuario (e.g., '¿Cuáles son los riesgos?')
    history: List[Dict[str, str]] = [] # Historial de conversación (para contexto)

class ChatResponse(BaseModel):
    """Estructura de la respuesta enviada al frontend."""
    ai_text: str
    sources: List[Source]
    
# ----------------------------------------------------
# Lógica de los Endpoints
# ----------------------------------------------------

# --- A. RAG para Scrum (Vista IAChatScrum.vue) ---
@router.post(
    "/rag-scrum", 
    response_model=ChatResponse
)
async def rag_scrum_assistant(
    request: ChatRequest,
    jira_token: str = Depends(get_current_user_jira_token)
):
    """
    Procesa una consulta sobre gestión de proyectos Scrum, analizando la documentación
    y datos de Jira para un proyecto específico.
    """
    
    # 1. Lógica de RAG:
    #    a. Usar request.project_key para obtener issues, sprints, etc. de Jira.
    #    b. Usar request.query para buscar en tu base de datos documental (RAG).
    #    c. Integrar las normas (PMBOK, ISO 29148) para la respuesta contextual.
    
    # 2. Respuesta simulada (Placeholder):
    ai_response = f"Simulación de respuesta RAG Scrum para {request.project_key}: El riesgo más alto, según el Plan de Gestión del Alcance, es el *Scope Creep*. Deben revisar la Trazabilidad de Requisitos (RTM) de la Issue **{request.project_key}-42**."
    
    simulated_sources = [
        Source(type="JIRA", id=f"{request.project_key}-42", description="Issue con alto riesgo no mitigado."),
        Source(type="DOCUMENTO", id="P1. Alcance", description="Sección de Control del Alcance (PMBOK, pág. 12)."),
        Source(type="NORMA", id="ISO/IEC/IEEE 29148", description="Requisito de Trazabilidad REQ-STD-01."),
    ]

    return ChatResponse(ai_text=ai_response, sources=simulated_sources)

# --- B. RAG para XP (Vista IAChatXP.vue) ---
@router.post(
    "/rag-xp", 
    response_model=ChatResponse
)
async def rag_xp_assistant(
    request: ChatRequest,
    jira_token: str = Depends(get_current_user_jira_token)
):
    """
    Procesa una consulta sobre la aplicación de prácticas XP (TDD, Refactoring, calidad)
    en el proyecto.
    """
    
    # 1. Lógica de RAG:
    #    a. Se enfocaría en métricas de código, cobertura de pruebas y deuda técnica.
    #    b. Utiliza la norma ISO/IEC 25010 y documentación de XP.

    # 2. Respuesta simulada (Placeholder):
    ai_response = f"Simulación de respuesta RAG XP para {request.project_key}: La calidad del código es media. Según la norma **ISO/IEC 25010**, la característica de **Mantenibilidad** está comprometida por la baja Cobertura de Pruebas (TCI=78%). Recomiendo la práctica de **Refactoring Continuo** antes del próximo Pull Request en Git."
    
    simulated_sources = [
        Source(type="JIRA", id=f"{request.project_key}-18", description="Issue con baja Cobertura de Prueba Unitaria."),
        Source(type="DOCUMENTO", id="P5. Plan Calidad", description="Métrica TCI, umbral de calidad."),
        Source(type="NORMA", id="ISO/IEC 25010", description="Métricas de Mantenibilidad (REQ-STD-01)."),
    ]

    return ChatResponse(ai_text=ai_response, sources=simulated_sources)