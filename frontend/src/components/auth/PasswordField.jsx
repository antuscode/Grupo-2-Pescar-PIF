import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  error
}) {
  const [visible, setVisible] = useState(false);
  const inputClass = error ?
  'input input--with-toggle input--error' :
  'input input--with-toggle';

  return (
    <div>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="field__control">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass} />
        
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="field__toggle">
          
          {visible ?
          <EyeIcon size={16} aria-hidden="true" /> :

          <EyeOffIcon size={16} aria-hidden="true" />
          }
        </button>
      </div>
      {error &&
      <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      }
    </div>);

}