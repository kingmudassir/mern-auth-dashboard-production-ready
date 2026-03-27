import { ShieldCheck, ShieldOff, Send } from 'lucide-react';
import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';
import ActionBtn from '../Common/ActionBtn';

const UserVerificationManager = ({
  user,
  setModal,
  isVerifyingEmail,
  isResendingPhone,
  onResendVerification,
}) => {
  const VerificationRow = ({
    label,
    isVerified,
    onVerifyClick,
    onResendClick,
    resendLoading,
    verifyLoading,
    showResend = false,
  }) => (
    <div
      className="flex items-center justify-between gap-4 p-4 rounded-xl"
      style={{ border: '1.5px solid #E8E3DC', background: '#FAFAF9' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: isVerified ? 'rgba(34,197,94,0.12)' : 'rgba(232,98,42,0.1)',
          }}
        >
          {isVerified ? (
            <ShieldCheck size={15} strokeWidth={2} style={{ color: '#16a34a' }} />
          ) : (
            <ShieldOff size={15} strokeWidth={2} style={{ color: '#E8622A' }} />
          )}
        </div>
        <div>
          <p
            className="text-[0.82rem] font-semibold"
            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
          >
            {label}
          </p>
          <p
            className="text-[0.72rem]"
            style={{
              color: isVerified ? '#16a34a' : '#E8622A',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isVerified ? 'Verified' : 'Not verified'}
          </p>
        </div>
      </div>

      {!isVerified && (
        <div className="flex gap-2 flex-wrap justify-end">
          {showResend && (
            <ActionBtn
              label="Resend OTP"
              icon={Send}
              loading={resendLoading}
              onClick={onResendClick}
              variant="violet"
            />
          )}
          <ActionBtn
            label="Verify manually"
            icon={ShieldCheck}
            loading={verifyLoading}
            onClick={onVerifyClick}
          />
        </div>
      )}
    </div>
  );

  return (
    <SectionCard>
      <SectionTitle sub="Manage email and phone verification status">Verification</SectionTitle>
      <div className="flex flex-col gap-3">
        <VerificationRow
          label="Email"
          isVerified={user.isEmailVerified}
          onVerifyClick={() => setModal({ type: 'verify-email' })}
          verifyLoading={isVerifyingEmail}
        />
        <VerificationRow
          label="Phone"
          isVerified={user.phoneVerified}
          showResend={true}
          onResendClick={() => onResendVerification('phone')}
          resendLoading={isResendingPhone}
          onVerifyClick={() => setModal({ type: 'verify-phone' })}
        />
      </div>
    </SectionCard>
  );
};

export default UserVerificationManager;
