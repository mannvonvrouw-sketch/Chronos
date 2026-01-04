
import React from 'react';
import { Message } from '../types';
import { APP_ICONS } from '../constants';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Custom parsing for Expansion Seeds to make them stand out
  const renderContent = (content: string) => {
    const parts = content.split('🏛️ Timeline Expansion Seeds');
    if (parts.length > 1) {
      return (
        <>
          <div className="prose prose-invert max-w-none mb-6">
            {parts[0].split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <h3 className="flex items-center gap-2 text-amber-400 font-bold mb-3 serif">
              <APP_ICONS.Sparkles className="w-5 h-5" />
              Timeline Expansion Seeds
            </h3>
            <div className="text-amber-100/90 italic space-y-2">
              {parts[1].trim().split('\n').map((line, i) => (
                <p key={i} className="pl-4 border-l border-amber-500/50">{line.replace(/^[-*•]\s*/, '')}</p>
              ))}
            </div>
          </div>
        </>
      );
    }
    
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2 leading-relaxed">{line}</p>
    ));
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600' : 'bg-slate-700'} mt-1`}>
          {isUser ? (
            <span className="text-xs font-bold">ME</span>
          ) : (
            <APP_ICONS.History className="w-5 h-5 text-slate-300" />
          )}
        </div>
        
        <div className={`relative px-4 py-3 rounded-2xl shadow-lg ${
          isUser 
            ? 'bg-indigo-700 text-indigo-50 rounded-tr-none' 
            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
        }`}>
          {message.isWip && isUser && (
            <div className="absolute -top-2 -left-2 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              WIP Scenario
            </div>
          )}
          <div className="text-sm md:text-base">
            {renderContent(message.content)}
          </div>
          <div className={`text-[10px] mt-2 opacity-40 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
