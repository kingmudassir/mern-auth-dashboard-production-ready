import { useSearchParams, useNavigate, replace } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader } from 'lucide-react';
import { useConfirmEmailChange } from '../Hooks/useConfirmEmailChange';

function ConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { data, isPending, isError, isSuccess, error } = useConfirmEmailChange(token);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md rounded-3xl border border-[#E8E3DC] bg-white p-10 text-center shadow-sm">
        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-2 mb-8">
          <img src="/wheel.svg" alt="" className="w-7 h-7 object-contain" aria-hidden="true" />
          <span
            className="font-extrabold text-[1.25rem] tracking-[-0.045em] text-[#1A1523] leading-none"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Pai<em className="not-italic text-[#6C3CE1]">yya</em>
          </span>
        </a>

        {/* No token in URL */}
        {!token && (
          <>
            <XCircle size={40} className="text-[#E8622A] mx-auto mb-4" />
            <h1 className="text-[1.2rem] font-bold text-[#1A1523] mb-2">Invalid link</h1>
            <p className="text-sm text-[#8A8390] mb-8">
              No token found. Please request a new email change.
            </p>
            <button
              onClick={() => navigate('/userprofile', { replace: true })}
              className="text-sm font-medium text-[#6C3CE1] hover:underline"
            >
              Back to Profile
            </button>
          </>
        )}

        {token && isPending && (
          <>
            <Loader size={40} className="text-[#6C3CE1] animate-spin mx-auto mb-4" />
            <h1 className="text-[1.2rem] font-bold text-[#1A1523] mb-2">Verifying your email…</h1>
            <p className="text-sm text-[#8A8390]">Please wait a moment.</p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-[1.2rem] font-bold text-[#1A1523] mb-2">Email updated!</h1>
            <p className="text-sm text-[#8A8390] mb-8">
              {data?.message || 'Email updated successfully.'}
            </p>
            <button
              onClick={() => navigate('/userprofile', { replace: true })}
              className="btn-register relative overflow-hidden inline-flex items-center gap-1 text-sm font-semibold text-white px-6 py-3 rounded-full"
            >
              <span className="relative z-10">Go to Profile</span>
            </button>
          </>
        )}

        {isError && (
          <>
            <XCircle size={40} className="text-[#E8622A] mx-auto mb-4" />
            <h1 className="text-[1.2rem] font-bold text-[#1A1523] mb-2">Verification failed</h1>
            <p className="text-sm text-[#8A8390] mb-8">
              {error?.message || 'Token is invalid or has expired.'}
            </p>
            <button
              onClick={() => navigate('/userprofile', { replace: true })}
              className="text-sm font-medium text-[#6C3CE1] hover:underline"
            >
              Back to Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmailChange;
