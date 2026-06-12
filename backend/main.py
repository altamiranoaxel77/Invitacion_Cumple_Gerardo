from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = "https://jnofpoxzertnriyuavmf.supabase.co"
SUPABASE_KEY = "sb_secret_POv9VYhQr56nF34BtNeowg_X1Gb5rbu"
HEADERS = {
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
            headers=HEADERS
        )
        return res.json()

@app.post("/confirmaciones")
def post_confirmacion(conf: Confirmacion):
    with httpx.Client() as client:
        res = client.post(
            f"{SUPABASE_URL}/rest/v1/confirmaciones",
            headers={**HEADERS, "Prefer": "return=representation"},
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
            headers=HEADERS
        )
        return {"mensaje": "Confirmación eliminada"}