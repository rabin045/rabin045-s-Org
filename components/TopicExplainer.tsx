import React, { useState, useRef, useEffect } from 'react';
import { GradeLevel, ChatMessage } from '../types';
import { generateStreamResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const TopicExplainer: React.FC = () => {
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.Grade1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I can explain any school topic simply. What subject and topic are you looking at today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Add placeholder for streaming
    setMessages(prev => [...prev, { role: 'model', text: '' }]);
    
    try {
      const prompt = `Grade Level: ${grade}. Explain the following topic simply for a child and parent: "${userMsg}". Include examples.`;
      
      let accumulatedText = '';
      await generateStreamResponse(prompt, (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: accumulatedText };
          return newMsgs;
        });
      });
    } catch (error) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'model', text: "I'm sorry, I had trouble connecting. Please try again.", isError: true };
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-indigo-50 flex items-center justify-between">
        <h2 className="font-semibold text-indigo-900">Topic Explainer</h2>
        <select 
          value={grade}
          onChange={(e) => setGrade(e.target.value as GradeLevel)}
          className="text-sm border-slate-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {Object.values(GradeLevel).map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            } ${msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : ''}`}>
              <ReactMarkdown 
                className="prose prose-sm max-w-none prose-p:my-1 prose-headings:text-inherit prose-strong:text-inherit prose-ul:my-1 prose-li:my-0"
                components={{
                  code({node, className, children, ...props}) {
                    return <code className={`${className} bg-black/10 rounded px-1`} {...props}>{children}</code>
                  }
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about a ${grade} topic (e.g., Photosynthesis, Fractions)...`}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicExplainer;