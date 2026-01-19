import { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, Zap, Search, Wrench, MessageSquare, 
  Settings, Activity, Radio, Cpu, Layers, Music, Volume2, 
  ChevronRight, Play, Square, Command
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EXPERTISE_AREAS, INTERACTION_MODES, INITIAL_MESSAGES } from './data';
import './App.css';

const Visualizer = ({ isActive }: { isActive: boolean }) => {
  const bars = Array.from({ length: 40 });
  return (
    <div className="visualizer">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="visualizer-bar"
          animate={{
            height: isActive ? [10, Math.random() * 40 + 20, 10] : 4
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.02
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState('immediate');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || inputValue;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInputValue('');

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Got it. In ${selectedMode} mode, I recommend checking the ${EXPERTISE_AREAS[Math.floor(Math.random() * 10)].title} section for real-time optimization.` 
      }]);
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-left">
          <Activity size={18} className="icon-accent" />
          <span className="brand-text">Ableton Live 12 <span className="text-muted">| Coach Suite</span></span>
        </div>
        <div className="header-status">
          <div className="status-item">
            <span className="status-indicator status-active"></span>
            <span className="label">STREAM LIVE</span>
          </div>
          <div className="status-item">
            <span className={`status-indicator ${isVoiceActive ? 'status-recording' : ''}`}></span>
            <span className="label">VOICE ACTIVE</span>
          </div>
        </div>
        <div className="header-right">
          <Command size={16} />
          <Settings size={18} />
        </div>
      </header>

      <main className="main-content">
        {/* Left Sidebar - Expertise */}
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <Cpu size={16} />
            <h3>CORE EXPERTISE</h3>
          </div>
          <div className="expertise-list">
            {EXPERTISE_AREAS.map(area => (
              <motion.div 
                key={area.id} 
                className="expertise-item"
                whileHover={{ x: 5, backgroundColor: 'var(--bg-active)' }}
              >
                <div className="expertise-icon">
                  <Music size={14} />
                </div>
                <div className="expertise-info">
                  <span className="area-title">{area.title}</span>
                  <span className="area-desc">{area.description}</span>
                </div>
                <ChevronRight size={14} className="chevron" />
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Center - Chat Hub */}
        <section className="interaction-hub">
          <div className="chat-viewport">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${msg.role === 'assistant' ? 'assistant' : 'user'}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="interaction-controls">
            <div className="visualizer-container">
              <Visualizer isActive={isVoiceActive} />
            </div>
            
            <div className="input-area">
              <button 
                className={`voice-toggle ${isVoiceActive ? 'active' : ''}`}
                onClick={() => setIsVoiceActive(!isVoiceActive)}
              >
                {isVoiceActive ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              
              <input 
                type="text" 
                placeholder="Ask your coach anything about Live 12..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              
              <button className="send-btn" onClick={() => handleSend()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Modes & Settings */}
        <aside className="sidebar-right">
          <div className="section-group">
            <div className="sidebar-header">
              <Layers size={16} />
              <h3>MODES</h3>
            </div>
            <div className="modes-grid">
              {INTERACTION_MODES.map(mode => (
                <button 
                  key={mode.id}
                  className={`mode-btn ${selectedMode === mode.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  {mode.id === 'immediate' && <Zap size={14} />}
                  {mode.id === 'deep-dive' && <Search size={14} />}
                  {mode.id === 'workshop' && <Wrench size={14} />}
                  {mode.id === 'critique' && <MessageSquare size={14} />}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-group">
            <div className="sidebar-header">
              <Volume2 size={16} />
              <h3>AUDIO ENGINE</h3>
            </div>
            <div className="audio-params">
              <div className="param-item">
                <span className="param-label">Sample Rate</span>
                <span className="param-value">48000 Hz</span>
              </div>
              <div className="param-item">
                <span className="param-label">Buffer Size</span>
                <span className="param-value">128 samples</span>
              </div>
              <div className="param-item">
                <span className="param-label">Latency</span>
                <span className="param-value">3.2 ms</span>
              </div>
            </div>
          </div>

          <div className="playback-controls">
             <button className="playback-btn"><Play size={18} /></button>
             <button className="playback-btn"><Square size={18} /></button>
          </div>
        </aside>
      </main>

      <footer className="app-footer">
        <div className="footer-status">
          <Radio size={12} />
          <span>Gemini 2.5 Flash Native Audio Connected</span>
        </div>
        <div className="cpu-usage">
          <span>CPU</span>
          <div className="meter"><div className="meter-fill" style={{ width: '12%' }}></div></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
