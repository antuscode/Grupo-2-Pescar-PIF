import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusIcon, SearchIcon, SendIcon, SparkleIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { Pill } from '../../components/app/Pill';
import { useLumiChat } from '../../hooks/useLumiChat';
import { lumiProfile } from '../../utils/lumiProfiles';
import { weeklyLoad } from '../../utils/tasks';
import { useTeam } from '../../contexts/TeamContext';
import '../employee/tasks.css';
import './lumi.css';

const GROUPS = ['Hoy', 'Ayer', 'Esta semana'];

// variant: 'employee' | 'manager'
export function Lumi({ variant = 'employee' }) {
  const { user, tasks } = useAppData();
  const team = useTeam();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = lumiProfile(variant);
  const firstName = user.firstName;

  // Datos actuales que Lumi usa para responder
  const ctx = {
    tasks,
    load: weeklyLoad(tasks),
    teammates: team.members.map((m) => m.name),
    members: team.members,
    projects: team.projects,
    alerts: team.alerts,
    balanced: team.balanced
  };
  const { conversations, active, activeId, setActiveId, typing, send, newConversation } = useLumiChat(profile, ctx);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const bodyRef = useRef(null);

  // Si se llegó desde el botón flotante con una pregunta, se envía sola
  useEffect(() => {
    const prompt = location.state?.prompt;
    if (!prompt) return;
    navigate(location.pathname, { replace: true, state: null });
    const id = newConversation();
    send(prompt, id);
  }, []);

  // Baja hasta el último mensaje
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, typing]);

  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e) => {
    e.preventDefault();
    send(draft);
    setDraft('');
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Lumi</h1>
          <p className="page-subtitle">
            {profile.subtitle} · {conversations.length} conversaciones guardadas
          </p>
        </div>
      </header>

      <div className="lumi-layout">
        <aside className="card lumi-sidebar" aria-label="Conversaciones">
          <h2 className="card__title">Conversaciones</h2>
          <button type="button" className="btn btn--dark btn--block" onClick={() => newConversation()}>
            <PlusIcon size={14} aria-hidden="true" />
            Nueva conversación
          </button>
          <label className="search" style={{ flex: 'none' }}>
            <SearchIcon size={14} aria-hidden="true" />
            <input
              className="input"
              type="search"
              placeholder="Buscar conversación..."
              aria-label="Buscar conversación"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            
          </label>
          <div className="conv-list">
            {GROUPS.map((group) => {
              const items = filtered.filter((c) => c.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <p className="conv-group">{group}</p>
                  {items.map((c) =>
                  <button
                    key={c.id}
                    type="button"
                    className={c.id === activeId ? 'conv conv--active' : 'conv'}
                    aria-current={c.id === activeId ? 'true' : undefined}
                    onClick={() => setActiveId(c.id)}>
                    
                      <span className="conv__top">
                        {c.title}
                        <span className="conv__time">{c.time}</span>
                      </span>
                      <span className="conv__preview" style={{ display: 'block' }}>
                        {c.preview}
                      </span>
                    </button>
                  )}
                </div>);

            })}
            {filtered.length === 0 && <p className="conv-empty">No hay conversaciones con ese nombre.</p>}
          </div>
        </aside>

        <section className="card chat" aria-label={`Conversación: ${active?.title}`}>
          <div className="chat__head">
            <span className="lumi-avatar" aria-hidden="true" />
            <div>
              <p className="chat__name">Lumi</p>
              <p className="chat__status">En línea</p>
            </div>
            <SparkleIcon size={20} style={{ marginLeft: 'auto', color: 'var(--accent)' }} aria-hidden="true" />
          </div>

          <div className="chat__body" ref={bodyRef} aria-live="polite">
            {active?.messages.length === 0 &&
            <div className="chat-empty">
                <p className="chat-empty__title">Hola, {firstName}</p>
                {profile.emptyText}
              </div>
            }
            {active?.messages.map((m) =>
            m.from === 'user' ?
            <div key={m.id} className="msg-user">
                  <p className="msg-user__bubble">{m.text}</p>
                  <p className="msg-time">{m.time}</p>
                </div> :

            <div key={m.id} className="msg-lumi">
                  <span className="lumi-avatar lumi-avatar--sm" aria-hidden="true" />
                  <div>
                    <div className="msg-lumi__bubble">
                      {m.text}
                      {m.list &&
                  <div className="msg-list">
                          {m.list.map((row) =>
                    <div key={row.label} className="msg-list__row">
                              <strong>{row.label}</strong>
                              <span className="msg-list__meta">{row.meta}</span>
                            </div>
                    )}
                        </div>
                  }
                      {m.pill &&
                  <div>
                          <Pill tone="green" dot>{m.pill}</Pill>
                        </div>
                  }
                    </div>
                    <p className="msg-time">Lumi · {m.time}</p>
                  </div>
                </div>

            )}
            {typing &&
            <div className="msg-lumi">
                <span className="lumi-avatar lumi-avatar--sm" aria-hidden="true" />
                <div className="msg-lumi__bubble typing" aria-label="Lumi está escribiendo">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            }
          </div>

          <div className="chat__foot">
            <div className="chips">
              {profile.quickPrompts.map((p) =>
              <button key={p.id} type="button" className="chip" onClick={() => send(p.prompt)}>
                  <SparkleIcon size={12} aria-hidden="true" />
                  {p.label}
                </button>
              )}
            </div>
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                placeholder="Escribile a Lumi..."
                aria-label="Mensaje para Lumi"
                value={draft}
                onChange={(e) => setDraft(e.target.value)} />
              
              <button type="submit" className="btn btn--dark btn--icon btn--sm" aria-label="Enviar" style={{ width: 32 }}>
                <SendIcon size={14} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </>);

}