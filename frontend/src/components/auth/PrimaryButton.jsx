import React from 'react';
import { Loader2Icon } from 'lucide-react';

export function PrimaryButton({
  children,
  loading = false,
  loadingLabel,
  type = 'submit',
  onClick
}) {
  return (
    <button type={type} onClick={onClick} disabled={loading} className="btn-primary">
      {loading && <Loader2Icon size={16} className="spinner" aria-hidden="true" />}
      {loading && loadingLabel ? loadingLabel : children}
    </button>);

}