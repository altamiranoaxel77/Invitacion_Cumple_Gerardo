import React, { useState, useEffect } from 'react';

const API_URL = 'https://cumple-gerardo.onrender.com';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #74c9f0 0%, #a8dff5 40%, #c8eeff 100%)',
    fontFamily: "'Barlow', sans-serif",
    color: '#1a1a2e',
    overflowX: 'hidden',
  },
  hero: {
    position: 'relative',
    textAlign: 'center',
    padding: '48px 24px 32px',
    background: 'transparent',
  },
  shirtWrapper: {
    display: 'inline-block',
    position: 'relative',
    marginBottom: '16px',
  },
  shirtSVG: {
    width: '220px',
    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))',
  },
  photoCircle: {
    position: 'absolute',
    bottom: '-24px',
    left: '-32px',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '4px solid white',
    overflow: 'hidden',
    background: '#a8dff5',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
  },
  heroName: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(56px, 15vw, 88px)',
    letterSpacing: '2px',
    color: '#1a1a2e',
    margin: '32px 0 8px',
    textShadow: '3px 3px 0 #74c9f0',
    lineHeight: 1,
  },
  heroSub: {
    fontSize: '18px',
    color: '#1a4a6e',
    fontWeight: 600,
    marginBottom: '8px',
  },
  dividerDots: {
    borderTop: '3px dotted #1a4a6e',
    margin: '12px auto',
    maxWidth: '500px',
  },
  infoBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0',
    flexWrap: 'wrap',
    maxWidth: '520px',
    margin: '0 auto',
  },
  infoChunk: {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(20px, 5vw, 28px)',
    letterSpacing: '1px',
    color: '#1a1a2e',
    padding: '8px 20px',
  },
  infoDivider: {
    width: '3px',
    height: '32px',
    background: '#1a4a6e',
    borderRadius: '2px',
  },
  locationBox: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '16px',
    color: '#1a4a6e',
    fontWeight: 600,
  },
  noteBox: {
    textAlign: 'center',
    marginTop: '8px',
    fontSize: '15px',
    color: '#1a4a6e',
    fontStyle: 'italic',
  },
  section: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '20px',
    padding: '32px 28px',
    boxShadow: '0 8px 32px rgba(26,74,110,0.15)',
  },
  sectionTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '24px',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a4a6e',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '2px solid #a8dff5',
    fontSize: '15px',
    fontFamily: "'Barlow', sans-serif",
    background: '#f0faff',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #1a4a6e, #1a1a2e)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontFamily: "'Anton', sans-serif",
    letterSpacing: '1.5px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  successMsg: {
    textAlign: 'center',
    padding: '20px',
    color: '#0a6e3a',
    fontWeight: 700,
    fontSize: '18px',
    background: '#d4f7e7',
    borderRadius: '12px',
    marginTop: '12px',
  },
  errorMsg: {
    textAlign: 'center',
    padding: '12px',
    color: '#7a0a0a',
    fontWeight: 600,
    fontSize: '15px',
    background: '#fde8e8',
    borderRadius: '10px',
    marginTop: '8px',
  },
  attendeeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '14px',
    padding: '14px 18px',
    marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(26,74,110,0.08)',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a4a6e, #74c9f0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: "'Anton', sans-serif",
    fontSize: '16px',
    flexShrink: 0,
  },
  attendeeName: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  attendeeDetail: {
    fontSize: '13px',
    color: '#1a4a6e',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  chip: {
    background: '#e8f5ff',
    borderRadius: '20px',
    padding: '2px 10px',
    fontWeight: 600,
  },
  countBadge: {
    display: 'inline-block',
    background: '#1a4a6e',
    color: 'white',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    lineHeight: '28px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '14px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  footer: {
    textAlign: 'center',
    padding: '32px 20px',
    color: '#1a4a6e',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  flagStripe: {
    height: '8px',
    background: 'linear-gradient(90deg, #74c9f0 33%, white 33%, white 66%, #74c9f0 66%)',
    marginBottom: '0',
  },
};

const ArgentinaShirt = () => (
  <svg viewBox="0 0 220 200" style={styles.shirtSVG} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="shirtClip">
        <path d="M60,10 L30,40 L10,35 L5,80 L40,85 L40,195 L180,195 L180,85 L215,80 L210,35 L190,40 L160,10 Z" />
      </clipPath>
    </defs>
    <path d="M60,10 L30,40 L10,35 L5,80 L40,85 L40,195 L180,195 L180,85 L215,80 L210,35 L190,40 L160,10 Z"
      fill="white" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
    <rect x="5" y="0" width="220" height="200" fill="#74c9f0" clipPath="url(#shirtClip)" />
    <rect x="65" y="0" width="35" height="200" fill="white" clipPath="url(#shirtClip)" />
    <rect x="120" y="0" width="35" height="200" fill="white" clipPath="url(#shirtClip)" />
    <path d="M60,10 L30,40 L10,35 L5,80 L40,85 L40,195 L180,195 L180,85 L215,80 L210,35 L190,40 L160,10 Z"
      fill="none" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
    <path d="M60,10 Q110,30 160,10" fill="none" stroke="#111" strokeWidth="3" />
    <path d="M5,80 L40,85" stroke="#111" strokeWidth="3" />
    <path d="M215,80 L180,85" stroke="#111" strokeWidth="3" />
    <path d="M5,80 L5,60" stroke="#111" strokeWidth="3" />
    <path d="M215,80 L215,60" stroke="#111" strokeWidth="3" />
    <text x="110" y="60" textAnchor="middle" fontSize="11" fill="#f5b800" fontFamily="Arial" fontWeight="bold">★  ★  ★</text>
    <text x="110" y="155" textAnchor="middle" fontSize="52" fill="#1a1a2e" fontFamily="Anton, Arial Black, sans-serif" fontWeight="900">26</text>
  </svg>
);

export default function App() {
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', comida: '', bebida: '' });
  const [confirmados, setConfirmados] = useState([]);
  const [status, setStatus] = useState('idle');
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [fotoNombre, setFotoNombre] = useState('');
  const [fotoArchivo, setFotoArchivo] = useState(null);
  const [fotoStatus, setFotoStatus] = useState('idle');

  useEffect(() => {
    const target = new Date('2026-06-16T20:00:00');
    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) { setCountdown({ dias: 0, horas: 0, minutos: 0, segundos: 0 }); return; }
      setCountdown({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / (1000 * 60)) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchConfirmados = () => {
    fetch(`${API_URL}/confirmaciones`)
      .then(r => r.json())
      .then(data => { setConfirmados(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchConfirmados(); fetchFotos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.correo || !form.comida || !form.bebida) {
      setStatus('error'); return;
    }
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/confirmaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ nombre: '', apellido: '', correo: '', comida: '', bebida: '' });
        fetchConfirmados();
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };
  
  const fetchFotos = () => {
  fetch(`${API_URL}/fotos`)
    .then(r => r.json())
    .then(data => setFotos(data))
    .catch(() => {});
};

  const handleFotoSubmit = async () => {
      if (!fotoNombre || !fotoArchivo) { setFotoStatus('error'); return; }
      setFotoStatus('loading');
      const formData = new FormData();
      formData.append('nombre', fotoNombre);
      formData.append('archivo', fotoArchivo);
      try {
        const res = await fetch(`${API_URL}/fotos`, { method: 'POST', body: formData });
        if (res.ok) { setFotoStatus('success'); setFotoNombre(''); setFotoArchivo(null); fetchFotos(); }
        else setFotoStatus('error');
      } catch { setFotoStatus('error'); }
    };

    const handleDeleteFoto = async (id) => {
      if (!window.confirm('¿Borrar esta foto?')) return;
      await fetch(`${API_URL}/fotos/${id}?password=AdminGerardo123`, { method: 'DELETE' });
      fetchFotos();
    };


  const handleDelete = async (id) => {
  if (!window.confirm('¿Seguro que querés borrar esta confirmación?')) return;
  const res = await fetch(`${API_URL}/confirmaciones/${id}?password=AdminGerardo123`, { method: 'DELETE' });
  const data = await res.json();
  if (data.error) { alert(data.error); return; }
  fetchConfirmados();
};

  const getInitials = (nombre, apellido) =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return (
    <div style={styles.page}>
      {/* POPUP BIENVENIDA */}
        {showWelcome && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.7)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'linear-gradient(160deg, #74c9f0, #c8eeff)',
              borderRadius: '24px', padding: '40px 32px', textAlign: 'center',
              maxWidth: '340px', boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎂⚽🇦🇷</div>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', color: '#1a1a2e', marginBottom: '8px' }}>
                ¡BIENVENIDO!
              </div>
              <p style={{ color: '#1a4a6e', fontWeight: 600, marginBottom: '24px', fontSize: '16px' }}>
                Entrá y confirmá tu asistencia al cumple de Gerardo 🎉
              </p>
              <button
                onClick={() => {
                  const audio = document.getElementById('audio-player');
                  if (audio) {
                    audio.play().then(() => {
                      setPlaying(true);
                    });
                  }
                  setShowWelcome(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #1a4a6e, #1a1a2e)',
                  color: 'white', border: 'none', borderRadius: '14px',
                  padding: '14px 32px', fontFamily: "'Anton', sans-serif",
                  fontSize: '20px', cursor: 'pointer', letterSpacing: '1.5px',
                  width: '100%',
                }}
              >
                ¡ENTRAR! 🎉
              </button>
            </div>
          </div>
        )}
      <div style={styles.flagStripe} />

      {/* HERO */}
      <div style={styles.hero}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(18px, 5vw, 28px)', color: '#1a4a6e', letterSpacing: '4px', marginBottom: '12px', textShadow: '1px 1px 0 white' }}>
          🎂 CUMPLEAÑOS 🎂
        </div>
        <div style={styles.shirtWrapper}>
          <ArgentinaShirt />
          <div style={styles.photoCircle}>
            <img src="/gerardo.png" alt="Gerardo" style={styles.photoImg} />
          </div>
        </div>
        <h1 style={styles.heroName}>GERARDO</h1>
        <p style={styles.heroSub}>Te espero para festejar mi cumple y ver el partido</p>
        <p style={styles.heroSub}>🇦🇷 Argentina vs Argelia 🇩🇿</p>
        <div style={styles.dividerDots} />
        <div style={styles.infoBar}>
          <div style={styles.infoChunk}>MARTES 16/06</div>
          <div style={styles.infoDivider} />
          <div style={styles.infoChunk}>DE 20 A 00HS</div>
        </div>
        <div style={styles.dividerDots} />
        <div style={styles.locationBox}>📍 Gobernador Gallino 262, Corrientes (Casa de Axel)</div>
        <div style={styles.noteBox}>🍔 Traer Comida y Bebida para compartir</div>
        <div style={{ maxWidth: '480px', margin: '24px auto 0', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {[
            { val: countdown.dias, label: 'DÍAS' },
            { val: countdown.horas, label: 'HORAS' },
            { val: countdown.minutos, label: 'MIN' },
            { val: countdown.segundos, label: 'SEG' },
          ].map(({ val, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '14px', padding: '14px 18px', textAlign: 'center', minWidth: '72px', boxShadow: '0 4px 16px rgba(26,74,110,0.12)' }}>
              <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '36px', color: '#1a1a2e', lineHeight: 1 }}>
                {String(val).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a4a6e', letterSpacing: '1px', marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
            {/* BOTON MUSICA */}
              <div style={{ marginTop: '20px' }}>
                <audio id="audio-player" src="/muchachos.mp3" loop />
                <button
                  onClick={() => {
                    const audio = document.getElementById('audio-player');
                    if (audio.paused) {
                      audio.play();
                      setPlaying(true);
                    } else {
                      audio.pause();
                      setPlaying(false);
                    }
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: '2px solid #1a4a6e',
                    borderRadius: '30px',
                    padding: '10px 24px',
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '16px',
                    color: '#1a4a6e',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 12px rgba(26,74,110,0.15)',
                  }}
                >
                  {playing ? '⏸ Pausar Música' : '▶ Reproducir Música'}
                </button>
                <div style={{ fontSize: '12px', color: '#1a4a6e', marginTop: '6px', fontStyle: 'italic' }}>
                  🎵 Muchachos — La canción del Mundial
                </div>
              </div>
      </div>
      




      {/* FORMULARIO */}
      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>⚽ CONFIRMAR ASISTENCIA</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre</label>
                <input style={styles.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Apellido</label>
                <input style={styles.input} name="apellido" value={form.apellido} onChange={handleChange} placeholder="García" />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input style={styles.input} type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="juan@email.com" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>🍔 ¿Qué llevás para comer?</label>
              <input style={styles.input} name="comida" value={form.comida} onChange={handleChange} placeholder="Empanadas, asado, pizza..." />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>🍺 ¿Qué llevás para tomar?</label>
              <input style={styles.input} name="bebida" value={form.bebida} onChange={handleChange} placeholder="Cerveza, gaseosa, fernet..." />
            </div>
            <button style={styles.submitBtn} type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'ENVIANDO...' : '¡ME ANOTO! 🎉'}
            </button>
          </form>
          {status === 'success' && (
            <div style={styles.successMsg}>✅ ¡Confirmado! Ya estás en la lista. ¡Nos vemos el 16!</div>
          )}
          {status === 'error' && (
            <div style={styles.errorMsg}>⚠️ Completá todos los campos e intentá de nuevo.</div>
          )}
        </div>
      </div>

      {/* CONFIRMADOS — visible para todos */}
      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            🙌 CONFIRMADOS
            <span style={styles.countBadge}>{confirmados.length}</span>
          </h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#1a4a6e' }}>Cargando...</p>
          ) : confirmados.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#1a4a6e', fontStyle: 'italic' }}>
              Todavía no hay confirmados. ¡Sé el primero! 🙋
            </p>
          ) : (
            confirmados.map((c, i) => (
              <div key={i} style={styles.attendeeCard}>
                <div style={styles.avatar}>{getInitials(c.nombre, c.apellido)}</div>
                <div>
                  <div style={styles.attendeeName}>{c.nombre} {c.apellido}</div>
                  <div style={styles.attendeeDetail}>
                    <span style={styles.chip}>🍔 {c.comida}</span>
                    <span style={styles.chip}>🍺 {c.bebida}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* FOTOS */}
      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>📸 FOTOS CON GERARDO</h2>
          <p style={{ textAlign: 'center', color: '#1a4a6e', fontSize: '14px', marginBottom: '20px' }}>
            ¡Subí una foto junto a Gerardo antes del evento!
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tu nombre</label>
            <input style={styles.input} value={fotoNombre} onChange={e => setFotoNombre(e.target.value)} placeholder="Juan García" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Seleccioná o arrastrá tu foto</label>
            <div
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#1a4a6e'; e.currentTarget.style.background = '#d8f0ff'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = '#a8dff5'; e.currentTarget.style.background = '#f0faff'; }}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#a8dff5';
                e.currentTarget.style.background = '#f0faff';
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) setFotoArchivo(file);
              }}
              onClick={() => document.getElementById('foto-input').click()}
              style={{
                border: '2px dashed #a8dff5',
                borderRadius: '12px',
                padding: '32px 20px',
                textAlign: 'center',
                background: '#f0faff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {fotoArchivo ? (
                <div>
                  <img
                    src={URL.createObjectURL(fotoArchivo)}
                    alt="preview"
                    style={{ maxHeight: '160px', borderRadius: '10px', marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '13px', color: '#1a4a6e', fontWeight: 600 }}>{fotoArchivo.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Click para cambiar</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
                  <div style={{ fontWeight: 700, color: '#1a4a6e', fontSize: '15px' }}>Arrastrá tu foto acá</div>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>o hacé click para seleccionar</div>
                </div>
              )}
            </div>
            <input
              id="foto-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => setFotoArchivo(e.target.files[0])}
            />
          </div>
          <button style={styles.submitBtn} onClick={handleFotoSubmit} disabled={fotoStatus === 'loading'}>
            {fotoStatus === 'loading' ? 'SUBIENDO...' : '📸 SUBIR FOTO'}
          </button>
          {fotoStatus === 'success' && <div style={styles.successMsg}>✅ ¡Foto subida!</div>}
          {fotoStatus === 'error' && <div style={styles.errorMsg}>⚠️ Completá los campos e intentá de nuevo.</div>}

          {fotos.length > 0 && (
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {fotos.map((f, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 2px 10px rgba(26,74,110,0.12)' }}>
                  <img src={f.url} alt={f.nombre} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ background: 'rgba(26,74,110,0.85)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '6px 8px', textAlign: 'center' }}>
                    {f.nombre}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PANEL ADMIN — separado abajo */}
      <div style={styles.section}>
        <div style={{ ...styles.card, background: 'rgba(255,255,255,0.7)', border: '2px dashed #1a4a6e' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: '20px', color: '#1a4a6e' }}>
            🔐 PANEL ADMINISTRADOR
          </h2>
          {!adminMode ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#1a4a6e', fontSize: '14px', marginBottom: '12px' }}>
                Solo para Gerardo — ingresá la contraseña para gestionar confirmaciones
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <input
                  style={{ ...styles.input, width: '220px' }}
                  type="password"
                  placeholder="Contraseña admin"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (adminPass === 'AdminGerardo123') { setAdminMode(true); setAdminError(''); }
                      else setAdminError('Contraseña incorrecta');
                    }
                  }}
                />
                <button
                  style={{ ...styles.submitBtn, width: 'auto', padding: '10px 20px', fontSize: '15px', marginTop: 0 }}
                  onClick={() => {
                    if (adminPass === 'AdminGerardo123') { setAdminMode(true); setAdminError(''); }
                    else setAdminError('Contraseña incorrecta');
                  }}
                >
                  Entrar
                </button>
              </div>
              {adminError && <div style={styles.errorMsg}>{adminError}</div>}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#1a4a6e', fontWeight: 700, fontSize: '14px' }}>
                  ✅ Modo admin activo
                </span>
                <button onClick={() => { setAdminMode(false); setAdminPass(''); }} style={{ background: 'none', border: 'none', color: '#7a0a0a', cursor: 'pointer', fontWeight: 700 }}>
                  Salir ✕
                </button>
              </div>

              {/* CONFIRMACIONES */}
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: '18px', color: '#1a4a6e', marginBottom: '12px' }}>
                🙌 GESTIONAR CONFIRMACIONES
              </h3>
              {confirmados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#1a4a6e', fontStyle: 'italic' }}>No hay confirmaciones.</p>
              ) : (
                confirmados.map((c, i) => (
                  <div key={i} style={{ ...styles.attendeeCard, border: '1px solid #fde8e8' }}>
                    <div style={styles.avatar}>{getInitials(c.nombre, c.apellido)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.attendeeName}>{c.nombre} {c.apellido}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{c.correo}</div>
                      <div style={styles.attendeeDetail}>
                        <span style={styles.chip}>🍔 {c.comida}</span>
                        <span style={styles.chip}>🍺 {c.bebida}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{ background: '#fde8e8', border: 'none', borderRadius: '8px', color: '#7a0a0a', fontWeight: 700, padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🗑 Borrar
                    </button>
                  </div>
                ))
              )}

              {/* FOTOS */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: '18px', color: '#1a4a6e', marginBottom: '12px' }}>
                  📸 GESTIONAR FOTOS
                </h3>
                {fotos.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#1a4a6e', fontStyle: 'italic' }}>No hay fotos todavía.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                    {fotos.map((f, i) => (
                      <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,74,110,0.12)' }}>
                        <img src={f.url} alt={f.nombre} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ background: 'rgba(26,74,110,0.85)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 8px', textAlign: 'center' }}>
                          {f.nombre}
                        </div>
                        <button
                          onClick={() => handleDeleteFoto(f.id)}
                          style={{ width: '100%', background: '#fde8e8', border: 'none', color: '#7a0a0a', fontWeight: 700, padding: '6px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          🗑 Borrar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        ⚽ CUMPLE GERARDO · 16 DE JUNIO 2026 · VAMOS ARGENTINA 🇦🇷
      </div>
      <div style={styles.flagStripe} />
    </div>
  );
}