import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Upload, FileText, Bot, User, Loader2, LogOut, Shield, Plus, MessageSquare, Clock, Sun, Moon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-rag-platform.onrender.com';

// ── Theme tokens ──────────────────────────────────────────────────────────────
export const THEMES = {
  light: {
    name: 'light',
    pageBg:       '#F0F4F8',
    navBg:        '#FFFFFF',
    navBorder:    '#E2E8F0',
    sidebarBg:    '#FFFFFF',
    sidebarBorder:'#E2E8F0',
    mainBg:       '#F8FAFC',
    inputAreaBg:  '#FFFFFF',
    inputAreaBorder:'#E2E8F0',
    inputBg:      '#F8FAFC',
    inputBorder:  '#CBD5E1',
    inputText:    '#1E293B',
    inputPlaceholder:'#94A3B8',
    cardBg:       '#FFFFFF',
    cardBorder:   '#E2E8F0',
    titleText:    '#0F172A',
    bodyText:     '#475569',
    mutedText:    '#94A3B8',
    labelText:    '#64748B',
    accent:       '#1B6CA8',
    accentBg:     '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentText:   '#1D4ED8',
    userBubbleBg: 'linear-gradient(135deg, #1B6CA8, #1D4ED8)',
    userBubbleBorder: '#1D4ED8',
    userBubbleText:'#FFFFFF',
    botBubbleBg:  '#FFFFFF',
    botBubbleBorder:'#E2E8F0',
    botBubbleText:'#1E293B',
    sysBubbleBg:  '#F1F5F9',
    sysBubbleBorder:'#E2E8F0',
    sysBubbleText:'#64748B',
    btnBg:        'linear-gradient(135deg, #1B6CA8, #1D4ED8)',
    btnShadow:    '0 2px 8px rgba(27,108,168,0.3)',
    newChatBg:    '#EFF6FF',
    newChatBorder:'#BFDBFE',
    newChatText:  '#1D4ED8',
    histItemBg:   '#F8FAFC',
    histItemBorder:'#E2E8F0',
    histItemActive:'#EFF6FF',
    histItemActiveBorder:'#BFDBFE',
    histItemActiveText:'#1D4ED8',
    histItemText: '#475569',
    uploadBg:     '#F0F9FF',
    uploadBorder: '#BAE6FD',
    uploadText:   '#0369A1',
    navStatusColor:'#059669',
    mdHeading:    '#1B6CA8',
    mdBody:       '#1E293B',
    mdCode:       '#1B6CA8',
    mdCodeBg:     '#EFF6FF',
    mdCodeBorder: '#BFDBFE',
    mdBullet:     '#1B6CA8',
    glowColor:    'rgba(27,108,168,0.06)',
    sparkleColors:['#1B6CA8','#60A5FA','#818CF8','#34D399'],
    toggleBg:     '#F1F5F9',
    toggleBorder: '#E2E8F0',
    scrollThumb:  'rgba(27,108,168,0.2)',
  },
  dark: {
    name: 'dark',
    
    pageBg:          '#0D1117',  // page canvas — darkest
    navBg:           '#13181F',  // topbar — 1 stop lighter
    navBorder:       '#2A3140',  // visible separator
    sidebarBg:       '#13181F',  // sidebar same as nav
    sidebarBorder:   '#2A3140',
    mainBg:          '#0D1117',  // chat area
    inputAreaBg:     '#13181F',  // input strip matches nav
    inputAreaBorder: '#2A3140',
    inputBg:         '#1A2232',  
    inputBorder:     '#3A4759',  
    inputText:       '#E8EDF3',  
    inputPlaceholder:'#5A6A80',  

    cardBg:          '#13181F',
    cardBorder:      '#2A3140',
    titleText:    '#E8EDF3',  
    bodyText:     '#B8C5D6',  
    mutedText:    '#7A8FA6',  
    labelText:    '#7A8FA6',  

    accent:       '#4D9EFF',
    accentBg:     'rgba(77,158,255,0.12)',
    accentBorder: 'rgba(77,158,255,0.35)',
    accentText:   '#7DB8FF',   
    userBubbleBg:    'linear-gradient(135deg, #1A5FC8, #2D7EFF)',
    userBubbleBorder:'#2563EB',
    userBubbleText:  '#FFFFFF',
    botBubbleBg:     '#1A2232',  
    botBubbleBorder: '#2E3E54',  
    botBubbleText:   '#D0DCE8',  

    sysBubbleBg:     '#151D2A',
    sysBubbleBorder: '#2A3140',
    sysBubbleText:   '#7A8FA6',  

    btnBg:     'linear-gradient(135deg, #1A5FC8, #2D7EFF)',
    btnShadow: '0 2px 12px rgba(45,126,255,0.4)',

    newChatBg:           'rgba(77,158,255,0.14)',
    newChatBorder:       'rgba(77,158,255,0.4)',
    newChatText:         '#7DB8FF',
    histItemBg:          'rgba(255,255,255,0.04)',
    histItemBorder:      '#2A3140',
    histItemActive:      'rgba(77,158,255,0.16)',
    histItemActiveBorder:'rgba(77,158,255,0.45)',
    histItemActiveText:  '#7DB8FF',
    histItemText:        '#B8C5D6',  

    uploadBg:     'rgba(77,158,255,0.09)',
    uploadBorder: 'rgba(77,158,255,0.38)',
    uploadText:   '#7DB8FF',

    navStatusColor: '#3DD68C',   
    mdHeading:    '#7DB8FF',     
    mdBody:       '#D0DCE8',     
    mdCode:       '#7DB8FF',
    mdCodeBg:     'rgba(77,158,255,0.12)',
    mdCodeBorder: 'rgba(77,158,255,0.28)',
    mdBullet:     '#4D9EFF',
    glowColor:    'rgba(77,158,255,0.07)',
    sparkleColors:['#4D9EFF','#7DB8FF','#A5B4FC','#3DD68C','#F0ABFC'],
    toggleBg:     '#1A2232',     
    toggleBorder: '#3A4759',   
    scrollThumb:  'rgba(77,158,255,0.35)',
  },
};
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^#### (.+)$/gm,'<h4>$1</h4>').replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>').replace(/^---$/gm,'<hr/>')
    .replace(/^[-*] (.+)$/gm,'<li>$1</li>').replace(/^\d+\. (.+)$/gm,'<li class="ordered">$1</li>');
  html = html.replace(/(<li(?! class)[\s\S]*?<\/li>\n?)+/g, m =>
    m.includes('class="ordered"') ? '<ol>'+m.replace(/ class="ordered"/g,'')+'</ol>' : '<ul>'+m+'</ul>');
  html = html.split(/\n{2,}/).map(b => {
    const t2 = b.trim(); if (!t2) return '';
    if (/^<(h[1-4]|ul|ol|hr)/.test(t2)) return t2;
    return '<p>'+t2.replace(/\n/g,'<br/>')+'</p>';
  }).join('');
  return html;
}

