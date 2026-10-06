import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CircleCheckIcon, DownloadIcon, FileTextIcon, PlusIcon, ShieldCheckIcon, SparkleIcon } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import { Modal } from '../../components/app/Modal';
import { Pill } from '../../components/app/Pill';
import { EmptyState } from '../../components/app/EmptyState';
import '../employee/tasks.css';
import '../employee/community.css';
import './insights.css';

const TABS = [
{ id: 'generated', label: 'Generados' },
{ id: 'archived', label: 'Archivados' }];


// Descarga el reporte como archivo de texto
function downloadReport(report) {
  const content = [report.title, report.time, '', ...report.highlights.map((h) => `• ${h}`)].join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.title}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

// Arma un reporte con una "foto" de cómo está el equipo en este momento
function buildReport({ members, projects, alerts, balanced, capacity }) {
  const highlights = [
  `${members.length} ${members.length === 1 ? 'integrante' : 'integrantes'} y ${projects.length} ${projects.length === 1 ? 'proyecto' : 'proyectos'}.`,
  `Capacidad usada: ${capacity.percent}% (${capacity.assigned}h de ${capacity.total}h).`,
  `${balanced} de ${members.length} personas con carga equilibrada.`,
  alerts.length ?
  `Con carga alta: ${alerts.map((m) => `${m.name} (${m.load}%)`).join(', ')}.` :
  'Nadie supera el 75% de su capacidad.',
  ...members.map((m) => `${m.name} · ${m.role}: ${m.hours}h asignadas (${m.load}%).`)];

  const now = new Date();
  return {
    id: `rp${now.getTime()}`,
    title: `Estado del equipo · ${format(now, "d 'de' MMMM", { locale: es })}`,
    time: format(now, "d MMM yyyy · HH:mm", { locale: es }),
    state: 'generated',
    highlights
  };
}

export function Reports() {
  const team = useTeam();
  const [reports, setReports] = useState([]);
  const [tab, setTab] = useState('generated');
  const [openId, setOpenId] = useState(null);
  const [notice, setNotice] = useState('');

  const count = (state) => reports.filter((r) => r.state === state).length;
  const open = reports.find((r) => r.id === openId);
  const visible = reports.filter((r) => r.state === tab);
  const canGenerate = team.members.length > 0;

  const generate = () => {
    const report = buildReport(team);
    setReports([report, ...reports]);
    setTab('generated');
    setNotice(`Generaste “${report.title}”.`);
  };

  const setState = (id, state, message) => {
    setReports(reports.map((r) => r.id === id ? { ...r, state } : r));
    setNotice(message);
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Guardá una foto de la carga del equipo para compartirla o compararla después.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--accent" onClick={generate} disabled={!canGenerate}>
            <PlusIcon size={16} aria-hidden="true" />
            Generar reporte
          </button>
        </div>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <div className="line-tabs" role="tablist" aria-label="Tipo de reporte">
        {TABS.map((t) =>
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={tab === t.id}
          className={tab === t.id ? 'line-tabs__tab line-tabs__tab--active' : 'line-tabs__tab'}
          onClick={() => setTab(t.id)}>
          
            {t.label}
            <span className="line-tabs__count">{count(t.id)}</span>
          </button>
        )}
      </div>

      <div className="insight-grid">
        <section aria-labelledby="reports-list-title">
          <div className="insight-list-head">
            <h2 id="reports-list-title" className="card__title">
              Reportes {TABS.find((t) => t.id === tab).label.toLowerCase()}
            </h2>
            {visible.length > 0 && <span className="insight-list-head__sort">Más reciente primero</span>}
          </div>

          <div className="insight-list">
            {visible.map((r) =>
            <article key={r.id} className="insight-card">
                <div className="insight-card__head">
                  <SparkleIcon size={14} className="icon-report" aria-hidden="true" />
                  <h3 className="insight-card__title">{r.title}</h3>
                  <Pill tone={r.state === 'archived' ? 'neutral' : 'amber'}>
                    {r.state === 'archived' ? 'Archivado' : 'Listo'}
                  </Pill>
                </div>
                <p className="insight-card__text">{r.highlights[0]}</p>
                <div className="insight-card__meta">{r.time}</div>
                <div className="insight-card__actions">
                  <button type="button" className="btn btn--dark btn--sm" onClick={() => setOpenId(r.id)}>
                    Ver reporte
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => downloadReport(r)}>
                    <DownloadIcon size={14} aria-hidden="true" />
                    Descargar
                  </button>
                  {r.state === 'generated' ?
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setState(r.id, 'archived', `Archivaste “${r.title}”.`)}>
                  
                      Archivar
                    </button> :

                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setState(r.id, 'generated', `Restauraste “${r.title}”.`)}>
                  
                      Restaurar
                    </button>
                }
                </div>
              </article>
            )}
            {visible.length === 0 &&
            <EmptyState
              compact
              icon={FileTextIcon}
              title={tab === 'generated' ? 'Todavía no generaste reportes' : 'No hay reportes archivados'}
              text={
              tab === 'generated' ?
              canGenerate ?
              'Tocá “Generar reporte” para guardar cómo está el equipo hoy.' :
              'Primero agregá integrantes desde el Dashboard del equipo.' :
              undefined
              } />

            }
          </div>

          <p className="insight-privacy">
            <ShieldCheckIcon size={14} aria-hidden="true" />
            Los reportes solo los ven los líderes del equipo.
          </p>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="side-hero">
            <p className="side-hero__label">Capacidad del equipo</p>
            <p className="side-hero__value">{team.members.length ? `${team.capacity.percent}%` : '—'}</p>
            <p className="side-hero__text">
              {team.members.length ?
              `${team.capacity.assigned}h asignadas de ${team.capacity.total}h disponibles esta semana.` :
              'Sin integrantes todavía.'}
            </p>
          </div>
        </aside>
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpenId(null)} labelledBy="report-title" wide>
        {open &&
        <>
            <h2 id="report-title" className="modal-title">
              {open.title}
            </h2>
            <p className="modal-text">{open.time}</p>
            <ul className="report-highlights">
              {open.highlights.map((h) =>
            <li key={h}>{h}</li>
            )}
            </ul>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => downloadReport(open)}>
                Descargar
              </button>
              <button type="button" className="btn btn--dark" onClick={() => setOpenId(null)}>
                Cerrar
              </button>
            </div>
          </>
        }
      </Modal>
    </>);

}