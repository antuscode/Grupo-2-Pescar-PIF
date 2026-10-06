import React, { useState } from 'react';
import { CircleCheckIcon } from 'lucide-react';
import { Modal } from '../../components/app/Modal';
import { BackLink } from '../../components/auth/BackLink';
import { PaymentModal } from '../../components/manager/PaymentModal';
import { plans } from '../../data/billing';
import { useAppData } from '../../contexts/AppDataContext';
import { useTeam } from '../../contexts/TeamContext';
import '../employee/community.css';
import './billing.css';

export function Billing() {
  const { user } = useAppData();
  const { members } = useTeam();
  // Se cobra por cada integrante, con un mínimo de 1 (el líder)
  const billedMembers = Math.max(members.length, 1);
  const company = user.team;
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [card, setCard] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState(null); // { mode, plan }
  const [downgrade, setDowngrade] = useState(false);
  const [notice, setNotice] = useState('');

  const current = plans.find((p) => p.id === currentPlan);

  const choose = (plan) => {
    if (plan.custom) {
      setNotice('Recibimos tu consulta por el plan Empresa. Te escribimos en las próximas 24 horas.');
    } else if (plan.pricePerPerson === 0) {
      setDowngrade(true);
    } else {
      setPayment({ mode: 'pay', plan });
    }
  };

  const handleConfirm = (newCard) => {
    setCard(newCard);
    if (payment.mode === 'pay') {
      setCurrentPlan(payment.plan.id);
      setInvoices([{ id: `inv${Date.now()}`, month: 'Octubre 2026', status: 'Pagada' }, ...invoices]);
      setNotice(`¡Listo! Tu equipo ya tiene el plan ${payment.plan.name} con Lumi y alertas.`);
    } else {
      setNotice('Guardamos tu nueva tarjeta.');
    }
    setPayment(null);
  };

  const confirmDowngrade = () => {
    setCurrentPlan('starter');
    setDowngrade(false);
    setNotice('Volviste al plan Starter. Lumi y las alertas se desactivan al terminar el período.');
  };

  return (
    <>
      <BackLink to="/equipo/perfil">Perfil y configuración</BackLink>
      <header className="page-head" style={{ marginTop: 12 }}>
        <div>
          <h1 className="page-title">Suscripción y pago</h1>
          <p className="page-subtitle">
            {company} · plan activo: {current.name}
          </p>
        </div>
      </header>

      {notice &&
      <div className="banner" role="status">
          <CircleCheckIcon size={16} aria-hidden="true" />
          <span className="banner__text">{notice}</span>
        </div>
      }

      <div className="plans">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <section key={plan.id} className={isCurrent ? 'plan plan--current' : 'plan'} aria-label={`Plan ${plan.name}`}>
              <h2 className="plan__name">{plan.name}</h2>
              <p className="plan__price">
                {plan.price}
                {plan.unit && <span className="plan__unit">{plan.unit}</span>}
              </p>
              <p className="plan__detail">{plan.detail}</p>
              {isCurrent ?
              <button type="button" className="btn btn--accent btn--block" disabled aria-disabled="true" style={{ opacity: 1 }}>
                  Plan actual
                </button> :

              <button type="button" className="btn btn--ghost btn--block" onClick={() => choose(plan)}>
                  {plan.custom ? 'Contactar' : 'Elegir'}
                </button>
              }
            </section>);

        })}
      </div>

      <div className="billing-grid">
        <section className="card" aria-labelledby="method-title">
          <h2 id="method-title" className="card__title">
            Método de pago
          </h2>
          {card ?
          <div className="card-box">
              <span>•••• •••• •••• {card.last4}</span>
              <span className="card-box__exp">
                Vence
                <br />
                {card.exp}
              </span>
            </div> :

          <p className="card-box card-box--empty">Aún no cargaste una tarjeta</p>
          }
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setPayment({ mode: 'card', plan: null })}>
            {card ? 'Actualizar tarjeta' : 'Agregar tarjeta'}
          </button>
        </section>

        <section className="card" aria-labelledby="invoices-title">
          <h2 id="invoices-title" className="card__title">
            Facturas recientes
          </h2>
          {invoices.length === 0 ?
          <p className="invoice-empty">Todavía no hay facturas</p> :

          <ul className="invoice-list">
              {invoices.map((inv) =>
            <li key={inv.id} className="invoice">
                  {inv.month}
                  <span className="invoice__status">{inv.status}</span>
                </li>
            )}
            </ul>
          }
        </section>
      </div>

      <PaymentModal
        open={Boolean(payment)}
        mode={payment?.mode}
        plan={payment?.plan}
        members={billedMembers}
        defaultName={user.name}
        defaultEmail={user.email}
        onClose={() => setPayment(null)}
        onConfirm={handleConfirm} />
      

      <Modal open={downgrade} onClose={() => setDowngrade(false)} labelledBy="downgrade-title">
        <h2 id="downgrade-title" className="modal-title">
          ¿Volver al plan Starter?
        </h2>
        <p className="modal-text">
          Starter admite hasta 5 integrantes y no incluye Lumi ni alertas. Tu equipo tiene {members.length}{' '}
          {members.length === 1 ? 'persona' : 'personas'}.
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setDowngrade(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn--dark" onClick={confirmDowngrade}>
            Cambiar a Starter
          </button>
        </div>
      </Modal>
    </>);

}