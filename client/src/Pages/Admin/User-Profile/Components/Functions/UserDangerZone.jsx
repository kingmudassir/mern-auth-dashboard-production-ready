import React from 'react';
import { Trash2 } from 'lucide-react';
import SectionTitle from '../Common/SectionTitle';
import ActionBtn from '../Common/ActionBtn';

const UserDangerZone = ({
  onDeleteListings,
  onDeleteAccount,
  isDeletingListings,
  isDeletingAccount,
}) => {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: '#FFFAF9',
        border: '1.5px solid rgba(232,98,42,0.2)',
      }}
    >
      <SectionTitle sub="Irreversible actions — proceed with caution">Danger Zone</SectionTitle>

      <div className="flex gap-3 flex-wrap">
        <ActionBtn
          label="Delete all listings"
          icon={Trash2}
          onClick={onDeleteListings}
          loading={isDeletingListings}
          variant="danger"
        />
        <ActionBtn
          label="Delete account"
          icon={Trash2}
          onClick={onDeleteAccount}
          loading={isDeletingAccount}
          variant="red"
        />
      </div>
    </div>
  );
};

export default UserDangerZone;
