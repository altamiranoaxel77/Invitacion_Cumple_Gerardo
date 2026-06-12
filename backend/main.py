from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "confirmaciones.json"

GMAIL_USER = "cumple.gerardo26@gmail.com"
GMAIL_PASSWORD = "boeu wxjp notb wcei"

class Confirmacion(BaseModel):
    nombre: str
    apellido: str
    correo: str
    comida: str
    bebida: str

def cargar_datos() -> List[dict]:
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def guardar_datos(datos: List[dict]):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

def enviar_email(conf: dict):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "¡Confirmado! Te esperamos el 16/06 🎉⚽"
        msg["From"] = GMAIL_USER
        msg["To"] = conf["correo"]

        html = f"""
        <html>
        <body style="margin:0;padding:0;background:#a8dff5;font-family:'Arial',sans-serif;">
          <div style="max-width:520px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">
            
            <div style="height:10px;background:linear-gradient(90deg,#74c9f0 33%,white 33%,white 66%,#74c9f0 66%);"></div>
            
            <div style="background:#74c9f0;text-align:center;padding:32px 20px 16px;">
              <div style="font-size:64px;font-weight:900;color:#1a1a2e;letter-spacing:2px;text-shadow:3px 3px 0 white;font-family:Impact,Arial Black,sans-serif;">
                GERARDO
              </div>
              <div style="font-size:40px;margin:8px 0;">🇦🇷⚽🎂</div>
            </div>

            <div style="padding:28px 32px;">
              <p style="font-size:20px;font-weight:700;color:#1a1a2e;margin:0 0 8px;">
                ¡Hola {conf["nombre"]}! 👋
              </p>
              <p style="font-size:16px;color:#1a4a6e;margin:0 0 20px;">
                Tu asistencia está <strong>confirmada</strong>. ¡Te esperamos!
              </p>

              <div style="background:#f0faff;border-radius:12px;padding:18px 20px;margin-bottom:20px;border-left:4px solid #74c9f0;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a4a6e;text-transform:uppercase;letter-spacing:0.8px;">Detalles del evento</p>
                <p style="margin:4px 0;font-size:15px;color:#1a1a2e;">📅 <strong>Martes 16 de Junio 2026</strong></p>
                <p style="margin:4px 0;font-size:15px;color:#1a1a2e;">🕗 <strong>20:00 hs hasta la medianoche</strong></p>
                <p style="margin:4px 0;font-size:15px;color:#1a1a2e;">📍 <strong>Gobernador Gallino 262, Corrientes</strong></p>
                <p style="margin:4px 0;font-size:13px;color:#1a4a6e;">(Casa de Axel)</p>
              </div>

              <div style="background:#fff8e8;border-radius:12px;padding:18px 20px;margin-bottom:20px;border-left:4px solid #f5b800;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#7a5a00;text-transform:uppercase;letter-spacing:0.8px;">Tu aporte</p>
                <p style="margin:4px 0;font-size:15px;color:#1a1a2e;">🍔 Comida: <strong>{conf["comida"]}</strong></p>
                <p style="margin:4px 0;font-size:15px;color:#1a1a2e;">🍺 Bebida: <strong>{conf["bebida"]}</strong></p>
              </div>

              <p style="font-size:15px;color:#1a4a6e;text-align:center;font-style:italic;">
                ¡Nos vemos para ver Argentina vs Argelia y festejar juntos! 🏆
              </p>
            </div>

            <div style="height:10px;background:linear-gradient(90deg,#74c9f0 33%,white 33%,white 66%,#74c9f0 66%);"></div>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.sendmail(GMAIL_USER, conf["correo"], msg.as_string())

        print(f"Email enviado a {conf['correo']}")
    except Exception as e:
        print(f"Error al enviar email: {e}")

@app.get("/confirmaciones")
def get_confirmaciones():
    return cargar_datos()

@app.post("/confirmaciones")
def post_confirmacion(conf: Confirmacion):
    datos = cargar_datos()
    nuevo = conf.dict()
    datos.append(nuevo)
    guardar_datos(datos)
    return {"mensaje": "Confirmación registrada!", "data": nuevo}