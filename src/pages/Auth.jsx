import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-rag-platform.onrender.com';

// ── Theme tokens ──────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    pageBg:       '#F0F4F8',
    leftBg:       'linear-gradient(160deg, #1B3A6B 0%, #1a4f8a 60%, #0f3460 100%)',
    cardBg:       '#FFFFFF',
    cardBorder:   '#E2E8F0',
    cardShadow:   '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
    labelColor:   '#64748B',
    inputBg:      '#F8FAFC',
    inputBorder:  '#CBD5E1',
    inputText:    '#1E293B',
    inputFocusBorder: '#1B6CA8',
    inputFocusBg: '#EFF6FF',
    titleColor:   '#0F172A',
    subtitleColor:'#64748B',
    btnBg:        'linear-gradient(135deg, #1B6CA8, #1B3A6B)',
    btnShadow:    '0 4px 14px rgba(27,108,168,0.35)',
    switchBg:     '#F1F5F9',
    switchBorder: '#E2E8F0',
    switchText:   '#475569',
    dividerColor: '#E2E8F0',
    dividerText:  '#94A3B8',
    footerText:   '#94A3B8',
    accentColor:  '#1B6CA8',
    accentLight:  'rgba(27,108,168,0.1)',
    pillBg:       'rgba(255,255,255,0.15)',
    pillText:     'rgba(255,255,255,0.9)',
    headingText:  '#FFFFFF',
    bodyText:     'rgba(255,255,255,0.75)',
    featureIcon:  'rgba(255,255,255,0.12)',
    featureText:  'rgba(255,255,255,0.8)',
    errorBg:      '#FEF2F2',
    errorBorder:  '#FECACA',
    errorText:    '#DC2626',
    toggleIcon:   '🌙',
    nodeColor:    'rgba(255,255,255,0.35)',
    lineColor:    'rgba(255,255,255,0.12)',
  },
  dark: {
    pageBg:       '#0D1117',
    leftBg:       'linear-gradient(160deg, #0D1117 0%, #13181F 100%)',
    cardBg:       '#13181F',      // card clearly above page bg
    cardBorder:   '#2A3140',      // visible card border
    cardShadow:   '0 24px 64px rgba(0,0,0,0.6)',
    labelColor:   '#7A8FA6',      // was #94A3B8 — still readable
    inputBg:      '#1A2232',      // clearly distinct from card bg
    inputBorder:  '#3A4759',      // solid visible border
    inputText:    '#E8EDF3',
    inputFocusBorder: '#4D9EFF',
    inputFocusBg: '#1A2232',
    titleColor:   '#E8EDF3',
    subtitleColor:'#7A8FA6',      // was #64748B — too dark, now readable
    btnBg:        'linear-gradient(135deg, #1A5FC8, #2D7EFF)',
    btnShadow:    '0 4px 16px rgba(45,126,255,0.45)',
    switchBg:     '#1A2232',      // clearly visible switch bg
    switchBorder: '#3A4759',
    switchText:   '#B8C5D6',      // was #94A3B8 — brighter
    dividerColor: '#2A3140',
    dividerText:  '#7A8FA6',      // was #475569 — barely visible, now readable
    footerText:   '#5A6A80',      // was #475569 — bumped up
    accentColor:  '#4D9EFF',
    accentLight:  'rgba(77,158,255,0.12)',
    pillBg:       'rgba(77,158,255,0.14)',
    pillText:     '#7DB8FF',
    headingText:  '#E8EDF3',
    bodyText:     '#B8C5D6',      // was #94A3B8 — clearer
    featureIcon:  'rgba(77,158,255,0.16)',
    featureText:  '#B8C5D6',      // was #94A3B8 — clearer
    errorBg:      'rgba(239,68,68,0.12)',
    errorBorder:  'rgba(239,68,68,0.35)',
    errorText:    '#FCA5A5',
    toggleIcon:   '☀️',
    nodeColor:    'rgba(77,158,255,0.55)',
    lineColor:    'rgba(77,158,255,0.14)',
  },
};

// ── Molecule canvas ───────────────────────────────────────────────────────────
function MoleculeCanvas({ nodeColor, lineColor }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = nodeColor; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [nodeColor, lineColor]);
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

