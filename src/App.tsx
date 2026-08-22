"use client";

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { Mic, MicOff, Send, Zap, Search, Wrench, MessageSquare, Settings, Activity, Radio, Cpu, Layers, Music, Volume2, ChevronRight, Play, Square, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { EXPERTISE_AREAS, INTERACTION_MODES } from './data';

const Visualizer = ({ isActive }: { isActive: boolean }) => {
  const bars = Array.from({ length: 40 });
  return (
    <div className="visualizer">
      {bars.map((_, i) => (
        <motion.div key={i} className="visualizer-bar" animate={{ height: isActive ? [10, 20 + ((i * 17) % 40), 10] : 4 }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }} />
      ))}
    </div>
  );
};

type InitialMessage = {
  id: string;
  role: 'assistant';
  content: string;
  parts?: never;
};

function getMessageText(message: UIMessage | InitialMessage) {
  if ('content' in message && typeof message.content === 'string') return message.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');
  }
  return '';
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState('immediate');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isStreaming = status === 'submitted' || status === 'streaming';

  const initialMessage: InitialMessage = {
    id: 'coach-init',
    role: 'assistant',
    content: "Hello. Ableton Live 12 Coach is online. Ask me about arrangement, mixing, Max for Live, Push, routing, or performance setup.",
  };
  const visibleMessages: Array<UIMessage | InitialMessage> = messages.length
    ? messages
    : [initialMessage];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = (text || inputValue).trim();
    if (!msg || isStreaming) return;
    sendMessage({ text: `[mode:${selectedMode}] ${msg}` });
    setInputValue('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left"><Activity size={18} className="icon-accent" /><span className="brand-text">Ableton Live 12 <span className="text-muted">| AI Coach Suite</span></span></div>
        <div className="header-status">
          <div className="status-item"><span className="status-indicator status-active"></span><span className="label">STREAM {isStreaming ? 'ACTIVE' : 'READY'}</span></div>
          <div className="status-item"><span className={`status-indicator ${isVoiceActive ? 'status-recording' : ''}`}></span><span className="label">VOICE ACTIVE</span></div>
        </div>
        <div className="header-right"><Command size={16} /><Settings size={18} /></div>
      </header>

      <main className="main-content">
        <aside className="sidebar-left">
          <div className="sidebar-header"><Cpu size={16} /><h3>CORE EXPERTISE</h3></div>
          <div className="expertise-list">
            {EXPERTISE_AREAS.map(area => (
              <motion.div key={area.id} className="expertise-item" whileHover={{ x: 5, backgroundColor: 'var(--bg-active)' }} onClick={() => handleSend(`Help me with ${area.title}: ${area.description}`)}>
                <div className="expertise-icon"><Music size={14} /></div>
                <div className="expertise-info"><span className="area-title">{area.title}</span><span className="area-desc">{area.description}</span></div>
                <ChevronRight size={14} className="chevron" />
              </motion.div>
            ))}
          </div>
        </aside>

        <section className="interaction-hub">
          <div className="chat-viewport">
            {visibleMessages.map((msg, i) => (
              <motion.div key={msg.id ?? i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`message ${msg.role === 'assistant' ? 'assistant' : 'user'}`}>
                <div className="message-content">{getMessageText(msg)}</div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="interaction-controls">
            <div className="visualizer-container"><Visualizer isActive={isVoiceActive || isStreaming} /></div>
            <div className="input-area">
              <button className={`voice-toggle ${isVoiceActive ? 'active' : ''}`} onClick={() => setIsVoiceActive(!isVoiceActive)}>{isVoiceActive ? <Mic size={20} /> : <MicOff size={20} />}</button>
              <input type="text" placeholder="Ask your coach anything about Live 12..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <button className="send-btn" onClick={() => handleSend()} disabled={isStreaming}><Send size={18} /></button>
            </div>
          </div>
        </section>

        <aside className="sidebar-right">
          <div className="section-group">
            <div className="sidebar-header"><Layers size={16} /><h3>MODES</h3></div>
            <div className="modes-grid">
              {INTERACTION_MODES.map(mode => (
                <button key={mode.id} className={`mode-btn ${selectedMode === mode.id ? 'selected' : ''}`} onClick={() => setSelectedMode(mode.id)}>
                  {mode.id === 'immediate' && <Zap size={14} />}{mode.id === 'deep-dive' && <Search size={14} />}{mode.id === 'workshop' && <Wrench size={14} />}{mode.id === 'critique' && <MessageSquare size={14} />}<span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-group">
            <div className="sidebar-header"><Volume2 size={16} /><h3>AUDIO ENGINE</h3></div>
            <div className="audio-params">
              <div className="param-item"><span className="param-label">Sample Rate</span><span className="param-value">48000 Hz</span></div>
              <div className="param-item"><span className="param-label">Buffer Size</span><span className="param-value">128 samples</span></div>
              <div className="param-item"><span className="param-label">Latency</span><span className="param-value">3.2 ms</span></div>
            </div>
          </div>

          <div className="playback-controls"><button className="playback-btn" onClick={() => handleSend('How should I prepare playback for this session?')}><Play size={18} /></button><button className="playback-btn" onClick={() => handleSend('How should I safely stop and review this session?')}><Square size={18} /></button></div>
        </aside>
      </main>

      <footer className="app-footer">
        <div className="footer-status"><Radio size={12} /><span>Vercel AI Gateway Coach Connected</span></div>
        <div className="cpu-usage"><span>CPU</span><div className="meter"><div className="meter-fill" style={{ width: isStreaming ? '38%' : '12%' }}></div></div></div>
      </footer>
    </div>
  );
}

export default App;
