import React, { useState, useEffect } from 'react';

const API_URL = 'https://cumple-gerardo.onrender.com';

const styles = {
    card: { background: 'rgba(255,255,255,0.85)', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 8px 32px rgba(26,74,110,0.15)', marginBottom: '20px' },
    title: { fontFamily: "'Anton', sans-serif", fontSize: '28px', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' },
    sub: { textAlign: 'center', color: '#1a4a6e', fontSize: '14px', marginBottom: '24px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #a8dff5', fontSize: '15px', fontFamily: "'Barlow', sans-serif", background: '#f0faff', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box' },
    btn: { padding: '12px 24px', background: 'linear-gradient(135deg, #1a4a6e, #1a1a2e)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontFamily: "'Anton', sans-serif", letterSpacing: '1px', cursor: 'pointer' },
    label: { display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a4a6e', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' },
    msg: (type) => ({ textAlign: 'center', padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', marginTop: '12px', background: type === 'success' ? '#d4f7e7' : type === 'info' ? '#e8f5ff' : '#fde8e8', color: type === 'success' ? '#0a6e3a' : type === 'info' ? '#1a4a6e' : '#7a0a0a' }),
    eleccionBtn: (sel) => ({ fontSize: '48px', padding: '16px 24px', border: sel ? '3px solid #1a4a6e' : '2px solid #a8dff5', borderRadius: '16px', cursor: 'pointer', background: sel ? '#e8f5ff' : 'white', transition: 'all 0.15s' }),
    };

    const OPCIONES = [
    { key: 'piedra', emoji: '🪨', label: 'Piedra' },
    { key: 'papel', emoji: '📄', label: 'Papel' },
    { key: 'tijera', emoji: '✂️', label: 'Tijera' },
    ];

    export default function PiedraPapelTijera({ adminMode }) {
    const [correo, setCorreo] = useState('');
    const [verificado, setVerificado] = useState(false);
    const [nombre, setNombre] = useState('');
    const [tab, setTab] = useState('1v1');
    const [correoRival, setCorreoRival] = useState('');
    const [confirmados, setConfirmados] = useState([]);
    const [partidas, setPartidas] = useState([]);
    const [partida, setPartida] = useState(null);
    const [eleccion, setEleccion] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [inscriptos, setInscriptos] = useState([]);
    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchConfirmados = async () => {
        const res = await fetch(`${API_URL}/confirmaciones`);
        const data = await res.json();
        setConfirmados(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchPartidas(); fetchTorneo(); fetchInscriptos(); fetchConfirmados(); }, []);

    useEffect(() => {
        if (!verificado) return;
        const interval = setInterval(() => { fetchPartidas(); fetchTorneo(); }, 2000);
        return () => clearInterval(interval);
    }, [verificado]);

    const fetchPartidas = async () => {
    try {
        const res = await fetch(`${API_URL}/ppt/partidas`);
        const data = await res.json();
        setPartidas(Array.isArray(data) ? data : []);
    } catch { setPartidas([]); }
    };

    const fetchTorneo = async () => {
    try {
        const res = await fetch(`${API_URL}/ppt/torneo`);
        setTorneo(await res.json());
    } catch { setTorneo(null); }
    };

    const fetchInscriptos = async () => {
    try {
        const res = await fetch(`${API_URL}/ppt/torneo/inscriptos`);
        const data = await res.json();
        setInscriptos(Array.isArray(data) ? data : []);
    } catch { setInscriptos([]); }
    };

    const verificarCorreo = async () => {
        const res = await fetch(`${API_URL}/confirmaciones`);
        const data = await res.json();
        const inv = data.find(c => c.correo === correo);
        if (inv) { setVerificado(true); setNombre(`${inv.nombre} ${inv.apellido}`); }
        else setStatusMsg('error_correo');
    };

    const desafiar = async () => {
    if (!correoRival) return;
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}/ppt/desafiar?correo_jugador1=${correo}&correo_jugador2=${correoRival}`, { method: 'POST' });
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.id) {
        setPartida(data[0]);
        setStatusMsg('desafio_enviado');
        } else {
        setStatusMsg(data.error || 'error');
        }
    } catch { setStatusMsg('error'); }
    setLoading(false);
    fetchPartidas();
    };

    const jugar = async (partida_id, endpoint = 'ppt') => {
        if (!eleccion) { setStatusMsg('elige'); return; }
        const res = await fetch(`${API_URL}/${endpoint}/jugar/${partida_id}?correo=${correo}&eleccion=${eleccion}`, { method: 'POST' });
        const data = await res.json();
        setStatusMsg(data.resultado ? `resultado_${data.resultado}` : 'esperando');
        setEleccion('');
        fetchPartidas();
        fetchTorneo();
    };

    const inscribirse = async () => {
        const res = await fetch(`${API_URL}/ppt/torneo/inscribirse?correo=${correo}`, { method: 'POST' });
        const data = await res.json();
        setStatusMsg(data.error || 'inscripto');
        fetchInscriptos();
    };

    const iniciarTorneo = async () => {
        const res = await fetch(`${API_URL}/ppt/torneo/iniciar?password=AdminGerardo123`, { method: 'POST' });
        const data = await res.json();
        setStatusMsg(data.error || 'torneo_iniciado');
        fetchTorneo();
    };

    const misPartidas1v1 = partidas.filter(p => p.correo_jugador1 === correo || p.correo_jugador2 === correo);
    const desafiosPendientes = partidas.filter(p => p.correo_jugador2 === correo && p.estado === 'esperando' && !p.eleccion_jugador2);
    const misPartidasTorneo = torneo?.partidas?.filter(p => p.correo_jugador1 === correo || p.correo_jugador2 === correo) || [];

    const renderResultado = (r, correoJ1) => {
        if (!r) return null;
        if (r === 'empate') return <span style={{ color: '#f5b800', fontWeight: 700 }}>🤝 Empate</span>;
        const gane = (r === 'jugador1' && correoJ1 === correo) || (r === 'jugador2' && correoJ1 !== correo);
        return <span style={{ color: gane ? '#0a6e3a' : '#7a0a0a', fontWeight: 700 }}>{gane ? '🏆 Ganaste' : '😢 Perdiste'}</span>;
    };

    return (
        <div>
        <div style={styles.card}>
            <div style={styles.title}>✂️ PIEDRA PAPEL TIJERA</div>
            <p style={styles.sub}>Solo invitados confirmados pueden jugar.</p>

            {!verificado ? (
            <div>
                <label style={styles.label}>Tu correo registrado</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                <input style={styles.input} type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="juan@email.com" />
                <button style={styles.btn} onClick={verificarCorreo}>Entrar</button>
                </div>
                {statusMsg === 'error_correo' && <div style={styles.msg('error')}>⚠️ Correo no registrado.</div>}
            </div>
            ) : (
            <div>
                <p style={{ textAlign: 'center', fontWeight: 700, color: '#1a4a6e', marginBottom: '16px' }}>✅ Hola {nombre}!</p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                {['1v1', 'torneo'].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ ...styles.btn, background: tab === t ? 'linear-gradient(135deg, #1a4a6e, #1a1a2e)' : '#e8f5ff', color: tab === t ? 'white' : '#1a4a6e', fontSize: '14px', padding: '10px 20px' }}>
                    {t === '1v1' ? '⚔️ 1 vs 1' : '🏆 Torneo'}
                    </button>
                ))}
                </div>

                {tab === '1v1' && (
                <div>
                    {desafiosPendientes.length > 0 && (
                    <div style={{ background: '#fff8e8', border: '2px solid #f5b800', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '18px', color: '#1a1a2e', marginBottom: '12px' }}>
                        ⚔️ TE DESAFIARON!
                        </div>
                        {desafiosPendientes.map(p => (
                        <div key={p.id} style={{ background: 'white', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
                            {p.nombre_jugador1} te desafió!
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                            {OPCIONES.map(o => (
                                <button key={o.key} style={styles.eleccionBtn(eleccion === o.key)} onClick={() => setEleccion(o.key)}>
                                {o.emoji}
                                </button>
                            ))}
                            </div>
                            <button style={{ ...styles.btn, width: '100%' }} onClick={() => jugar(p.id)}>
                            ACEPTAR DESAFÍO
                            </button>
                        </div>
                        ))}
                    </div>
                    )}
                    <label style={styles.label}>Elegí tu rival</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <select
                        style={{ ...styles.input, cursor: 'pointer' }}
                        value={correoRival}
                        onChange={e => setCorreoRival(e.target.value)}
                    >
                        <option value="">-- Seleccioná un rival --</option>
                        {confirmados
                        .filter(c => c.correo !== correo)
                        .map(c => (
                            <option key={c.correo} value={c.correo}>
                            {c.nombre} {c.apellido}
                            </option>
                        ))
                        }
                    </select>
                    <button style={styles.btn} onClick={desafiar} disabled={loading || !correoRival}>
                        ⚔️ Desafiar
                    </button>
                    {statusMsg === 'desafio_enviado' && <div style={styles.msg('success')}>✅ ¡Desafío enviado! Esperá que el rival elija.</div>}
                    {statusMsg === 'error' && <div style={styles.msg('error')}>⚠️ Error al enviar el desafío.</div>}
                    </div>
                    {misPartidas1v1.length > 0 && (
                    <div>
                        <div style={{ fontWeight: 700, color: '#1a4a6e', marginBottom: '12px' }}>Tus partidas:</div>
                        {misPartidas1v1.map(p => {
                        const esJ1 = p.correo_jugador1 === correo;
                        const yaElegi = esJ1 ? p.eleccion_jugador1 : p.eleccion_jugador2;
                        return (
                            <div key={p.id} style={{ background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '12px', border: '2px solid #e8f5ff' }}>
                            <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
                                {p.nombre_jugador1} vs {p.nombre_jugador2}
                            </div>
                            {p.estado === 'finalizada' ? (
                                <div>
                                <div>{renderResultado(p.resultado, p.correo_jugador1)}</div>
                                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                                    {p.nombre_jugador1}: {p.eleccion_jugador1} {OPCIONES.find(o => o.key === p.eleccion_jugador1)?.emoji} | {p.nombre_jugador2}: {p.eleccion_jugador2} {OPCIONES.find(o => o.key === p.eleccion_jugador2)?.emoji}
                                </div>
                                </div>
                            ) : yaElegi ? (
                                <div style={styles.msg('info')}>⏳ Elegiste {yaElegi} {OPCIONES.find(o => o.key === yaElegi)?.emoji} — Esperando al rival...</div>
                            ) : (
                                <div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                                    {OPCIONES.map(o => (
                                    <button key={o.key} style={styles.eleccionBtn(eleccion === o.key)} onClick={() => setEleccion(o.key)}>
                                        {o.emoji}
                                    </button>
                                    ))}
                                </div>
                                <button style={{ ...styles.btn, width: '100%' }} onClick={() => jugar(p.id)}>CONFIRMAR</button>
                                </div>
                            )}
                            </div>
                        );
                        })}
                    </div>
                    )}
                </div>
                )}

                {tab === 'torneo' && (
                <div>
                    {!torneo?.estado?.activo ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#1a4a6e', marginBottom: '16px' }}>
                        Inscriptos: <strong>{inscriptos.length}</strong>
                        </p>
                        {inscriptos.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            {inscriptos.map(i => <div key={i.correo} style={{ fontSize: '14px', color: '#1a4a6e', padding: '4px' }}>✅ {i.nombre}</div>)}
                        </div>
                        )}
                        <button style={styles.btn} onClick={inscribirse}>📋 INSCRIBIRME AL TORNEO</button>
                        {adminMode && (
                        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #0a6e3a, #1a4a6e)', marginLeft: '12px' }} onClick={iniciarTorneo}>
                            🚀 INICIAR TORNEO
                        </button>
                        )}
                        {statusMsg === 'inscripto' && <div style={styles.msg('success')}>✅ ¡Inscripto!</div>}
                        {statusMsg === 'torneo_iniciado' && <div style={styles.msg('success')}>✅ ¡Torneo iniciado!</div>}
                    </div>
                    ) : (
                    <div>
                        <div style={{ fontWeight: 700, color: '#1a4a6e', marginBottom: '12px', textAlign: 'center' }}>
                        🏆 Ronda {torneo.estado.ronda_actual}
                        </div>
                        {torneo.partidas?.filter(p => p.ronda === torneo.estado.ronda_actual).map(p => {
                        const esJ1 = p.correo_jugador1 === correo;
                        const soyJugador = p.correo_jugador1 === correo || p.correo_jugador2 === correo;
                        const yaElegi = esJ1 ? p.eleccion_jugador1 : p.eleccion_jugador2;
                        return (
                            <div key={p.id} style={{ background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '12px', border: '2px solid #e8f5ff' }}>
                            <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>
                                {p.nombre_jugador1} vs {p.nombre_jugador2}
                            </div>
                            {p.estado === 'finalizada' ? (
                                <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, color: '#0a6e3a' }}>🏆 Ganador: {p.ganador_nombre}</div>
                                {p.nombre_jugador2 !== 'BYE' && (
                                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                                    {p.nombre_jugador1}: {p.eleccion_jugador1} {OPCIONES.find(o => o.key === p.eleccion_jugador1)?.emoji} | {p.nombre_jugador2}: {p.eleccion_jugador2} {OPCIONES.find(o => o.key === p.eleccion_jugador2)?.emoji}
                                    </div>
                                )}
                                </div>
                            ) : soyJugador && !yaElegi ? (
                                <div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                                    {OPCIONES.map(o => (
                                    <button key={o.key} style={styles.eleccionBtn(eleccion === o.key)} onClick={() => setEleccion(o.key)}>
                                        {o.emoji}
                                    </button>
                                    ))}
                                </div>
                                <button style={{ ...styles.btn, width: '100%' }} onClick={() => jugar(p.id, 'ppt/torneo')}>CONFIRMAR</button>
                                </div>
                            ) : soyJugador && yaElegi ? (
                                <div style={styles.msg('info')}>⏳ Elegiste {yaElegi} — Esperando al rival...</div>
                            ) : (
                                <div style={styles.msg('info')}>⏳ Partida en curso...</div>
                            )}
                            </div>
                        );
                        })}
                    </div>
                    )}
                </div>
                )}
            </div>
            )}
        </div>
        </div>
    );
}