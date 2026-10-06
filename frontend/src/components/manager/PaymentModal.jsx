import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { Modal } from '../app/Modal';
import { validateEmail } from '../../utils/validation';


// Reglas de cada campo: devuelven un mensaje de error o '' si está bien
const rules = {
  name: (v) => v.trim() ? '' : 'Escribí el nombre como figura en la tarjeta.',
  number: (v) => v.replace(/\s/g, '').length === 16 ? '' : 'El número debe tener 16 dígitos.',
  exp: (v) => {
    const match = v.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return 'Usá el formato MM/AA.';
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return 'Mes inválido.';
    if (new Date(year, month) < new Date()) return 'La tarjeta está vencida.';
    return '';
  },
  cvc: (v) => /^\d{3,4}$/.test(v) ? '' : '3 o 4 dígitos.',
  email: (v) => validateEmail(v) ?? ''
};

const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatExp = (v) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

// mode: 'pay' (pagar un plan) | 'card' (solo guardar tarjeta)
export function PaymentModal({ open, mode, plan, members, defaultName = '', defaultEmail = '', onClose, onConfirm }) {
  // El nombre y el email arrancan con los datos de quien inició sesión
  const EMPTY = { name: defaultName, number: '', exp: '', cvc: '', email: defaultEmail };
  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const total = plan ? plan.pricePerPerson * members : 0;
  const money = `$${total.toFixed(2)}`;
  const errorOf = (field) => rules[field](form[field]);
  const showError = (field) => touched[field] && errorOf(field);

  const set = (field, value) => setForm({ ...form, [field]: value });
  const blur = (field) => setTouched({ ...touched, [field]: true });

  const close = () => {
    setForm(EMPTY);
    setTouched({});
    setLoading(false);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, number: true, exp: true, cvc: true, email: true });
    if (Object.keys(rules).some((f) => errorOf(f))) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm({ last4: form.number.slice(-4), exp: form.exp });
      setForm(EMPTY);
      setTouched({});
      setLoading(false);
    }, 900);
  };

  const field = (id, label, props) => {
    const ok = form[id] && !errorOf(id);
    return (
      <div>
        <label htmlFor={`pay-${id}`} className="field__label">
          {label}
        </label>
        <div className={ok ? 'valid-input valid-input--ok' : 'valid-input'}>
          <input
            id={`pay-${id}`}
            className={showError(id) ? 'input input--sm input--error' : 'input input--sm'}
            value={form[id]}
            onBlur={() => blur(id)}
            aria-invalid={Boolean(showError(id))}
            aria-describedby={showError(id) ? `pay-${id}-error` : undefined}
            {...props} />
          
          {ok && <CheckIcon size={14} className="valid-input__check" aria-hidden="true" />}
        </div>
        {showError(id) &&
        <p id={`pay-${id}-error`} className="field__error">
            {errorOf(id)}
          </p>
        }
      </div>);

  };

  const isPay = mode === 'pay';

  return (
    <Modal open={open} onClose={close} labelledBy="pay-title" wide={isPay}>
      <h2 id="pay-title" className="modal-title">
        {isPay ? `Pagar plan ${plan?.name}` : 'Tarjeta de pago'}
      </h2>
      <p className="modal-text">
        {isPay ? 'Completá tus datos para activar Lumi y las alertas para todo el equipo.' : 'Guardá la tarjeta para tus próximos pagos.'}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className={isPay ? 'pay-grid' : 'pay-grid pay-grid--single'}>
          <div className="pay-fields">
            {field('name', 'Nombre en la tarjeta', { autoComplete: 'cc-name', onChange: (e) => set('name', e.target.value) })}
            {field('number', 'Número de tarjeta', {
              inputMode: 'numeric',
              autoComplete: 'cc-number',
              placeholder: '4242 4242 4242 4242',
              onChange: (e) => set('number', formatNumber(e.target.value))
            })}
            <div className="pay-row">
              {field('exp', 'Vencimiento', {
                inputMode: 'numeric',
                autoComplete: 'cc-exp',
                placeholder: 'MM/AA',
                onChange: (e) => set('exp', formatExp(e.target.value))
              })}
              {field('cvc', 'CVC', {
                type: 'password',
                inputMode: 'numeric',
                autoComplete: 'cc-csc',
                placeholder: '•••',
                onChange: (e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))
              })}
            </div>
            {field('email', 'Email de facturación', { type: 'email', autoComplete: 'email', onChange: (e) => set('email', e.target.value) })}
          </div>

          {isPay && plan &&
          <div>
              <div className="summary">
                <p className="summary__title">Resumen</p>
                <p className="summary__row">
                  Plan {plan.name} <strong>${plan.pricePerPerson} / persona / mes</strong>
                </p>
                <p className="summary__row">
                  Integrantes <strong>{members}</strong>
                </p>
                <p className="summary__row">
                  Subtotal <strong>{money}</strong>
                </p>
                <p className="summary__total">
                  Total hoy <span>{money} USD</span>
                </p>
              </div>
              <p className="summary-note">Se renueva cada mes. Podés cambiar o cancelar el plan cuando quieras.</p>
            </div>
          }
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={close}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--accent" disabled={loading}>
            {loading && <Loader2Icon size={14} className="spinner" aria-hidden="true" />}
            {loading ? 'Procesando…' : isPay ? `Pagar ${money}` : 'Guardar tarjeta'}
          </button>
        </div>
      </form>
    </Modal>);

}