// ── Cursor ────────────────────────────────────────────────────────────────────
function CursorGlow({ accent }) {
  const cursorRef = useRef(null);
  const glowRef   = useRef(null);
  const mousePos  = useRef({ x: -200, y: -200 });
  const rafRef    = useRef(null);
  const lastSparkle = useRef(0);

  useEffect(() => {
    const colors = [accent, '#60A5FA', '#A78BFA', '#34D399'];
    const spawnSparkle = (x, y) => {
      const el = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 5 + 2, angle = Math.random() * 360, dist = Math.random() * 24 + 8, dur = Math.random() * 450 + 350;
      const ox = Math.cos((angle * Math.PI) / 180) * dist, oy = Math.sin((angle * Math.PI) / 180) * dist;
      el.style.cssText = ['position:fixed','left:'+x+'px','top:'+y+'px','width:'+size+'px','height:'+size+'px',
        'border-radius:'+(Math.random()>0.5?'50%':'2px'),'background:'+color,'pointer-events:none','z-index:999999',
        'box-shadow:0 0 '+(size*2)+'px '+color,'transform:translate(-50%,-50%) scale(1)',
        'transition:transform '+dur+'ms ease-out,opacity '+dur+'ms ease-out,left '+dur+'ms ease-out,top '+dur+'ms ease-out','opacity:1',
      ].join(';');
      document.body.appendChild(el);
      requestAnimationFrame(() => { el.style.left=(x+ox)+'px'; el.style.top=(y+oy)+'px'; el.style.transform='translate(-50%,-50%) scale(0)'; el.style.opacity='0'; });
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, dur+60);
    };
    const move = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) { cursorRef.current.style.left=e.clientX+'px'; cursorRef.current.style.top=e.clientY+'px'; }
      const now = Date.now();
      if (now - lastSparkle.current > 32) { lastSparkle.current = now; spawnSparkle(e.clientX, e.clientY); }
    };
    const loop = () => { if (glowRef.current) { glowRef.current.style.left=mousePos.current.x+'px'; glowRef.current.style.top=mousePos.current.y+'px'; } rafRef.current=requestAnimationFrame(loop); };
    window.addEventListener('mousemove', move); rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(rafRef.current); };
  }, [accent]);

  return (
    <>
      <div ref={glowRef} style={{ position:'fixed', pointerEvents:'none', zIndex:99997, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle, ${accent}18 0%, transparent 70%)`, transform:'translate(-50%,-50%)' }} />
      <div ref={cursorRef} style={{ position:'fixed', pointerEvents:'none', zIndex:999999 }}>
        <svg width="20" height="24" viewBox="0 0 22 26" fill="none" style={{ filter:`drop-shadow(0 0 3px ${accent}cc)` }}>
          <path d="M2 2 L2 20 L6.5 15.5 L10 22 L13 20.5 L9.5 14 L16 14 Z" fill="white" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

// ── Auth page ─────────────────────────────────────────────────────────────────
export default function Auth({ onAuth, theme, onToggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('User');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = THEMES[theme];
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (!isLogin) {
        const r = await axios.post(`${API_URL}/api/auth/register`, { email, password, role });
        if (!r.data) throw new Error('Registration failed');
      }
      const fd = new URLSearchParams(); fd.append('username', email); fd.append('password', password);
      const lr = await axios.post(`${API_URL}/api/auth/login`, fd, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      const { access_token, role: userRole } = lr.data;
      localStorage.setItem('pharma_rag_token', access_token);
      localStorage.setItem('pharma_rag_role', userRole);
      localStorage.setItem('pharma_rag_email', email);
      onAuth({ token: access_token, role: userRole, email });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  const inp = (extra = {}) => ({
    width:'100%', background: t.inputBg, border:`1px solid ${t.inputBorder}`,
    borderRadius: 10, padding:'13px 16px', color: t.inputText, fontSize:14,
    outline:'none', boxSizing:'border-box', fontFamily:'inherit', transition:'all 0.2s',
    ...extra,
  });

  return (
    <div style={{ position:'fixed', inset:0, background: t.pageBg, fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", overflow:'hidden', display:'flex' }}>
      <CursorGlow accent={t.accentColor} />

      {/* Theme toggle */}
      <button onClick={onToggleTheme} style={{
        position:'absolute', top:20, right:20, zIndex:100,
        background: t.cardBg, border:`1px solid ${t.cardBorder}`,
        borderRadius:10, padding:'8px 14px', cursor:'pointer',
        display:'flex', alignItems:'center', gap:8,
        fontSize:13, fontWeight:600, color: t.subtitleColor,
        boxShadow:'0 2px 8px rgba(0,0,0,0.08)', fontFamily:'inherit',
        transition:'all 0.2s',
      }}>
        <span style={{ fontSize:16 }}>{t.toggleIcon}</span>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* LEFT — branding panel */}
      <div style={{
        flex:1, position:'relative', overflow:'hidden',
        background: t.leftBg,
        display:'flex', flexDirection:'column', justifyContent:'center', padding:'5vw',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateX(-20px)',
        transition:'all 0.7s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <MoleculeCanvas nodeColor={t.nodeColor} lineColor={t.lineColor} />
        <div style={{ position:'relative', zIndex:2, maxWidth:480 }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:56 }}>
            <div style={{ width:46, height:46, borderRadius:13, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3.5" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ color:'rgba(255,255,255,0.95)', fontSize:16, fontWeight:700, letterSpacing:'-0.01em' }}>PharmaCore Inc.</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:1 }}>Compliance Intelligence Platform</div>
            </div>
          </div>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:100, padding:'5px 14px', marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ADE80', boxShadow:'0 0 6px #4ADE80' }}/>
            <span style={{ color:'rgba(255,255,255,0.9)', fontSize:11, fontWeight:600, letterSpacing:'0.08em' }}>FDA & GMP Compliant · Live</span>
          </div>

          <h1 style={{ color:'#FFFFFF', fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:800, lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:20 }}>
            Intelligent SOP<br/><span style={{ color:'rgba(255,255,255,0.6)' }}>Knowledge Assistant</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, lineHeight:1.75, marginBottom:40, maxWidth:400 }}>
            Query Standard Operating Procedures with AI-backed precision. Get instant answers with exact source citations.
          </p>

          {[
            { icon:'🔬', text:'Pharmaceutical SOP Analysis' },
            { icon:'📋', text:'GMP & FDA Compliance Ready' },
            { icon:'⚡', text:'Real-time Document Q&A' },
          ].map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12,
              opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateX(-16px)',
              transition:`all 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15+i*0.08}s` }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{f.icon}</div>
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:14 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div style={{
        width:'clamp(380px,36vw,460px)', display:'flex', alignItems:'center', justifyContent:'center',
        padding:'32px 40px', background: t.pageBg,
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateX(20px)',
        transition:'all 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s',
      }}>
        <div style={{ width:'100%', background: t.cardBg, border:`1px solid ${t.cardBorder}`, borderRadius:18, padding:'36px 32px', boxShadow: t.cardShadow }}>

          <div style={{ marginBottom:28 }}>
            <h2 style={{ color: t.titleColor, fontSize:24, fontWeight:700, letterSpacing:'-0.01em', marginBottom:6 }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color: t.subtitleColor, fontSize:14 }}>
              {isLogin ? 'Sign in to access your compliance dashboard' : 'Join PharmaCore to start querying SOPs'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', color: t.labelColor, fontSize:12, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:7 }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@pharmacompany.com" style={inp()}
                onFocus={e => { e.target.style.borderColor=t.inputFocusBorder; e.target.style.background=t.inputFocusBg; e.target.style.boxShadow=`0 0 0 3px ${t.accentColor}20`; }}
                onBlur={e => { e.target.style.borderColor=t.inputBorder; e.target.style.background=t.inputBg; e.target.style.boxShadow='none'; }}
              />
            </div>

            <div>
              <label style={{ display:'block', color: t.labelColor, fontSize:12, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:7 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" style={inp({ paddingRight:44 })}
                  onFocus={e => { e.target.style.borderColor=t.inputFocusBorder; e.target.style.background=t.inputFocusBg; e.target.style.boxShadow=`0 0 0 3px ${t.accentColor}20`; }}
                  onBlur={e => { e.target.style.borderColor=t.inputBorder; e.target.style.background=t.inputBg; e.target.style.boxShadow='none'; }}
                />
                <button type="button" onClick={() => setShowPass(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color: t.subtitleColor, fontSize:15, padding:0, fontFamily:'inherit' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label style={{ display:'block', color: t.labelColor, fontSize:12, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:7 }}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={inp({ cursor:'pointer' })}>
                  <option value="User">👤 User – Query SOPs</option>
                  <option value="Admin">🔑 Admin – Upload & Manage</option>
                </select>
              </div>
            )}

            {error && (
              <div style={{ background: t.errorBg, border:`1px solid ${t.errorBorder}`, borderRadius:9, padding:'11px 14px', color: t.errorText, fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'13px', background: loading ? t.accentLight : t.btnBg,
              border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:700,
              cursor: loading ? 'not-allowed' : 'pointer', letterSpacing:'0.02em',
              boxShadow: loading ? 'none' : t.btnShadow, transition:'all 0.2s', fontFamily:'inherit', marginTop:2,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; }}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
            <div style={{ flex:1, height:1, background: t.dividerColor }}/>
            <span style={{ color: t.dividerText, fontSize:12 }}>{isLogin ? 'New to PharmaCore?' : 'Have an account?'}</span>
            <div style={{ flex:1, height:1, background: t.dividerColor }}/>
          </div>

          <button onClick={() => { setIsLogin(p=>!p); setError(''); }} style={{
            width:'100%', padding:'12px', background: t.switchBg, border:`1px solid ${t.switchBorder}`,
            borderRadius:10, color: t.switchText, fontSize:14, fontWeight:600,
            cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=t.accentColor; e.currentTarget.style.color=t.accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=t.switchBorder; e.currentTarget.style.color=t.switchText; }}
          >
            {isLogin ? 'Create new account' : 'Sign in instead'}
          </button>

          <p style={{ textAlign:'center', color: t.footerText, fontSize:11, marginTop:22, lineHeight:1.5 }}>
            Protected by enterprise-grade encryption.<br/>© 2025 PharmaCore Inc. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        input::placeholder { color: ${t.labelColor} !important; opacity: 0.6; }
        select option { background: ${t.cardBg}; color: ${t.inputText}; }
      `}</style>
    </div>
  );
}
