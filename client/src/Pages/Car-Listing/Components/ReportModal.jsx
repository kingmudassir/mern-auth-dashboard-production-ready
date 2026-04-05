import { useState, useEffect } from 'react';
import { Flag, X, Check, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { useReportAd } from '../../../Hooks/Car-Listing/useReportAd';
import { useUser } from '../../../Hooks/useUser';

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
 * ReportModal
 * @param {Function} onClose   - Closes the modal
 * @param {string}   carId     - ID of the car being reported
 */
export default function ReportModal({ onClose, carId }) {
  const { data: user } = useUser();
  const { mutate: reportAd, isPending } = useReportAd();

  const [step, setStep] = useState('select'); // 'select' | 'done'
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [err, setErr] = useState('');

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = () => {
    if (!selectedReason) {
      setErr('Please select a reason.');
      return;
    }
    setErr('');

    reportAd(
      { carId, reason: selectedReason, description: detail.trim() || undefined },
      {
        onSuccess: () => setStep('done'),
        onError: (error) => {
          // The axios interceptor in axiosConfig.js rejects with error.response.data,
          // so the message sits directly on the error object.
          setErr(error?.message || 'Something went wrong. Please try again.');
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(26,21,35,0.65)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Report listing"
    >
      {/* Backdrop click-to-close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full sm:max-w-md p-6 sm:p-8 shadow-2xl"
        style={{
          border: '1px solid #E8E3DC',
          borderRadius: '24px 24px 0 0',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden mx-auto mb-6 w-10 h-1 rounded-full bg-stone-200" />

        {/* ── Not logged in ── */}
        {!user ? (
          <NotLoggedIn onClose={onClose} />
        ) : step === 'done' ? (
          <SuccessState onClose={onClose} />
        ) : (
          <>
            <Header onClose={onClose} />

            {/* Reason list */}
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
                      ? 'border-[#6C3CE1] bg-[rgba(108,60,225,0.05)]'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                  aria-pressed={selectedReason === reason}
                >
                  <span
                    className="text-[0.875rem] font-medium"
                    style={{ color: selectedReason === reason ? '#6C3CE1' : '#1A1523' }}
                  >
                    {reason}
                  </span>
                  {selectedReason === reason && (
                    <Check size={16} strokeWidth={3} style={{ color: '#6C3CE1' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Optional detail */}
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Provide more context (optional)…"
              rows={3}
              maxLength={1000}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 text-[0.95rem] p-4 outline-none focus:border-stone-400 focus:bg-white transition-all resize-none mb-1"
              style={{ fontSize: '16px' }}
            />
            <p
              className="text-right text-[0.72rem] mb-4"
              style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
            >
              {detail.length} / 1000
            </p>

            {/* Error */}
            {err && (
              <div className="flex items-center gap-2 text-[#E8622A] text-[0.8rem] mb-4 font-medium">
                <AlertCircle size={14} />
                {err}
              </div>
            )}

            {/* Actions */}
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
                disabled={isPending || !selectedReason}
                className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-bold text-white shadow-lg shadow-orange-700/20 disabled:opacity-50 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #E8622A, #C4531F)' }}
              >
                {isPending ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Header({ onClose }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-50">
          <Flag size={20} strokeWidth={2.5} style={{ color: '#E8622A' }} />
        </div>
        <div>
          <h3
            className="text-[1.15rem] font-black tracking-tight text-[#1A1523]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Report Listing
          </h3>
          <p className="text-[0.75rem] text-stone-500 font-medium">
            Help us keep our marketplace safe
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-lg bg-stone-100 text-stone-400 hover:bg-stone-200 transition-colors"
        aria-label="Close"
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
      <h3
        className="text-[1.25rem] font-black mb-3 text-[#1A1523]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Report Received
      </h3>
      <p className="text-[0.875rem] text-stone-500 leading-relaxed mb-8 px-4">
        Thank you for your vigilance. Our moderation team will review this listing within 24 hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-4 rounded-xl text-white text-[0.9rem] font-bold transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' }}
      >
        Return to Listing
      </button>
    </div>
  );
}

function NotLoggedIn({ onClose }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(108,60,225,0.08)] flex items-center justify-center mx-auto mb-5">
        <LogIn size={30} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
      </div>
      <h3
        className="text-[1.15rem] font-black mb-2 text-[#1A1523]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Sign in to report
      </h3>
      <p className="text-[0.875rem] text-stone-500 leading-relaxed mb-8 px-4">
        You need to be logged in to report a listing. It only takes a moment.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-bold text-stone-500 border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
        <a
          href="/login"
          className="flex-1 py-3.5 rounded-xl text-[0.875rem] font-bold text-white text-center transition-all active:scale-95 no-underline"
          style={{ background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' }}
        >
          Log In
        </a>
      </div>
    </div>
  );
}
