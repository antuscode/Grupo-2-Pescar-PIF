import React from 'react';

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  error
}) {
  return (
    <div>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="field__control">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={error ? 'input input--error' : 'input'} />
        
      </div>
      {error &&
      <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      }
    </div>);

}