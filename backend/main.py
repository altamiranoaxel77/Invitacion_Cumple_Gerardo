from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import random

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

def verificar_correo(correo: str) -> dict | None:
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/confirmaciones?correo=eq.{correo}&select=nombre,apellido",
            headers=get_headers()
        )
        data = res.json()
        return data[0] if data else None

class Confirmacion(BaseModel):
    nombre: str
    apellido: str
    correo: str
    comida: str
    bebida: str

# ── CONFIRMACIONES ──────────────────────────────────────────
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
        client.delete(
            f"{SUPABASE_URL}/rest/v1/confirmaciones?id=eq.{id}",
            headers=get_headers()
        )
        return {"mensaje": "Confirmación eliminada"}

# ── FOTOS ────────────────────────────────────────────────────
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
        client.post(
            f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}",
            headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": archivo.content_type},
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
        foto_res = client.get(f"{SUPABASE_URL}/rest/v1/fotos?id=eq.{id}&select=url", headers=get_headers())
        fotos = foto_res.json()
        if fotos:
            filename = fotos[0]["url"].split("/fotos/")[-1]
            client.delete(f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}", headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
        client.delete(f"{SUPABASE_URL}/rest/v1/fotos?id=eq.{id}", headers=get_headers())
    return {"mensaje": "Foto eliminada"}

# ── DIBUJOS ──────────────────────────────────────────────────
@app.get("/dibujos")
def get_dibujos():
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/dibujos?select=*&order=created_at.asc",
            headers=get_headers()
        )
        dibujos = res.json()
        votos_res = client.get(
            f"{SUPABASE_URL}/rest/v1/votos_dibujos?select=*",
            headers=get_headers()
        )
        votos = votos_res.json()
        for d in dibujos:
            mis_votos = [v for v in votos if v["dibujo_id"] == d["id"]]
            d["votos_count"] = len(mis_votos)
            d["promedio"] = round(sum(v["puntuacion"] for v in mis_votos) / len(mis_votos), 1) if mis_votos else 0
            d["votos_detalle"] = mis_votos
        dibujos.sort(key=lambda x: x["promedio"], reverse=True)
        return dibujos

@app.post("/dibujos")
async def post_dibujo(correo: str = Form(...), archivo: UploadFile = File(...)):
    invitado = verificar_correo(correo)
    if not invitado:
        return {"error": "Correo no registrado"}
    nombre = f"{invitado['nombre']} {invitado['apellido']}"
    contenido = await archivo.read()
    filename = f"dibujo_{correo.replace('@','_')}_{random.randint(1000,9999)}.png"
    with httpx.Client() as client:
        client.post(
            f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}",
            headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "image/png"},
            content=contenido
        )
        url = f"{SUPABASE_URL}/storage/v1/object/public/fotos/{filename}"
        client.post(
            f"{SUPABASE_URL}/rest/v1/dibujos",
            headers={**get_headers(), "Prefer": "return=representation"},
            json={"correo": correo, "nombre": nombre, "url": url}
        )
    return {"mensaje": "Dibujo subido!", "url": url, "nombre": nombre}

@app.post("/dibujos/{id}/votar")
def votar_dibujo(id: int, correo: str, puntuacion: int):
    if not verificar_correo(correo):
        return {"error": "Correo no registrado"}
    if puntuacion < 1 or puntuacion > 5:
        return {"error": "Puntuación inválida"}
    with httpx.Client() as client:
        existe = client.get(
            f"{SUPABASE_URL}/rest/v1/votos_dibujos?dibujo_id=eq.{id}&correo_votante=eq.{correo}",
            headers=get_headers()
        ).json()
        if existe:
            client.patch(
                f"{SUPABASE_URL}/rest/v1/votos_dibujos?dibujo_id=eq.{id}&correo_votante=eq.{correo}",
                headers=get_headers(),
                json={"puntuacion": puntuacion}
            )
        else:
            client.post(
                f"{SUPABASE_URL}/rest/v1/votos_dibujos",
                headers={**get_headers(), "Prefer": "return=representation"},
                json={"dibujo_id": id, "correo_votante": correo, "puntuacion": puntuacion}
            )
    return {"mensaje": "Voto registrado!"}

