import { KeyRound, Send } from 'lucide-react';
import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';
import ActionBtn from '../Common/ActionBtn';

const UserPasswordManager = ({ onSetNewPassword, onSendResetLink, isSendingResetLink }) => {
  return (
    <SectionCard>
      <SectionTitle sub="Force a password change or send a reset link">
        Password Management
      </SectionTitle>
      <div className="flex gap-3 flex-wrap">
        <ActionBtn
          label="Set new password"
          icon={KeyRound}
          onClick={onSetNewPassword}
          variant="violet"
        />
        <ActionBtn
          label="Send reset link"
          icon={Send}
          loading={isSendingResetLink}
          onClick={onSendResetLink}
        />
      </div>
    </SectionCard>
  );
};

export default UserPasswordManager;
