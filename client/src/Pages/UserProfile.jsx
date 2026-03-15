import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useUser } from '../Hooks/useUser.js';

function UserProfile() {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load user.</p>
      </div>
    );
  }

  return (
    <div className="login-bg min-h-screen flex items-center justify-center px-4 py-16">
      <div className="success-pop bg-white border border-[#E8E3DC] rounded-3xl p-10 max-w-sm w-full text-center shadow-[0_8px_40px_rgba(26,21,35,0.08)]">
        <div className="w-16 h-16 rounded-full bg-[rgba(108,60,225,0.1)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#6C3CE1]" />
        </div>

        <h2
          className="text-[1.6rem] font-extrabold text-[#1A1523] mb-2 leading-tight tracking-[-0.03em]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h2>

        <p
          className="text-[#8A8390] text-[0.9rem] leading-relaxed mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Email: {user?.email}
        </p>

        <p
          className="text-[#8A8390] text-[0.9rem] leading-relaxed mb-7"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          You're logged in. Let's find your perfect drive.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full text-white text-[0.875rem] font-semibold py-3 rounded-xl transition-transform duration-200 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
            boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Go to Homepage
          <ArrowRight size={15} strokeWidth={2.2} />
        </a>
      </div>
    </div>
  );
}

export default UserProfile;
