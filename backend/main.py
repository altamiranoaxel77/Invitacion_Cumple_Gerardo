from fastapi import FastAPI, UploadFile, File, Form
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

@app.get("/fotos")
def get_fotos():
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/fotos?select=*&order=created_at.asc",
            headers=get_headers()
        )
        return res.json()

@app.post("/fotos")
async def post_foto(nombre: str = Form(...), archivo: UploadFile = File(...)):
    contenido = await archivo.read()
    filename = f"{nombre.replace(' ', '_')}_{archivo.filename}"

    with httpx.Client() as client:
        upload_res = client.post(
            f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": archivo.content_type,
            },
            content=contenido
        )

        url = f"{SUPABASE_URL}/storage/v1/object/public/fotos/{filename}"

        client.post(
            f"{SUPABASE_URL}/rest/v1/fotos",
            headers={**get_headers(), "Prefer": "return=representation"},
            json={"nombre": nombre, "url": url}
        )

    return {"mensaje": "Foto subida!", "url": url}

@app.delete("/fotos/{id}")
def delete_foto(id: int, password: str):
    if password != "AdminGerardo123":
        return {"error": "Contraseña incorrecta"}
    with httpx.Client() as client:
        foto_res = client.get(
            f"{SUPABASE_URL}/rest/v1/fotos?id=eq.{id}&select=url",
            headers=get_headers()
        )
        fotos = foto_res.json()
        if fotos:
            url = fotos[0]["url"]
            filename = url.split("/fotos/")[-1]
            client.delete(
                f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                }
            )
        client.delete(
            f"{SUPABASE_URL}/rest/v1/fotos?id=eq.{id}",
            headers=get_headers()
        )
    return {"mensaje": "Foto eliminada"}