import React, { useState, useEffect, useRef } from 'react';

const API_URL = 'https://cumple-gerardo.onrender.com';

const styles = {
    card: { background: 'rgba(255,255,255,0.85)', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 8px 32px rgba(26,74,110,0.15)' },
    title: { fontFamily: "'Anton', sans-serif", fontSize: '28px', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' },
    sub: { textAlign: 'center', color: '#1a4a6e', fontSize: '14px', marginBottom: '24px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #a8dff5', fontSize: '15px', fontFamily: "'Barlow', sans-serif", background: '#f0faff', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box' },
    btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #1a4a6e, #1a1a2e)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontFamily: "'Anton', sans-serif", letterSpacing: '1px', cursor: 'pointer' },
    btnSmall: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a4a6e', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' },
    msg: (type) => ({ textAlign: 'center', padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', marginTop: '12px', background: type === 'success' ? '#d4f7e7' : '#fde8e8', color: type === 'success' ? '#0a6e3a' : '#7a0a0a' }),
    };

    const COLORES = ['#000000', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#ffffff', '#74c9f0'];
    const GROSORES = [2, 5, 10, 18];

    export default function DibujaGerardo({ adminMode, onDeleteDibujo }) {
    const [correo, setCorreo] = useState('');
    const [verificado, setVerificado] = useState(false);
    const [nombre, setNombre] = useState('');
    const [dibujando, setDibujando] = useState(false);
    const [color, setColor] = useState('#000000');
    const [grosor, setGrosor] = useState(5);
    const [status, setStatus] = useState('idle');
    const [dibujos, setDibujos] = useState([]);
    const [miVoto, setMiVoto] = useState({});
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef(null);

    useEffect(() => { fetchDibujos(); }, []);

    const fetchDibujos = async () => {
        const res = await fetch(`${API_URL}/dibujos`);
        const data = await res.json();
        setDibujos(data);
    };

    const verificarCorreo = async () => {
        const res = await fetch(`${API_URL}/confirmaciones`);
        const data = await res.json();
        const inv = data.find(c => c.correo === correo);
        if (inv) { setVerificado(true); setNombre(`${inv.nombre} ${inv.apellido}`); }
        else setStatus('error_correo');
    };

    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if (e.touches) {
        return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
        }
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    const startDraw = (e) => {
        e.preventDefault();
        isDrawing.current = true;
        lastPos.current = getPos(e, canvasRef.current);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        if (color === 'eraser') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = grosor * 3;
        } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = grosor;
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        lastPos.current = pos;
        };
    const stopDraw = (e) => { e.preventDefault(); isDrawing.current = false; };

    const limpiar = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const subirDibujo = async () => {
        setStatus('loading');
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('correo', correo);
        formData.append('archivo', blob, 'dibujo.png');
        try {
            const res = await fetch(`${API_URL}/dibujos`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.error) { setStatus('error'); return; }
            setStatus('success');
            limpiar();
            fetchDibujos();
        } catch { setStatus('error'); }
        }, 'image/png');
    };

    const votar = async (dibujoId, puntuacion) => {
        await fetch(`${API_URL}/dibujos/${dibujoId}/votar?correo=${correo}&puntuacion=${puntuacion}`, { method: 'POST' });
        setMiVoto({ ...miVoto, [dibujoId]: puntuacion });
        fetchDibujos();
    };

    const borrarDibujo = async (id) => {
        if (!window.confirm('¿Borrar este dibujo?')) return;
        await fetch(`${API_URL}/dibujos/${id}?password=AdminGerardo123`, { method: 'DELETE' });
        fetchDibujos();
    };

    return (
        <div>
        <div style={styles.card}>
            <div style={styles.title}>🎨 DIBUJÁ A GERARDO</div>
            <p style={styles.sub}>¡Mostrá tu talento artístico! Solo invitados confirmados pueden participar.</p>

            {!verificado ? (
            <div>
                <label style={styles.label}>Tu correo registrado</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                <input style={styles.input} type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="juan@email.com" />
                <button style={styles.btn} onClick={verificarCorreo}>Entrar</button>
                </div>
                {status === 'error_correo' && <div style={styles.msg('error')}>⚠️ Correo no registrado. ¡Confirmá asistencia primero!</div>}
            </div>
            ) : (
            <div>
                <p style={{ textAlign: 'center', color: '#1a4a6e', fontWeight: 700, marginBottom: '16px' }}>
                ✅ Hola {nombre}! ¡A dibujar!
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {COLORES.map(c => (
                    <div key={c} onClick={() => setColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: color === c ? '3px solid #1a1a2e' : '2px solid #ccc', cursor: 'pointer' }} />
                ))}
                <div style={{ width: '2px', background: '#ccc', margin: '0 4px' }} />
                {GROSORES.map(g => (
                    <div key={g} onClick={() => setGrosor(g)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: grosor === g ? '#1a4a6e' : '#e8f5ff', border: '2px solid #a8dff5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: g, height: g, borderRadius: '50%', background: grosor === g ? 'white' : '#1a4a6e' }} />
                    </div>
                ))}
                </div>

                <canvas
                ref={canvasRef}
                width={500} height={350}
                style={{ width: '100%', borderRadius: '12px', border: '2px solid #a8dff5', background: 'white', touchAction: 'none', cursor: 'crosshair' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                    style={{ ...styles.btnSmall, background: color === 'eraser' ? '#1a4a6e' : '#e8f5ff', color: color === 'eraser' ? 'white' : '#1a4a6e', flex: 1 }}
                    onClick={() => setColor(color === 'eraser' ? '#000000' : 'eraser')}
                >
                    {color === 'eraser' ? '✏️ Dibujar' : '🧹 Borrador'}
                </button>
                <button style={{ ...styles.btnSmall, background: '#fde8e8', color: '#7a0a0a', flex: 1 }} onClick={limpiar}>🗑 Limpiar</button>
                <button style={{ ...styles.btn, flex: 2 }} onClick={subirDibujo} disabled={status === 'loading'}>
                    {status === 'loading' ? 'SUBIENDO...' : '📤 SUBIR DIBUJO'}
                </button>
                </div>
                <button style={{ ...styles.btn, flex: 2 }} onClick={subirDibujo} disabled={status === 'loading'}>
                    {status === 'loading' ? 'SUBIENDO...' : '📤 SUBIR DIBUJO'}
                </button>
                </div>
                {status === 'success' && <div style={styles.msg('success')}>✅ ¡Dibujo subido!</div>}
                {status === 'error' && <div style={styles.msg('error')}>⚠️ Error al subir. Intentá de nuevo.</div>}
            </div>
            )}
        </div>

        {dibujos.length > 0 && (
            <div style={{ ...styles.card, marginTop: '20px' }}>
            <div style={styles.title}>🏆 RANKING DE DIBUJOS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {dibujos.map((d, i) => (
                <div key={d.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,74,110,0.1)' }}>
                    {i === 0 && <div style={{ background: '#f5b800', textAlign: 'center', padding: '4px', fontWeight: 700, fontSize: '13px' }}>🥇 TOP 1</div>}
                    {i === 1 && <div style={{ background: '#aaa', textAlign: 'center', padding: '4px', fontWeight: 700, fontSize: '13px', color: 'white' }}>🥈 TOP 2</div>}
                    {i === 2 && <div style={{ background: '#cd7f32', textAlign: 'center', padding: '4px', fontWeight: 700, fontSize: '13px', color: 'white' }}>🥉 TOP 3</div>}
                    <img src={d.url} alt={d.nombre} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>{d.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#1a4a6e', margin: '4px 0' }}>
                        ⭐ {d.promedio > 0 ? `${d.promedio}/5` : 'Sin votos'} ({d.votos_count} {d.votos_count === 1 ? 'voto' : 'votos'})
                    </div>
                    {verificado && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => votar(d.id, n)}
                            style={{ flex: 1, padding: '4px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px',
                                background: (miVoto[d.id] || d.votos_detalle?.find(v => v.correo_votante === correo)?.puntuacion) >= n ? '#f5b800' : '#e8f5ff' }}>
                            ★
                            </button>
                        ))}
                        </div>
                    )}
                    {adminMode && (
                        <button onClick={() => borrarDibujo(d.id)}
                        style={{ ...styles.btnSmall, background: '#fde8e8', color: '#7a0a0a', width: '100%', marginTop: '8px' }}>
                        🗑 Borrar
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    );
}