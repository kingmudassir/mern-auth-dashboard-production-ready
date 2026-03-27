import { User, Phone, Mail } from 'lucide-react';
import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';
import EditableField from '../Common/EditableField';

const UserPersonalInfoManager = ({
  user,
  onSaveName,
  onSavePhone,
  onSaveEmail,
  isEmail,
  isPhone,
}) => {
  return (
    <SectionCard>
      <SectionTitle sub="Hover a field to edit inline">Personal Information</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <EditableField
          label="Full Name"
          value={user.name}
          icon={User}
          onSave={onSaveName}
          validate={(v) => {
            if (!v.trim()) return 'Name is required';
            if (v.trim() === user.name) return 'Name must be different from current name';
            return null;
          }}
        />

        <EditableField
          label="Phone Number"
          value={user.phone}
          type="tel"
          icon={Phone}
          onSave={onSavePhone}
          validate={(v) => {
            if (!isPhone(v)) return 'Invalid Pakistani number';
            if (v === user.phone) return 'Phone must be different from current number';
            return null;
          }}
        />

        <EditableField
          label="Email Address"
          value={user.email}
          type="email"
          icon={Mail}
          onSave={onSaveEmail}
          validate={(v) => {
            if (!isEmail(v)) return 'Invalid email address';
            if (v === user.email) return 'Email must be different from current email';
            return null;
          }}
        />
      </div>
    </SectionCard>
  );
};

export default UserPersonalInfoManager;
