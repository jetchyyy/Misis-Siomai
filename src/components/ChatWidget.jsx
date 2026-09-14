import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, X, Phone, MapPin, Mail, Share2, Clock, Store, ChevronRight, RotateCcw } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const QUICK_OPTIONS = [
  { id: 'contact_numbers', label: 'Contact Numbers', icon: Phone },
  { id: 'locations',       label: 'Our Locations',   icon: MapPin },
  { id: 'how_to_contact',  label: 'How to Reach Us', icon: Mail },
  { id: 'business_hours',  label: 'Business Hours',  icon: Clock },
  { id: 'facebook',       label: 'Facebook Page',   icon: Share2 },
  { id: 'franchise',       label: 'Franchise Info',  icon: Store },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { cms } = useCMS();
  const { contact, about } = cms;
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Build initial greeting message when opened
  const initialMessage = {
    role: 'bot',
    text: `Hi there! Welcome to Misis Siomai Cebu. What would you like to know?`,
    options: QUICK_OPTIONS,
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getBotAnswer = (optionId) => {
    switch (optionId) {
      case 'contact_numbers':
        return {
          text: `Contact Numbers\n${(contact.phones || []).map(p => `• ${p}`).join('\n')}`,          options: null,
        };
      case 'locations':
        return {
          text: `Our main office is located at:\n${contact.address || 'Ramona Village, San Isidro, Talisay City, Cebu'}\n\nWe also have branches across Cebu and nearby provinces. Check our Branches section for the full list!`,
          options: null,
        };
      case 'how_to_contact':
        return {
          text: `You can reach us through any of these channels:\n\nEmail:\n${(contact.emails || []).map(e => `• ${e}`).join('\n')}\n\nPhone:\n${(contact.phones || []).map(p => `• ${p}`).join('\n')}\n\nFacebook:\n• ${contact.facebook || 'Misis Siomai Cebu'}`,
          options: null,
        };
      case 'business_hours':
        return {
          text: `Business Hours:\n${contact.operating_hours || 'Monday - Saturday: 8:00 AM - 6:00 PM'}\n\nFor urgent concerns, you may also reach us through Facebook Messenger.`,
          options: null,
        };
      case 'facebook':
        return {
          text: `Follow and message us on Facebook!\n\n${contact.facebook || 'Misis Siomai Cebu'}\n\nTap the button below to visit our page.`,
          link: { label: 'Visit Facebook Page', url: contact.facebook_url || 'https://facebook.com/MisisSiomaiCebu' },
          options: null,
        };
      case 'franchise':
        return {
          text: `Interested in franchising ${about.brand_name || 'Misis Siomai Cebu'}?\n\nWe offer food cart packages starting at affordable rates with:\n• Zero royalty fees\n• Low capital investment\n• Fast ROI (3-6 months)\n• Full training & support\n\nHead to our Packages section or contact us directly to learn more!`,
          options: null,
        };
      default:
        return { text: "I'm not sure about that. Please contact us directly!", options: null };
    }
  };

  const handleOptionClick = (option) => {
    // Append user "message" (the clicked option label)
    const userMsg = { role: 'user', text: option.label };

    // Build bot answer
    const answer = getBotAnswer(option.id);
    const botMsg = {
      role: 'bot',
      text: answer.text,
      link: answer.link || null,
      options: null,
    };

    // After answering, offer to ask another question
    const followUp = {
      role: 'bot',
      text: 'Is there anything else I can help you with?',
      options: QUICK_OPTIONS,
    };

    setMessages(prev => [...prev, userMsg, botMsg, followUp]);
  };

  const handleReset = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[40] w-14 h-14 bg-[#18572c] hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:shadow-emerald-600/50 hover:-translate-y-1'}`}
        aria-label="Ask a Question"
      >
        <MessageCircleQuestion className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-4 bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Ask a Question
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[50] w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#18572c] to-emerald-600 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 border border-white/20 p-1.5 rounded-full">
                  <img src="/mississiomai.png" alt="Bot Avatar" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Misis Siomai Bot</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Restart chat"
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                  {/* Bubble */}
                  <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#18572c] text-white rounded-tr-sm shadow-sm'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* External link button */}
                  {msg.link && (
                    <a
                      href={msg.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {msg.link.label}
                    </a>
                  )}

                  {/* Quick-reply option buttons */}
                  {msg.options && (
                    <div className="flex flex-col gap-2 w-full mt-1">
                      {msg.options.map((opt) => {
                        const IconComp = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className="flex items-center gap-3 text-left text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:border-[#18572c] hover:text-[#18572c] hover:bg-emerald-50 rounded-xl px-4 py-2.5 transition-all shadow-sm group cursor-pointer"
                          >
                            <IconComp className="w-4 h-4 text-[#18572c] shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="flex-1">{opt.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 bg-white border-t border-zinc-100 shrink-0 text-center">
              <p className="text-[10px] text-zinc-400 font-medium">Select an option above to get started</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