@app.delete("/dibujos/{id}")
def delete_dibujo(id: int, password: str):
    if password != "AdminGerardo123":
        return {"error": "Contraseña incorrecta"}
    with httpx.Client() as client:
        res = client.get(f"{SUPABASE_URL}/rest/v1/dibujos?id=eq.{id}&select=url", headers=get_headers())
        dibujos = res.json()
        if dibujos:
            filename = dibujos[0]["url"].split("/fotos/")[-1]
            client.delete(f"{SUPABASE_URL}/storage/v1/object/fotos/{filename}", headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
        client.delete(f"{SUPABASE_URL}/rest/v1/dibujos?id=eq.{id}", headers=get_headers())
    return {"mensaje": "Dibujo eliminado"}

# ── PIEDRA PAPEL TIJERA 1v1 ──────────────────────────────────
def calcular_resultado(e1, e2):
    if e1 == e2: return "empate"
    gana = {"piedra": "tijera", "papel": "piedra", "tijera": "papel"}
    return "jugador1" if gana[e1] == e2 else "jugador2"

@app.get("/ppt/partidas")
def get_partidas():
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/partidas_ppt?select=*&order=created_at.desc&limit=20",
            headers=get_headers()
        )
        return res.json()

@app.post("/ppt/desafiar")
def desafiar(correo_jugador1: str, correo_jugador2: str):
    j1 = verificar_correo(correo_jugador1)
    j2 = verificar_correo(correo_jugador2)
    if not j1: return {"error": "Tu correo no está registrado"}
    if not j2: return {"error": "El correo del rival no está registrado"}
    with httpx.Client() as client:
        res = client.post(
            f"{SUPABASE_URL}/rest/v1/partidas_ppt",
            headers={**get_headers(), "Prefer": "return=representation"},
            json={
                "correo_jugador1": correo_jugador1,
                "nombre_jugador1": f"{j1['nombre']} {j1['apellido']}",
                "correo_jugador2": correo_jugador2,
                "nombre_jugador2": f"{j2['nombre']} {j2['apellido']}",
                "estado": "esperando"
            }
        )
        return res.json()

@app.post("/ppt/jugar/{partida_id}")
def jugar(partida_id: int, correo: str, eleccion: str):
    if eleccion not in ["piedra", "papel", "tijera"]:
        return {"error": "Elección inválida"}
    with httpx.Client() as client:
        res = client.get(
            f"{SUPABASE_URL}/rest/v1/partidas_ppt?id=eq.{partida_id}&select=*",
            headers=get_headers()
        ).json()
        if not res: return {"error": "Partida no encontrada"}
        partida = res[0]
        update = {}
        if correo == partida["correo_jugador1"]:
            update["eleccion_jugador1"] = eleccion
        elif correo == partida["correo_jugador2"]:
            update["eleccion_jugador2"] = eleccion
        else:
            return {"error": "No sos parte de esta partida"}

        e1 = update.get("eleccion_jugador1") or partida["eleccion_jugador1"]
        e2 = update.get("eleccion_jugador2") or partida["eleccion_jugador2"]

        if e1 and e2:
            resultado = calcular_resultado(e1, e2)
            v1 = partida["victorias_j1"] or 0
            v2 = partida["victorias_j2"] or 0
            emp = partida["empates"] or 0
            ronda = partida["ronda_actual"] or 1

            if resultado == "jugador1": v1 += 1
            elif resultado == "jugador2": v2 += 1
            else: emp += 1

            update["victorias_j1"] = v1
            update["victorias_j2"] = v2
            update["empates"] = emp
            update["eleccion_jugador1"] = None
            update["eleccion_jugador2"] = None

            if v1 == 2 or v2 == 2:
                update["resultado"] = "jugador1" if v1 == 2 else "jugador2"
                update["estado"] = "finalizada"
                update["ronda_actual"] = ronda
            else:
                update["ronda_actual"] = ronda + 1
                update["estado"] = "en_curso"
                update["resultado"] = resultado
        else:
            update["estado"] = "en_curso"

        client.patch(
            f"{SUPABASE_URL}/rest/v1/partidas_ppt?id=eq.{partida_id}",
            headers=get_headers(),
            json=update
        )
        return {
            "mensaje": "Elección registrada",
            "estado": update.get("estado"),
            "resultado": update.get("resultado"),
            "victorias_j1": update.get("victorias_j1"),
            "victorias_j2": update.get("victorias_j2"),
            "ronda_actual": update.get("ronda_actual"),
        }

# ── TORNEO PPT ───────────────────────────────────────────────
@app.get("/ppt/torneo")
def get_torneo():
    with httpx.Client() as client:
        estado = client.get(f"{SUPABASE_URL}/rest/v1/torneo_estado?select=*&order=id.desc&limit=1", headers=get_headers()).json()
        partidas = client.get(f"{SUPABASE_URL}/rest/v1/torneo_ppt?select=*&order=ronda.asc", headers=get_headers()).json()
        return {"estado": estado[0] if estado else None, "partidas": partidas}

