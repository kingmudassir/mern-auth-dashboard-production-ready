import { AlertTriangle, Shield } from 'lucide-react';

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.2)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: danger ? 'rgba(232,98,42,0.1)' : 'rgba(108,60,225,0.1)' }}
        >
          {danger ? (
            <AlertTriangle size={18} strokeWidth={2} style={{ color: '#E8622A' }} />
          ) : (
            <Shield size={18} strokeWidth={2} style={{ color: '#6C3CE1' }} />
          )}
        </div>
        <h3
          className="text-[1rem] font-extrabold mb-1.5 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[0.8rem] leading-relaxed mb-5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border transition-colors duration-150"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity duration-150"
            style={{
              background: danger
                ? 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)'
                : 'linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
