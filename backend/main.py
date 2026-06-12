from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def get_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }

class Confirmacion(BaseModel):
    nombre: str
    apellido: str
    correo: str
    comida: str
    bebida: str

@app.get("/confirmaciones")
def get_confirmaciones():
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/confirmaciones?select=*&order=created_at.asc",
            headers=get_headers()
        )
        return res.json()

@app.post("/confirmaciones")
def post_confirmacion(conf: Confirmacion):
    with httpx.Client() as client:
        res = client.post(
            f"{SUPABASE_URL}/rest/v1/confirmaciones",
            headers={**get_headers(), "Prefer": "return=representation"},
            json=conf.dict()
        )
        return {"mensaje": "Confirmación registrada!", "data": res.json()}

@app.delete("/confirmaciones/{id}")
def delete_confirmacion(id: int, password: str):
    if password != "AdminGerardo123":
        return {"error": "Contraseña incorrecta"}
    with httpx.Client() as client:
        res = client.delete(
            f"{SUPABASE_URL}/rest/v1/confirmaciones?id=eq.{id}",
            headers=get_headers()
        )
        return {"mensaje": "Confirmación eliminada"}