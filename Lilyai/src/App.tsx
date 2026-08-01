import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Cpu, Send, 
  Search, AlertTriangle, Key, Globe, Sparkles, RefreshCw, LucideIcon 
} from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  riskScore: number | null;
  highlights: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'scanner'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hi there! I'm Lily 👋 Your Personal Cyber Guardian. I analyze suspicious emails, monitor online threat vectors, and keep you safe. Paste any suspicious link or email to get started!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      riskScore: null,
      highlights: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'CRITICAL'>('LOW');
  
  // Custom Cursor Position
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Widget States
  const [password, setPassword] = useState('');
  const [passStrength, setPassStrength] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'scanning' | 'safe' | 'danger'>('idle');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Custom Cursor Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Password Strength Logic
  const evalPassword = (val: string) => {
    setPassword(val);
    if (!val) {
      setPassStrength(0);
      return;
    }
    let score = 0;
    if (val.length >= 8) score += 25;
    if (val.length >= 12) score += 15;
    if (/[A-Z]/.test(val)) score += 20;
    if (/[0-9]/.test(val)) score += 20;
    if (/[^A-Za-z0-9]/.test(val)) score += 20;
    setPassStrength(Math.min(100, score));
  };

  // Simulated Chat Logic
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      riskScore: null,
      highlights: []
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Threat Analysis Response
    setTimeout(() => {
      let aiResponse = "";
      let riskScore: number | null = null;
      let highlights: string[] = [];

      const lower = userText.toLowerCase();
      if (lower.includes('bank') || lower.includes('block') || lower.includes('click') || lower.includes('.xyz')) {
        aiResponse = "🚨 POTENTIAL PHISHING THREAT DETECTED!\n\nAnalysis indicates high risk features:";
        riskScore = 89;
        highlights = [
          "Urgent/Threatening language demanding quick action",
          "Suspicious TLD domain structure (.xyz)",
          "Hidden hyperlink directing to unverified credentials page"
        ];
        setThreatLevel('CRITICAL');
      } else if (lower.includes('hello') || lower.includes('hi')) {
        aiResponse = "Hello! I'm ready to assist. Paste a URL or suspicious email header to begin deep threat scanning.";
        setThreatLevel('LOW');
      } else {
        aiResponse = "I've logged your input query. To give you an accurate cybersecurity assessment, please provide specific suspicious URLs, sender addresses, or email texts.";
        setThreatLevel('LOW');
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        riskScore,
        highlights
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1800);
  };

  const NavButton = ({ id, label, icon: Icon }: { id: 'chat' | 'scanner'; label: string; icon: LucideIcon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors relative ${
          isActive ? 'text-black' : 'text-slate-400 hover:text-white'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="navTab"
            className="absolute inset-0 bg-[#00E5FF] rounded-lg shadow-neon-cyan"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {label}
        </span>
      </button>
    );
  };

  return (
    <main className="min-h-screen w-screen bg-[#050816] text-slate-100 font-sans overflow-hidden relative lg:cursor-none">
      
      {/* CUSTOM MORION AI GLOW CURSOR */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#00E5FF] pointer-events-none z-50 mix-blend-screen shadow-neon-cyan hidden lg:block"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.5 : 1
        }}
        transition={{ type: "spring", stiffness: 700, damping: 28, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#00E5FF] pointer-events-none z-50 shadow-neon-cyan hidden lg:block"
        animate={{ x: cursorPos.x - 4, y: cursorPos.y - 4 }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />

      {/* BACKGROUND GRID & GLOW */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b2e_1px,transparent_1px),linear-gradient(to_bottom,#161b2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* CONTAINER */}
      <div className="flex flex-col h-screen w-full max-w-[1800px] mx-auto p-4 md:p-6 relative z-10">
        
        {/* HEADER */}
        <header className="flex items-center justify-between backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-3 mb-4 shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] flex items-center justify-center shadow-neon-cyan"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-5 h-5 text-black" />
            </motion.div>
            <div>
              <h1 className="font-bold text-sm tracking-wider text-white flex items-center gap-2">
                LilyAI <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">Cyber Guardian</span>
              </h1>
              <p className="text-xs text-slate-400">AI Threat Intelligence Core</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            <NavButton id="chat" label="AI Analyst" icon={Cpu} />
            <NavButton id="scanner" label="Toolbox" icon={ShieldAlert} />
          </nav>

          <div className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-2 ${
            threatLevel === 'CRITICAL' ? 'bg-red-950/50 border-red-800 text-red-300' : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${threatLevel === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            RISK: {threatLevel}
          </div>
        </header>

        {/* MAIN BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
          
          {/* SIDEBAR TOOLS */}
          <aside className={`lg:col-span-3 flex-col gap-4 overflow-y-auto pr-1 ${activeTab === 'scanner' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* AVATAR CARD */}
            <div className="backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-[#00E5FF]/30 p-1.5 shadow-neon-cyan/20 relative">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl relative overflow-hidden">
                    <span className="relative z-10">👩‍💻</span>
                    <div className="absolute inset-0 bg-[#00E5FF]/10 animate-pulse" />
                  </div>
                </div>
              </div>

              <h2 className="font-bold text-base text-white flex items-center gap-1.5">
                LILY <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              </h2>
              <p className="text-xs text-slate-400 mb-3">Virtual Security Mentor</p>
              
              <div className="w-full bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Defense State:</span>
                  <span className="text-emerald-400 font-mono">Active</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Neural Engine:</span>
                  <span className="text-[#00E5FF] font-mono">Gemini Flash</span>
                </div>
              </div>
            </div>

            {/* PASSWORD AUDITOR TOOL */}
            <div className="backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shrink-0">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300">
                <Key className="w-4 h-4 text-[#00E5FF]" />
                Password Auditor
              </div>
              <input
                type="password"
                placeholder="Test password strength..."
                value={password}
                onChange={(e) => evalPassword(e.target.value)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00E5FF] transition-colors mb-2"
              />
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    passStrength < 50 ? 'bg-red-500' : passStrength < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  animate={{ width: `${passStrength}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Entropy</span>
                <span>{passStrength}%</span>
              </div>
            </div>

            {/* URL INSPECTOR TOOL */}
            <div className="backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shrink-0">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300">
                <Globe className="w-4 h-4 text-[#7C3AED]" />
                URL Safety Inspector
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste URL (e.g. login-bank.xyz)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C3AED]"
                />
                <button
                  onClick={() => {
                    if (!urlInput.trim()) return;
                    setUrlStatus('scanning');
                    setTimeout(() => setUrlStatus(urlInput.includes('.xyz') ? 'danger' : 'safe'), 1500);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white p-2 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              {urlStatus !== 'idle' && (
                <div className="mt-3 text-xs">
                  {urlStatus === 'scanning' && <span className="text-amber-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Scanning domain registry...</span>}
                  {urlStatus === 'safe' && <span className="text-emerald-400 font-semibold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Domain Verified Safe</span>}
                  {urlStatus === 'danger' && <span className="text-red-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Phishing Domain Detected!</span>}
                </div>
              )}
            </div>

          </aside>

          {/* CHAT INTERFACE */}
          <section className={`lg:col-span-9 flex-col backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden relative ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user' ? 'bg-[#7C3AED] text-white' : 'bg-[#00E5FF] text-black shadow-neon-cyan'
                      }`}>
                        {msg.sender === 'user' ? 'YOU' : 'AI'}
                      </div>

                      <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED]/40 text-slate-100 rounded-tr-none' 
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>

                        {/* THREAT ANALYSIS CARD */}
                        {msg.riskScore !== null && (
                          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs space-y-2">
                            <div className="flex justify-between items-center font-semibold border-b border-red-500/20 pb-2">
                              <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-red-400" /> Threat Intelligence Analysis</span>
                              <span className="bg-red-500 text-black px-2 py-0.5 rounded font-mono font-bold">RISK: {msg.riskScore}%</span>
                            </div>
                            <div className="space-y-1 pt-1">
                              {msg.highlights.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-1.5">
                                  <span className="text-red-400 font-bold">•</span>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <span className="block text-[10px] text-slate-500 mt-2 text-right">{msg.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00E5FF] text-black font-bold flex items-center justify-center text-xs shadow-neon-cyan">AI</div>
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="text-xs text-[#00E5FF] font-mono">Analyzing network vectors</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT PANEL */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  placeholder="Paste an email, suspicious link, or ask Lily a security question..."
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-all placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:opacity-90 text-black font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-neon-cyan shrink-0"
                >
                  <Send className="w-4 h-4 fill-black" />
                  <span className="hidden md:inline">Analyze</span>
                </button>
              </form>

              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {[
                  "I got an email saying my bank account is blocked",
                  "How do hackers steal passwords?",
                  "Scan this link: bank-login-security.xyz"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-[#00E5FF] border border-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
