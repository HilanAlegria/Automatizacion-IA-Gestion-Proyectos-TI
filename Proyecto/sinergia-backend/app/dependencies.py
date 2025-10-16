# app/dependencies.py
from fastapi import Header, HTTPException, status
from typing import Annotated

# NOTA: En un entorno de producción, esta función debería decodificar y validar el JWT
# usando una clave secreta (SECRET_KEY) y librerías como python-jose.
# Por ahora, solo verificaremos la presencia del token para simular la protección.

async def get_current_user_jira_token(
    Authorization: Annotated[str, Header()]
):
    """
    Simula la validación del token JWT y extrae el token de acceso a Jira.

    FastAPI espera que el header Authorization venga como: 'Bearer <token>'
    """
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autenticación (Bearer Token)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # -----------------------------------------------------------------
    # SIMULACIÓN DE LA EXTRACCIÓN DEL TOKEN DE JIRA/CREDENCIALES
    # -----------------------------------------------------------------
    # En la vida real, el token de Jira (o credenciales) se extraería del JWT.
    # Aquí, simplemente retornamos el Bearer Token completo como placeholder.
    # Lo usaremos para simular la llamada a la API de Jira.
    jira_token = Authorization.split("Bearer ")[1]
    
    # En el futuro, podrías extraer el email del usuario y el token de API de Jira.
    # Por ahora, un token falso es suficiente para la simulación.
    if jira_token == "FAKE_JIRA_TOKEN":
        return "FAKE_JIRA_API_TOKEN"
    
    return jira_token