function generateId() { return Date.now().toString(36)+Math.random().toString(36).substr(2,5); }
function getTimeLabel(ts) {
  if (!ts) return '';
  const d = new Date(ts), diff = Date.now()-d;
  if (diff<60000) return 'Just now';
  if (diff<3600000) return Math.floor(diff/60000)+'m ago';
  if (diff<86400000) return Math.floor(diff/3600000)+'h ago';
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

function CursorGlow({ t }) {
  const cursorRef = useRef(null), glowRef = useRef(null);
  const mousePos = useRef({ x:-200, y:-200 }), rafRef = useRef(null), lastSparkle = useRef(0);
  useEffect(() => {
    const colors = t.sparkleColors;
    const spawn = (x, y) => {
      const el = document.createElement('div');
      const color = colors[Math.floor(Math.random()*colors.length)];
      const size=Math.random()*5+2, angle=Math.random()*360, dist=Math.random()*24+8, dur=Math.random()*450+350;
      const ox=Math.cos((angle*Math.PI)/180)*dist, oy=Math.sin((angle*Math.PI)/180)*dist;
      el.style.cssText=['position:fixed','left:'+x+'px','top:'+y+'px','width:'+size+'px','height:'+size+'px',
        'border-radius:'+(Math.random()>0.5?'50%':'2px'),'background:'+color,'pointer-events:none','z-index:999999',
        'box-shadow:0 0 '+(size*2)+'px '+color,'transform:translate(-50%,-50%) scale(1)',
        'transition:transform '+dur+'ms ease-out,opacity '+dur+'ms ease-out,left '+dur+'ms ease-out,top '+dur+'ms ease-out','opacity:1',
      ].join(';');
      document.body.appendChild(el);
      requestAnimationFrame(()=>{el.style.left=(x+ox)+'px';el.style.top=(y+oy)+'px';el.style.transform='translate(-50%,-50%) scale(0)';el.style.opacity='0';});
      setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el);},dur+60);
    };
    const move = (e) => {
      mousePos.current={x:e.clientX,y:e.clientY};
      if(cursorRef.current){cursorRef.current.style.left=e.clientX+'px';cursorRef.current.style.top=e.clientY+'px';}
      const now=Date.now(); if(now-lastSparkle.current>32){lastSparkle.current=now;spawn(e.clientX,e.clientY);}
    };
    const loop=()=>{if(glowRef.current){glowRef.current.style.left=mousePos.current.x+'px';glowRef.current.style.top=mousePos.current.y+'px';}rafRef.current=requestAnimationFrame(loop);};
    window.addEventListener('mousemove',move); rafRef.current=requestAnimationFrame(loop);
    return ()=>{window.removeEventListener('mousemove',move);cancelAnimationFrame(rafRef.current);};
  }, [t]);
  return (
    <>
      <div ref={glowRef} style={{ position:'fixed', pointerEvents:'none', zIndex:99997, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle, ${t.glowColor} 0%, transparent 70%)`, transform:'translate(-50%,-50%)' }} />
      <div ref={cursorRef} style={{ position:'fixed', pointerEvents:'none', zIndex:999999 }}>
        <svg width="20" height="24" viewBox="0 0 22 26" fill="none" style={{ filter:`drop-shadow(0 0 3px ${t.accent}bb)` }}>
          <path d="M2 2 L2 20 L6.5 15.5 L10 22 L13 20.5 L9.5 14 L16 14 Z" fill="white" stroke={t.accent} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </div>
    </>
  );
}

export default function Chat({ authData, onLogout, theme, onToggleTheme }) {
  const t = THEMES[theme];
  const [messages, setMessages]                 = useState([]);
  const [input, setInput]                       = useState('');
  const [isLoading, setIsLoading]               = useState(false);
  const [isUploading, setIsUploading]           = useState(false);
  const [sessions, setSessions]                 = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [historyLoading, setHistoryLoading]     = useState(false);
  const messagesEndRef = useRef(null), currentMsgsRef = useRef([]), currentSessionRef = useRef(null);

  useEffect(()=>{currentMsgsRef.current=messages;},[messages]);
  useEffect(()=>{currentSessionRef.current=currentSessionId;},[currentSessionId]);
  const scrollToBottom = useCallback(()=>{ messagesEndRef.current?.scrollIntoView({behavior:'smooth'}); },[]);
  useEffect(()=>{ scrollToBottom(); },[messages]);

  const getAuthHeaders = useCallback(()=>({ Authorization:'Bearer '+(authData?.token||'') }),[authData]);

  const fetchSessions = useCallback(async () => {
    if (!authData?.token) return; setHistoryLoading(true);
    try { const r=await fetch(API_URL+'/api/history/sessions',{headers:getAuthHeaders()}); const d=await r.json(); setSessions(d.sessions||[]); }
    catch { setSessions([]); } finally { setHistoryLoading(false); }
  }, [authData, getAuthHeaders]);

  useEffect(()=>{ fetchSessions(); },[fetchSessions]);

  const saveSession = useCallback(async (sessionId, msgs) => {
    if(!sessionId||!msgs||msgs.length===0) return;
    const title=(msgs.find(m=>m.role==='user')?.content||'New Chat').substring(0,60);
    try { await fetch(API_URL+'/api/history/sessions',{method:'POST',headers:{'Content-Type':'application/json',...getAuthHeaders()},body:JSON.stringify({session_id:sessionId,title,messages:msgs})}); await fetchSessions(); }
    catch{}
  },[getAuthHeaders,fetchSessions]);

  const loadSession = useCallback(async (sessionId) => {
    await saveSession(currentSessionRef.current, currentMsgsRef.current);
    try { const r=await fetch(API_URL+'/api/history/sessions/'+sessionId,{headers:getAuthHeaders()}); const d=await r.json(); setCurrentSessionId(d.id); setMessages(d.messages||[]); await fetchSessions(); }
    catch{ console.warn('Could not load session'); }
  },[getAuthHeaders,fetchSessions,saveSession]);

  const startNewChat = useCallback(async () => {
    await saveSession(currentSessionRef.current, currentMsgsRef.current);
    setCurrentSessionId(generateId()); setMessages([]);
  },[saveSession]);

  const handleSend = async () => {
    if(!input.trim()||isLoading) return;
    const text=input.trim(); setInput(''); setIsLoading(true);
    let sid=currentSessionRef.current; if(!sid){sid=generateId();setCurrentSessionId(sid);}
    const userMsg={role:'user',content:text,id:generateId()};
    const botId=generateId(), botPH={role:'assistant',content:'',sources:[],id:botId,streaming:true};
    setMessages(prev=>[...prev,userMsg,botPH]);
    try {
      const res=await fetch(API_URL+'/api/chat/stream',{method:'POST',headers:{'Content-Type':'application/json',...getAuthHeaders()},body:JSON.stringify({message:text})});
      if(!res.ok) throw new Error('Backend error');
      const reader=res.body.getReader(), decoder=new TextDecoder('utf-8');
      let full='', buffer='', srcs=[];
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        buffer+=decoder.decode(value,{stream:true}); const lines=buffer.split('\n'); buffer=lines.pop();
        for(const line of lines){
          if(!line.startsWith('data: ')) continue;
          const ds=line.substring(6).trim(); if(!ds||ds==='[DONE]') continue;
          try{const p=JSON.parse(ds);
            if(p.type==='token'){full+=p.content;setMessages(prev=>prev.map(m=>m.id===botId?{...m,content:full}:m));}
            else if(p.type==='citations'){srcs=p.citations||[];setMessages(prev=>prev.map(m=>m.id===botId?{...m,sources:srcs}:m));}
          }catch{}
        }
      }
      setMessages(prev=>prev.map(m=>m.id===botId?{...m,content:full,sources:srcs,streaming:false}:m));
      await saveSession(sid,[...currentMsgsRef.current.filter(m=>m.id!==botId&&m.id!==userMsg.id),userMsg,{role:'assistant',content:full,sources:srcs,id:botId}]);
    } catch {
      setMessages(prev=>prev.map(m=>m.id===botId?{...m,content:'Error communicating with backend. Please try again.',streaming:false}:m));
    } finally { setIsLoading(false); }
  };

  const handleFileUpload = async (event) => {
    const file=event.target.files[0]; if(!file) return;
    const fd=new FormData(); fd.append('file',file); setIsUploading(true);
    try {
      const r=await fetch(API_URL+'/api/documents/upload',{method:'POST',body:fd,headers:getAuthHeaders()});
      if(r.status===403){setMessages(prev=>[...prev,{role:'system',content:'Upload blocked: Only Admins can upload documents.',id:generateId()}]);return;}
      if(!r.ok) throw new Error('failed');
      setMessages(prev=>[...prev,{role:'system',content:'Successfully uploaded and processing: '+file.name,id:generateId()}]);
    } catch { setMessages(prev=>[...prev,{role:'system',content:'Upload failed. Please try again.',id:generateId()}]); }
    finally{setIsUploading(false);event.target.value=null;}
  };

  const handleKeyDown = (e) => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend();} };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", overflow:'hidden', background: t.pageBg }}>
      <CursorGlow t={t} />

      {/* TOP NAV */}
      <header style={{ position:'relative', zIndex:20, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:56, background: t.navBg, borderBottom:`1px solid ${t.navBorder}`, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background: t.btnBg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: t.btnShadow }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="12" r="3.5" fill="white"/></svg>
          </div>
          <div>
            <span style={{ color: t.titleText, fontWeight:700, fontSize:14, letterSpacing:'-0.01em' }}>PharmaCore</span>
            <span style={{ color: t.mutedText, fontSize:13, marginLeft:6 }}>/ Compliance AI</span>
          </div>
        </div>

        {/* Status */}
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color: t.navStatusColor, letterSpacing:'0.05em', textTransform:'uppercase' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background: t.navStatusColor, boxShadow:`0 0 6px ${t.navStatusColor}` }}/>
          System Online
        </div>

        {/* Right controls */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Theme toggle */}
          <button onClick={onToggleTheme} style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 12px', background: t.toggleBg, border:`1px solid ${t.toggleBorder}`, borderRadius:8, cursor:'pointer', color: t.labelText, fontSize:12, fontWeight:600, fontFamily:'inherit', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.toggleBorder;e.currentTarget.style.color=t.labelText;}}>
            {theme==='light' ? <Moon size={13}/> : <Sun size={13}/>}
            {theme==='light' ? 'Dark' : 'Light'}
          </button>

          {/* User pill */}
          <div style={{ display:'flex', alignItems:'center', gap:7, background: t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:100, padding:'5px 12px 5px 7px' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background: t.btnBg, display:'flex', alignItems:'center', justifyContent:'center' }}><User size={11} color="white"/></div>
            <span style={{ color: t.bodyText, fontSize:12, fontWeight:600 }}>{authData?.email||'User'}</span>
            {authData?.role && <span style={{ background: authData.role==='Admin'?t.accentBg:'rgba(16,185,129,0.1)', color: authData.role==='Admin'?t.accentText:'#059669', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100, letterSpacing:'0.04em', textTransform:'uppercase', border:`1px solid ${authData.role==='Admin'?t.accentBorder:'rgba(16,185,129,0.2)'}` }}>{authData.role}</span>}
          </div>

          {/* Logout */}
          <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:8, cursor:'pointer', color:'#DC2626', fontSize:12, fontWeight:600, transition:'all 0.2s', fontFamily:'inherit' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.12)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(239,68,68,0.06)';}}>
            <LogOut size={12}/> Sign out
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', zIndex:10 }}>

        {/* SIDEBAR */}
        <aside style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', background: t.sidebarBg, borderRight:`1px solid ${t.sidebarBorder}` }}>

          {/* New Chat */}
          <div style={{ padding:'12px 12px 10px' }}>
            <button onClick={startNewChat} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px 16px', background: t.newChatBg, border:`1px solid ${t.newChatBorder}`, borderRadius:9, color: t.newChatText, fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.18s', fontFamily:'inherit' }}
              onMouseEnter={e=>{e.currentTarget.style.background=t.accentBg;e.currentTarget.style.boxShadow=`0 2px 8px ${t.accent}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=t.newChatBg;e.currentTarget.style.boxShadow='none';}}>
              <Plus size={14}/> New Chat
            </button>
          </div>

          {/* History */}
          <div style={{ flex:1, overflowY:'auto', padding:'0 12px 10px', borderBottom:`1px solid ${t.sidebarBorder}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, color: t.mutedText, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, padding:'2px 0' }}>
              <Clock size={10}/> Chat History
            </div>
            {historyLoading ? (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 4px', color: t.mutedText, fontSize:12 }}>
                <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> Loading...
              </div>
            ) : sessions.length===0 ? (
              <div style={{ textAlign:'center', padding:'20px 8px', color: t.mutedText, fontSize:12, lineHeight:1.6 }}>
                <MessageSquare size={18} style={{ margin:'0 auto 8px', display:'block', opacity:0.3 }}/>
                No history yet.<br/>Start a conversation!
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {sessions.map(session => {
                  const isActive = session.id===currentSessionId;
                  return (
                    <button key={session.id} onClick={()=>loadSession(session.id)} style={{ width:'100%', textAlign:'left', padding:'8px 10px', background:isActive?t.histItemActive:t.histItemBg, border:`1px solid ${isActive?t.histItemActiveBorder:t.histItemBorder}`, borderRadius:8, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', display:'flex', alignItems:'flex-start', gap:8 }}
                      onMouseEnter={e=>{if(!isActive){e.currentTarget.style.background=t.accentBg;e.currentTarget.style.borderColor=t.accentBorder;}}}
                      onMouseLeave={e=>{if(!isActive){e.currentTarget.style.background=t.histItemBg;e.currentTarget.style.borderColor=t.histItemBorder;}}}>
                      <MessageSquare size={11} color={isActive?t.accent:t.mutedText} style={{ flexShrink:0, marginTop:2 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:isActive?t.accentText:t.histItemText, fontSize:12, fontWeight:isActive?600:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{session.title||'Untitled Chat'}</div>
                        <div style={{ color: t.mutedText, fontSize:10, marginTop:1 }}>{getTimeLabel(session.timestamp)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upload */}
          <div style={{ padding:'12px' }}>
            <div style={{ color: t.mutedText, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Knowledge Base</div>
            {authData?.role!=='User' ? (
              <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, padding:'14px 12px', border:`2px dashed ${isUploading?t.accent:t.uploadBorder}`, borderRadius:10, cursor:isUploading?'not-allowed':'pointer', background: t.uploadBg, transition:'all 0.2s' }}
                onMouseEnter={e=>{if(!isUploading){e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.background=t.accentBg;}}}
                onMouseLeave={e=>{if(!isUploading){e.currentTarget.style.borderColor=t.uploadBorder;e.currentTarget.style.background=t.uploadBg;}}}>
                {isUploading ? <Loader2 size={18} color={t.accent} style={{ animation:'spin 1s linear infinite' }}/> : <Upload size={18} color={t.accent}/>}
                <div style={{ textAlign:'center' }}>
                  <div style={{ color: t.uploadText, fontSize:12, fontWeight:600 }}>{isUploading?'Processing...':'Upload SOP'}</div>
                  <div style={{ color: t.mutedText, fontSize:10, marginTop:1 }}>PDF, TXT, CSV, DOCX</div>
                </div>
                <input type="file" style={{ display:'none' }} accept=".pdf,.txt,.md,.csv,.doc,.docx,.json" onChange={handleFileUpload} disabled={isUploading}/>
              </label>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background: t.histItemBg, border:`1px solid ${t.histItemBorder}`, borderRadius:8 }}>
                <Shield size={13} color={t.mutedText}/><span style={{ color: t.mutedText, fontSize:11 }}>Uploads: Admin only</span>
              </div>
            )}
            <div style={{ color: t.mutedText, fontSize:10, textAlign:'center', marginTop:10, lineHeight:1.5 }}>PharmaCore AI · FDA 21 CFR Part 11</div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background: t.mainBg }}>

          {/* Feed */}
          <div className="chat-scroll" style={{ flex:1, overflowY:'auto', padding:'28px 32px', display:'flex', flexDirection:'column' }}>
            {messages.length===0 ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
                <div style={{ width:68, height:68, borderRadius:20, background: t.accentBg, border:`1px solid ${t.accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, boxShadow:`0 4px 20px ${t.accent}20` }}>
                  <Bot size={32} color={t.accent}/>
                </div>
                <h2 style={{ color: t.titleText, fontSize:24, fontWeight:700, marginBottom:10, letterSpacing:'-0.01em' }}>PharmaCore Knowledge Assistant</h2>
                <p style={{ color: t.bodyText, fontSize:15, maxWidth:440, lineHeight:1.7, marginBottom:28 }}>
                  Upload your SOPs from the sidebar, then ask compliance questions with precise source citations.
                </p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                  {['Compliance Rules','SOP Procedures','Regulatory Definitions','Audit Readiness'].map((tag,i) => (
                    <button key={i} onClick={()=>setInput(tag)} style={{ background: t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:100, padding:'6px 16px', color: t.accentText, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background=t.accent;e.currentTarget.style.color='white';e.currentTarget.style.borderColor=t.accent;}}
                      onMouseLeave={e=>{e.currentTarget.style.background=t.accentBg;e.currentTarget.style.color=t.accentText;e.currentTarget.style.borderColor=t.accentBorder;}}
                    >{tag}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth:780, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:18 }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display:'flex', flexDirection:msg.role==='user'?'row-reverse':'row', alignItems:'flex-start', gap:10 }}>
                    {msg.role!=='user' && (
                      <div style={{ flexShrink:0, width:32, height:32, borderRadius:9, background:msg.role==='system'?t.histItemBg:t.btnBg, border:`1px solid ${msg.role==='system'?t.sidebarBorder:t.accent}20`, display:'flex', alignItems:'center', justifyContent:'center', marginTop:2, boxShadow:msg.role==='assistant'?`0 2px 8px ${t.accent}25`:'none' }}>
                        {msg.role==='system'?<FileText size={14} color={t.mutedText}/>:<Bot size={15} color="white"/>}
                      </div>
                    )}
                    <div style={{ maxWidth:'78%', background:msg.role==='user'?t.userBubbleBg:msg.role==='system'?t.sysBubbleBg:t.botBubbleBg, border:`1px solid ${msg.role==='user'?t.userBubbleBorder:msg.role==='system'?t.sysBubbleBorder:t.botBubbleBorder}`, borderRadius:msg.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px', padding:'12px 16px', boxShadow:msg.role==='user'?`0 2px 12px ${t.accent}30`:'0 1px 3px rgba(0,0,0,0.06)' }}>
                      {msg.role==='assistant' ? (
                        <div>
                          <div className="md-body" dangerouslySetInnerHTML={{ __html:renderMarkdown(msg.content) }}/>
                          {msg.streaming && <span style={{ display:'inline-block', width:7, height:15, background:t.accent, borderRadius:2, marginLeft:3, animation:'blink 0.8s step-end infinite', verticalAlign:'text-bottom' }}/>}
                        </div>
                      ) : (
                        <p style={{ color:msg.role==='user'?t.userBubbleText:msg.role==='system'?t.sysBubbleText:t.botBubbleText, fontSize:14, lineHeight:1.65, margin:0, fontStyle:msg.role==='system'?'italic':'normal' }}>{msg.content}</p>
                      )}
                      {msg.sources?.length>0 && (
                        <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${t.navBorder}` }}>
                          <div style={{ color: t.mutedText, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>Sources</div>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                            {msg.sources.map((s,i)=>(
                              <div key={i} title={s.text_snippet} style={{ display:'inline-flex', alignItems:'center', gap:5, background: t.accentBg, border:`1px solid ${t.accentBorder}`, borderRadius:6, padding:'4px 9px', cursor:'help' }}>
                                <FileText size={10} color={t.accent}/>
                                <span style={{ color: t.accentText, fontSize:11, fontWeight:600 }}>{s.source} · p.{s.page}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {msg.role==='user' && (
                      <div style={{ flexShrink:0, width:32, height:32, borderRadius:9, background: t.accentBg, border:`1px solid ${t.accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
                        <User size={15} color={t.accent}/>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length-1]?.role!=='assistant' && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <div style={{ flexShrink:0, width:32, height:32, borderRadius:9, background: t.btnBg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 2px 8px ${t.accent}30` }}>
                      <Loader2 size={15} color="white" style={{ animation:'spin 1s linear infinite' }}/>
                    </div>
                    <div style={{ background: t.botBubbleBg, border:`1px solid ${t.botBubbleBorder}`, borderRadius:'4px 16px 16px 16px', padding:'14px 18px', display:'flex', alignItems:'center', gap:5, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                      {[0,150,300].map(delay=>(
                        <div key={delay} style={{ width:6, height:6, borderRadius:'50%', background: t.accent, animation:`bounce 1.2s ${delay}ms infinite`}}/>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div style={{ flexShrink:0, padding:'14px 24px 18px', background: t.inputAreaBg, borderTop:`1px solid ${t.inputAreaBorder}`, boxShadow:'0 -1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ maxWidth:780, margin:'0 auto' }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap:10, background: t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:13, padding:'8px 10px 8px 16px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', transition:'border-color 0.2s' }}
                onFocusCapture={e=>{ e.currentTarget.style.borderColor=t.accent; e.currentTarget.style.boxShadow=`0 0 0 3px ${t.accent}18`; }}
                onBlurCapture={e=>{ e.currentTarget.style.borderColor=t.inputBorder; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)'; }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading}
                  placeholder="Ask about compliance procedures, SOPs, or regulatory requirements..." rows={1}
                  style={{ flex:1, background:'none', border:'none', outline:'none', color: t.inputText, fontSize:14, lineHeight:1.6, resize:'none', fontFamily:'inherit', padding:'4px 0', maxHeight:120, overflowY:'auto' }}
                  onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,120)+'px';}}
                />
                <button onClick={handleSend} disabled={isLoading||!input.trim()} style={{ flexShrink:0, width:38, height:38, background:(isLoading||!input.trim())?t.histItemBg:t.btnBg, border:`1px solid ${(isLoading||!input.trim())?t.inputBorder:t.accent}`, borderRadius:9, cursor:(isLoading||!input.trim())?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:(!isLoading&&input.trim())?t.btnShadow:'none', transition:'all 0.18s' }}
                  onMouseEnter={e=>{if(!isLoading&&input.trim())e.currentTarget.style.transform='scale(1.05)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';}}>
                  <Send size={14} color={(!isLoading&&input.trim())?'white':t.mutedText}/>
                </button>
              </div>
              <p style={{ textAlign:'center', color: t.mutedText, fontSize:11, marginTop:7, fontWeight:400 }}>
                AI may make errors · Verify critical compliance info against source documents · Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce{ 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Scrollbar — clearly visible in dark mode */
        .chat-scroll::-webkit-scrollbar       { width: 5px }
        .chat-scroll::-webkit-scrollbar-track { background: transparent }
        .chat-scroll::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 4px }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: ${t.accent}; }

        /* Sidebar history scrollbar */
        aside::-webkit-scrollbar       { width: 4px }
        aside::-webkit-scrollbar-track { background: transparent }
        aside::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 3px }

        textarea::placeholder { color: ${t.inputPlaceholder} !important }
        textarea:disabled     { opacity: 0.5 }
        * { box-sizing: border-box }

        /* ── Markdown body ── */
        .md-body {
          color: ${t.mdBody};
          font-size: 14px;
          line-height: 1.78;
        }
        .md-body p { margin: 0 0 10px 0 }
        .md-body p:last-child { margin-bottom: 0 }

        /* Headings — bright accent, clearly hierarchy */
        .md-body h1,.md-body h2,.md-body h3,.md-body h4 {
          color: ${t.mdHeading};
          font-weight: 700;
          margin: 16px 0 8px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .md-body h1 { font-size: 17px }
        .md-body h2 { font-size: 15px }
        .md-body h3,.md-body h4 { font-size: 14px }

        /* Lists */
        .md-body ul { margin: 8px 0 12px; padding: 0; list-style: none }
        .md-body ol { margin: 8px 0 12px; padding: 0; list-style: none; counter-reset: ol-counter }
        .md-body ul li { position: relative; padding-left: 18px; margin-bottom: 5px; color: ${t.mdBody} }
        .md-body ul li::before {
          content: '';
          position: absolute; left: 5px; top: 8px;
          width: 5px; height: 5px; border-radius: 50%;
          background: ${t.mdBullet};
          box-shadow: 0 0 4px ${t.mdBullet}80;
        }
        .md-body ol li { position: relative; padding-left: 24px; margin-bottom: 5px; counter-increment: ol-counter; color: ${t.mdBody} }
        .md-body ol li::before {
          content: counter(ol-counter) '.';
          position: absolute; left: 0;
          color: ${t.mdBullet}; font-weight: 700; font-size: 12px; top: 1px;
        }

        /* Inline styles */
        .md-body strong { color: ${t.titleText}; font-weight: 700 }
        .md-body em     { color: ${t.bodyText}; font-style: italic }

        /* Code — high contrast pill */
        .md-body code {
          background: ${t.mdCodeBg};
          border: 1px solid ${t.mdCodeBorder};
          border-radius: 5px;
          padding: 2px 7px;
          font-size: 12.5px;
          color: ${t.mdCode};
          font-family: 'JetBrains Mono','Fira Code',monospace;
          font-weight: 500;
        }
        .md-body hr { border: none; border-top: 1px solid ${t.navBorder}; margin: 14px 0 }

        /* Input focus ring — visible in dark mode */
        textarea:focus { outline: none }
      `}</style>
    </div>
  );
}