@app.post("/ppt/torneo/inscribirse")
def inscribirse_torneo(correo: str):
    invitado = verificar_correo(correo)
    if not invitado: return {"error": "Correo no registrado"}
    with httpx.Client() as client:
        estado = client.get(f"{SUPABASE_URL}/rest/v1/torneo_estado?select=*&order=id.desc&limit=1", headers=get_headers()).json()
        if estado and estado[0]["activo"]: return {"error": "El torneo ya comenzó"}
        existe = client.get(
            f"{SUPABASE_URL}/rest/v1/torneo_inscriptos?correo=eq.{correo}&select=correo",
            headers=get_headers()
        ).json()
        if existe: return {"error": "Ya estás inscripto"}
        client.post(
            f"{SUPABASE_URL}/rest/v1/torneo_inscriptos",
            headers={**get_headers(), "Prefer": "return=representation"},
            json={"correo": correo, "nombre": f"{invitado['nombre']} {invitado['apellido']}"}
        )
    return {"mensaje": "Inscripto al torneo!"}

@app.get("/ppt/torneo/inscriptos")
def get_inscriptos():
    with httpx.Client() as client:
        res = client.get(f"{SUPABASE_URL}/rest/v1/torneo_inscriptos?select=*&order=created_at.asc", headers=get_headers())
        return res.json()

@app.post("/ppt/torneo/iniciar")
def iniciar_torneo(password: str):
    if password != "AdminGerardo123": return {"error": "Contraseña incorrecta"}
    with httpx.Client() as client:
        inscriptos = client.get(f"{SUPABASE_URL}/rest/v1/torneo_inscriptos?select=*", headers=get_headers()).json()
        if len(inscriptos) < 2: return {"error": "Se necesitan al menos 2 jugadores"}
        random.shuffle(inscriptos)
        partidas = []
        for i in range(0, len(inscriptos) - 1, 2):
            j1 = inscriptos[i]
            j2 = inscriptos[i + 1]
            partidas.append({
                "ronda": 1,
                "correo_jugador1": j1["correo"], "nombre_jugador1": j1["nombre"],
                "correo_jugador2": j2["correo"], "nombre_jugador2": j2["nombre"],
                "estado": "esperando"
            })
        if len(inscriptos) % 2 != 0:
            bye = inscriptos[-1]
            partidas.append({
                "ronda": 1,
                "correo_jugador1": bye["correo"], "nombre_jugador1": bye["nombre"],
                "correo_jugador2": "bye@bye.com", "nombre_jugador2": "BYE",
                "estado": "finalizada", "resultado": "jugador1",
                "ganador_correo": bye["correo"], "ganador_nombre": bye["nombre"]
            })
        for p in partidas:
            client.post(f"{SUPABASE_URL}/rest/v1/torneo_ppt", headers={**get_headers(), "Prefer": "return=representation"}, json=p)
        client.post(f"{SUPABASE_URL}/rest/v1/torneo_estado", headers={**get_headers(), "Prefer": "return=representation"}, json={"activo": True, "ronda_actual": 1})
    return {"mensaje": "Torneo iniciado!"}

@app.post("/ppt/torneo/jugar/{partida_id}")
def jugar_torneo(partida_id: int, correo: str, eleccion: str):
    if eleccion not in ["piedra", "papel", "tijera"]:
        return {"error": "Elección inválida"}
    with httpx.Client() as client:
        res = client.get(f"{SUPABASE_URL}/rest/v1/torneo_ppt?id=eq.{partida_id}&select=*", headers=get_headers()).json()
        if not res: return {"error": "Partida no encontrada"}
        partida = res[0]
        update = {}
        if correo == partida["correo_jugador1"]:
            update["eleccion_jugador1"] = eleccion
        elif correo == partida["correo_jugador2"]:
            update["eleccion_jugador2"] = eleccion
        else:
            return {"error": "No sos parte de esta partida"}
        e1 = update.get("eleccion_jugador1") or partida["eleccion_jugador1"]
        e2 = update.get("eleccion_jugador2") or partida["eleccion_jugador2"]
        if e1 and e2:
            resultado = calcular_resultado(e1, e2)
            update["resultado"] = resultado
            update["estado"] = "finalizada"
            if resultado == "jugador1":
                update["ganador_correo"] = partida["correo_jugador1"]
                update["ganador_nombre"] = partida["nombre_jugador1"]
            elif resultado == "jugador2":
                update["ganador_correo"] = partida["correo_jugador2"]
                update["ganador_nombre"] = partida["nombre_jugador2"]
            else:
                update["ganador_correo"] = None
                update["ganador_nombre"] = "Empate"
        else:
            update["estado"] = "en_curso"
        client.patch(f"{SUPABASE_URL}/rest/v1/torneo_ppt?id=eq.{partida_id}", headers=get_headers(), json=update)
        return {"mensaje": "Elección registrada", "estado": update.get("estado"), "resultado": update.get("resultado")}