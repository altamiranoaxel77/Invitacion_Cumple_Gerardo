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

  useEffect(() => {
    const target = new Date('2026-06-16T20:00:00');
    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }
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

  useEffect(() => { fetchConfirmados(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.correo || !form.comida || !form.bebida) {
      setStatus('error');
      return;
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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const getInitials = (nombre, apellido) =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return (
    <div style={styles.page}>
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

        <div style={styles.locationBox}>
          📍 Gobernador Gallino 262, Corrientes (Casa de Axel)
        </div>
        <div style={styles.noteBox}>
          🍔 Traer Comida y Bebida para compartir
        </div>
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
      </div>
      
      {/* FORM */}
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

      {/* ATTENDEES */}
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

      <div style={styles.footer}>
        ⚽ CUMPLE GERARDO · 16 DE JUNIO 2026 · VAMOS ARGENTINA 🇦🇷
      </div>
      <div style={styles.flagStripe} />
    </div>
  );
}
