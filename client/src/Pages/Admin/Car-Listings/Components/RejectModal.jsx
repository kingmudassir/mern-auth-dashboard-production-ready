import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

const RejectModal = ({ listing, onConfirm, onCancel, listingTitle }) => {
  const [reason, setReason] = useState('');

  if (!listing) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(232,98,42,0.1)' }}
        >
          <XCircle size={18} strokeWidth={2} style={{ color: '#C4531F' }} />
        </div>

        <h3
          className="text-[1rem] font-extrabold mb-1 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Reject listing?
        </h3>

        <p
          className="text-[0.8rem] mb-4"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {listingTitle(listing)}
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection (required)…"
          rows={3}
          className="w-full rounded-xl p-3 text-[0.82rem] resize-none outline-none mb-4"
          style={{
            border: '1.5px solid #E8E3DC',
            fontFamily: "'DM Sans', sans-serif",
            color: '#1A1523',
            background: '#FAFAF9',
          }}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
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
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg,#C4531F,#E8622A)',
              opacity: reason.trim() ? 1 : 0.45,
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
