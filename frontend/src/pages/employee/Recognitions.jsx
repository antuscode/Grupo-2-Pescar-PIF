import React, { useState } from 'react';
import { CircleCheckIcon, HeartIcon, LightbulbIcon, PlusIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { Modal } from '../../components/app/Modal';
import { Pill } from '../../components/app/Pill';
import { EmptyState } from '../../components/app/EmptyState';
import { useAppData } from '../../contexts/AppDataContext';
import { useTeam } from '../../contexts/TeamContext';
import { recognitionCategories } from '../../data/recognitions';
import './community.css';

// Ícono y color de cada categoría
const categoryStyle = {
  Colaboración: { tone: 'green', icon: UsersIcon },
  'Ayuda al equipo': { tone: 'amber', icon: HeartIcon },
  Creatividad: { tone: 'purple', icon: LightbulbIcon }
};

export function Recognitions() {
  const { user, recognitions, addRecognition } = useAppData();
  const { members } = useTeam();
  const teammates = members.map((m) => m.name).filter((name) => name !== user.name);

  const [tab, setTab] = useState('received');
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const [person, setPerson] = useState('');
  const [category, setCategory] = useState(recognitionCategories[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Todavía no hay otras personas que puedan enviarte reconocimientos
  const list = tab === 'received' ? [] : recognitions;

  const openModal = () => {
    setPerson(teammates[0] ?? '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError('');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Contale qué valorás de su trabajo.');
      return;
    }
    addRecognition({ id: `r${Date.now()}`, person, category, message: message.trim(), time: 'Recién' });
    setNotice(`Enviaste un reconocimiento a ${person}.`);
    setMessage('');
    setTab('sent');
    closeModal();
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Reconocimientos</h1>
          <p className="page-subtitle">Lo que tu equipo valora de vos</p>
        </div>
        <button type="button" className="btn btn--accent" onClick={openModal}>
          <PlusIcon size={16} aria-hidden="true" />
          Reconocer a alguien
        </button>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <section className="card">
        <div className="tabs" role="tablist" aria-label="Tipo de reconocimiento">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'received'}
            className={tab === 'received' ? 'tabs__tab tabs__tab--active' : 'tabs__tab'}
            onClick={() => setTab('received')}>
            
            Recibidos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sent'}
            className={tab === 'sent' ? 'tabs__tab tabs__tab--active' : 'tabs__tab'}
            onClick={() => setTab('sent')}>
            
            Enviados ({recognitions.length})
          </button>
        </div>

        {list.length === 0 ?
        <EmptyState
          compact
          icon={SparklesIcon}
          title={tab === 'received' ? 'Todavía no recibiste reconocimientos' : 'Todavía no enviaste reconocimientos'}
          text={
          tab === 'received' ?
          'Cuando alguien de tu equipo valore tu trabajo, lo vas a ver acá.' :
          'Un mensaje corto reconociendo a un compañero hace la diferencia.'
          } /> :


        <ul className="kudos-list" role="tabpanel">
            {list.map((item) => {
            const style = categoryStyle[item.category];
            const Icon = style.icon;
            return (
              <li key={item.id} className="kudos-item">
                  <span className={`kudos-item__icon kudos-item__icon--${style.tone}`} aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <div>
                    <Pill tone={style.tone}>{item.category}</Pill>
                    <p className="kudos-item__message">
                      <strong>Para {item.person}</strong> — {item.message}
                    </p>
                    <p className="kudos-item__time">{item.time}</p>
                  </div>
                </li>);

          })}
          </ul>
        }
      </section>

      <Modal open={modalOpen} onClose={closeModal} labelledBy="recognize-title">
        <h2 id="recognize-title" className="modal-title">
          Reconocer a alguien
        </h2>
        {teammates.length === 0 ?
        <>
            <p className="modal-text">
              Todavía no hay compañeros en tu equipo. Cuando tu líder los agregue, vas a poder reconocerlos desde acá.
            </p>
            <div className="modal__actions">
              <button type="button" className="btn btn--dark" onClick={closeModal}>
                Entendido
              </button>
            </div>
          </> :

        <>
            <p className="modal-text">Un mensaje corto y concreto vale mucho.</p>
            <form className="modal-form" onSubmit={handleSend} noValidate>
              <div>
                <label htmlFor="rec-person" className="form-label">
                  ¿A quién?
                </label>
                <select id="rec-person" className="select" value={person} onChange={(e) => setPerson(e.target.value)}>
                  {teammates.map((name) =>
                <option key={name}>{name}</option>
                )}
                </select>
              </div>
              <div>
                <label htmlFor="rec-category" className="form-label">
                  Categoría
                </label>
                <select id="rec-category" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {recognitionCategories.map((c) =>
                <option key={c}>{c}</option>
                )}
                </select>
              </div>
              <div>
                <label htmlFor="rec-message" className="form-label">
                  Mensaje
                </label>
                <textarea
                id="rec-message"
                className="textarea"
                placeholder="Gracias por..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'rec-error' : undefined} />
              
                {error &&
              <p id="rec-error" className="field__error">
                    {error}
                  </p>
              }
              </div>
              <div className="modal__actions" style={{ marginTop: 4 }}>
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--accent">
                  Enviar reconocimiento
                </button>
              </div>
            </form>
          </>
        }
      </Modal>
    </>);

}