
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatState } from './types';
import { geminiService } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { APP_ICONS } from './constants';

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || chatState.isLoading) return;

    const userContent = inputValue.trim();
    const isWip = userContent.toLowerCase().includes('wip');
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
      isWip: isWip,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      isLoading: true,
      error: null,
    }));
    setInputValue('');

    try {
      const response = await geminiService.sendMessage(chatState.messages, userContent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'I apologize, but I was unable to generate a response.',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'The timeline collapsed. (Failed to connect to Chronos service)',
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <APP_ICONS.History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold serif tracking-tight">Chronos</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Alternate History Lab</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Timeline Stable
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {chatState.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                <APP_ICONS.Sparkles className="w-10 h-10 text-indigo-400 opacity-60" />
              </div>
              <div className="max-w-md">
                <h2 className="text-2xl font-bold serif mb-3">Begin Divergence</h2>
                <p className="text-slate-400 leading-relaxed">
                  Provide a point of divergence in history. Use <span className="text-amber-400 font-mono font-bold px-1.5 py-0.5 bg-amber-400/10 rounded">"wip"</span> in your message if you want ideas to expand your timeline.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {[
                  "What if the Library of Alexandria never burned? wip",
                  "What if the Central Powers won WWI?",
                  "What if Rome industrialised early? wip",
                  "What if the Space Race never ended?"
                ].map((hint, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(hint)}
                    className="text-left p-3 text-sm bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-200"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatState.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          
          {chatState.isLoading && (
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="bg-slate-800/50 px-4 py-3 rounded-2xl italic text-slate-400 text-sm">
                Calculating butterfly effects...
              </div>
            </div>
          )}
          
          {chatState.error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center mb-6">
              {chatState.error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your alternate timeline... (add 'wip' for expansion ideas)"
              rows={1}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none min-h-[60px] max-h-48 custom-scrollbar shadow-inner"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 192)}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || chatState.isLoading}
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all duration-200 ${
                !inputValue.trim() || chatState.isLoading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
              }`}
            >
              <APP_ICONS.Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex justify-between items-center px-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
              Mention <span className="text-amber-500/80 font-bold italic">wip</span> anywhere to unlock expansion seeds
            </p>
            {inputValue.toLowerCase().includes('wip') && (
              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase animate-pulse">
                <APP_ICONS.Sparkles className="w-3 h-3" />
                Expansion Mode Enabled
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
