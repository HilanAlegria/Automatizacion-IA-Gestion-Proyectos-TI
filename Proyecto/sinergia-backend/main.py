# sinergia-backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import jira, ia # <--- Importa el nuevo router de IA

# ... (El resto de la configuración de FastAPI y CORS se mantiene igual) ...

app = FastAPI(
    title="SinergIA Backend - Orquestador de Proyectos TI",
    version="1.0.0",
)

# ... (Configuración de CORSMiddleware) ...

# -----------------------------------------------------------------
# 2. Inclusión de Routers
# -----------------------------------------------------------------
app.include_router(jira.router, prefix="/api") 
app.include_router(ia.router, prefix="/api") # <--- Incluye el router de IA

@app.get("/")
def read_root():
    return {"message": "SinergIA Backend API is running."}