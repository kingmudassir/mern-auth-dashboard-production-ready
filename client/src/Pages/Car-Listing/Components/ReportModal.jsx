import React, { useState, useEffect } from 'react';
import { Flag, X, Check, CheckCircle2, AlertCircle } from 'lucide-react';

const REPORT_REASONS = [
  'Misleading price or description',
  'Duplicate listing',
  'Fraudulent or scam activity',
  'Wrong category',
  'Offensive content',
  'Car already sold',
  'Fake photos or stolen images',
  'Other',
];

/**
 * ReportModal Component
 * @param {Function} onClose - Function to close the modal
 * @param {string} carId - The ID of the vehicle being reported
 */
export default function ReportModal({ onClose, carId }) {
  const [step, setStep] = useState('select'); // 'select' | 'done'
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setErr('Please select a reason');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      // Mock API Call - Replace with your mutation logic
      // e.g., await reportMutation.mutateAsync({ carId, reason: selectedReason, detail });
      await new Promise((r) => setTimeout(r, 1100));

      setStep('done');
    } catch (e) {
      setErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(26,21,35,0.65)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay click-to-close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full sm:max-w-md p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{
          border: '1px solid #E8E3DC',
          borderRadius: '24px 24px 0 0', // Mobile
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Mobile Handle */}
        <div className="sm:hidden mx-auto mb-6 w-10 h-1 rounded-full bg-stone-200" />

        {step === 'done' ? (
          <SuccessState onClose={onClose} />
        ) : (
          <>
            <Header onClose={onClose} />

            <div className="space-y-2 mb-5">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason);
                    setErr('');
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left ${
                    selectedReason === reason
                      ? 'border-[#6C3CE1] bg-[#6C3CE1]/5'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                  aria-pressed={selectedReason === reason}
                >
                  <span
                    className={`text-[0.875rem] font-medium ${
                      selectedReason === reason ? 'text-[#6C3CE1]' : 'text-[#1A1523]'
                    }`}
                  >
                    {reason}
                  </span>
                  {selectedReason === reason && (
                    <Check size={16} strokeWidth={3} className="text-[#6C3CE1]" />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Provide more context (optional)..."
              rows={3}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 text-[0.95rem] p-4 outline-none focus:border-stone-400 focus:bg-white transition-all resize-none mb-4"
              style={{ fontSize: '16px' }} // Prevents iOS zoom
            />

            {err && (
              <div className="flex items-center gap-2 text-[#E8622A] text-[0.8rem] mb-4 font-medium">
                <AlertCircle size={14} /> {err}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-bold text-stone-500 border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-bold text-white shadow-lg shadow-orange-700/20 disabled:opacity-50 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #E8622A, #C4531F)' }}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Internal Sub-components
function Header({ onClose }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-50 text-[#E8622A]">
          <Flag size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[1.15rem] font-black tracking-tight text-[#1A1523] font-syne">
            Report Listing
          </h3>
          <p className="text-[0.75rem] text-stone-500 font-medium">
            Help us keep our marketplace safe
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-stone-100 text-stone-400 hover:bg-stone-200 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function SuccessState({ onClose }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 text-green-600">
        <CheckCircle2 size={36} strokeWidth={2} />
      </div>
      <h3 className="text-[1.25rem] font-black mb-3 text-[#1A1523] font-syne">Report Received</h3>
      <p className="text-[0.875rem] text-stone-500 leading-relaxed mb-8 px-4">
        Thank you for your vigilance. Our moderation team will review this listing within 24 hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-4 rounded-xl text-white text-[0.9rem] font-bold shadow-xl shadow-purple-900/20 transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' }}
      >
        Return to Listing
      </button>
    </div>
  );
}
