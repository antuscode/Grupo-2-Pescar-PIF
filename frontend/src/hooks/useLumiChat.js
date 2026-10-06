import { useRef, useState } from 'react';

const now = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const emptyConversation = () => ({
  id: `conv-${Date.now()}`,
  group: 'Hoy',
  title: 'Nueva conversación',
  preview: 'Sin mensajes todavía',
  time: now(),
  messages: []
});

// Busca una respuesta según las palabras del mensaje, usando los datos actuales (ctx)
function replyFor(text, profile, ctx) {
  const lower = text.toLowerCase();
  const match = profile.replies.find((r) => r.keywords.some((k) => lower.includes(k)));
  return match ? match.reply(ctx) : profile.fallback;
}

// profile: configuración de Lumi (ver utils/lumiProfiles.js)
// ctx: datos actuales de la app para que Lumi responda con información real
export function useLumiChat(profile, ctx) {
  const [conversations, setConversations] = useState(() => [emptyConversation()]);
  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [typing, setTyping] = useState(false);

  // Guarda siempre los datos más recientes para usarlos en la respuesta
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const active = conversations.find((c) => c.id === activeId);

  const addMessage = (conversationId, message, preview) => {
    setConversations((prev) =>
    prev.map((c) =>
    c.id === conversationId ?
    { ...c, messages: [...c.messages, message], preview: preview ?? c.preview, time: message.time } :
    c
    )
    );
  };

  const newConversation = () => {
    // Si la conversación activa está vacía, se reutiliza
    const current = conversations.find((c) => c.id === activeId);
    if (current && current.messages.length === 0) return current.id;
    const conversation = emptyConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    return conversation.id;
  };

  const send = (text, conversationId = activeId) => {
    const clean = text.trim();
    if (!clean) return;
    // Las conversaciones nuevas toman como título el primer mensaje
    setConversations((prev) =>
    prev.map((c) => c.id === conversationId && c.messages.length === 0 ? { ...c, title: clean.slice(0, 40) } : c)
    );
    addMessage(conversationId, { id: `u${Date.now()}`, from: 'user', text: clean, time: now() }, clean);
    setTyping(true);
    setTimeout(() => {
      const reply = replyFor(clean, profile, ctxRef.current);
      addMessage(conversationId, { id: `l${Date.now()}`, from: 'lumi', text: reply, time: now() }, reply);
      setTyping(false);
    }, 800);
  };

  return { conversations, active, activeId, setActiveId, typing, send, newConversation };
}