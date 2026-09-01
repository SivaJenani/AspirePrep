import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, Bot, User as UserIcon, RotateCcw } from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
export const AiTutorPage = () => {
    const { user } = useAppStore();
    const [messages, setMessages] = useState([
        {
            id: 'init_1',
            sender: 'ai',
            text: `Hello ${user?.name || 'Aspirant'}! I am your AI Competitive Exam Master Tutor. 

I can explain complex concepts from first principles, break down tricky Quantitative formulas, teach 10-second mental math tricks, or clarify doubts from Reasoning, English, and General Awareness.

How can I assist your exam preparation today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputQuery, setInputQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);
    const handleSendMessage = async (textToSend) => {
        const query = textToSend || inputQuery;
        if (!query.trim() || isTyping)
            return;
        const userMsg = {
            id: `u_${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setInputQuery('');
        setIsTyping(true);
        try {
            const res = await api.post('/ai/chat', {
                query,
                examContext: user?.targetExamName || 'SSC CGL'
            });
            const aiMsg = {
                id: `ai_${Date.now()}`,
                sender: 'ai',
                text: res.data?.response || 'I have analyzed your query. Let me know if you need more solved examples or formula derivations.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }
        catch (err) {
            console.error('AI chat failed:', err);
            const errMsg = {
                id: `err_${Date.now()}`,
                sender: 'ai',
                text: 'Sorry, I encountered a temporary connection glitch. Please try asking your question again.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errMsg]);
        }
        finally {
            setIsTyping(false);
        }
    };
    const presetChips = [
        'How do I solve Syllogisms without drawing Venn diagrams?',
        'Teach me 10-second Profit & Loss shortcut formulas',
        'Explain the Writ Jurisdiction under Article 32 vs 226',
        'Strategy to score 45+ in English Reading Comprehension'
    ];
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsx("div", { className: "bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md", children: _jsx(Brain, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "AI Doubt Solver & Tutor" }), _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300", children: "Gemini Flash 2.5 Active" })] }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Target: ", user?.targetExamName || 'SSC CGL Tier 1 & 2', " \u2022 Concept Mastery & Step Solutions"] })] })] }), _jsxs("button", { onClick: () => setMessages(messages.slice(0, 1)), className: "text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), " Reset Chat"] })] }) }), _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6", children: _jsxs("div", { className: "bg-white border border-slate-200/80 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800 h-[68vh] flex flex-col justify-between overflow-hidden", children: [_jsxs("div", { className: "flex-1 p-6 overflow-y-auto space-y-4", children: [messages.map((msg) => (_jsxs("div", { className: `flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${msg.sender === 'user'
                                                ? 'bg-indigo-600 text-white font-bold'
                                                : 'bg-purple-600 text-white'}`, children: msg.sender === 'user' ? _jsx(UserIcon, { className: "w-4 h-4" }) : _jsx(Bot, { className: "w-4 h-4" }) }), _jsxs("div", { className: `p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${msg.sender === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700 whitespace-pre-line'}`, children: [_jsx("p", { children: msg.text }), _jsx("span", { className: `block text-[10px] text-right font-mono ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`, children: msg.timestamp })] })] }, msg.id))), isTyping && (_jsxs("div", { className: "flex gap-3 mr-auto max-w-[85%]", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs shrink-0", children: _jsx(Bot, { className: "w-4 h-4" }) }), _jsxs("div", { className: "p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs rounded-tl-none border border-slate-200/60 dark:border-slate-700 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-purple-600 animate-spin" }), _jsx("span", { className: "text-slate-500", children: "AI Tutor is generating formula breakdown..." })] })] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "px-6 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar", children: presetChips.map((chip, cIdx) => (_jsxs("button", { onClick: () => handleSendMessage(chip), className: "px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 text-xs hover:border-indigo-500 whitespace-nowrap transition", children: ["\uD83D\uDCA1 ", chip] }, cIdx))) }), _jsx("div", { className: "p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800", children: _jsxs("form", { onSubmit: (e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }, className: "flex gap-3", children: [_jsx("input", { type: "text", placeholder: "Ask any concept doubt, formula derivation, or strategy question...", value: inputQuery, onChange: (e) => setInputQuery(e.target.value), className: "flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" }), _jsxs("button", { type: "submit", disabled: !inputQuery.trim() || isTyping, className: "px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5 shrink-0", children: [_jsx("span", { children: "Send" }), _jsx(Send, { className: "w-4 h-4" })] })] }) })] }) })] }));
};
