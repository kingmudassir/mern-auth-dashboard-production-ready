import { AlertCircle, CheckCircle2, X } from 'lucide-react';

function Toast({ msg, type = 'success', onDismiss }) {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-[0.8rem] font-medium"
      style={{
        background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(232,98,42,0.08)',
        border: `1px solid ${ok ? 'rgba(34,197,94,0.25)' : 'rgba(232,98,42,0.2)'}`,
        color: ok ? '#16a34a' : '#C4531F',
        fontFamily: "'DM Sans', sans-serif",
      }}
      role="status"
      aria-live="polite"
    >
      {ok ? <CheckCircle2 size={14} strokeWidth={2} /> : <AlertCircle size={14} strokeWidth={2} />}
      <span className="flex-1">{msg}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <X size={13} strokeWidth={2} />
      </button>
    </div>
  );
}
export default Toast;
