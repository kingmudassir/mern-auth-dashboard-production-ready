import { useState } from 'react';
import FieldLabel from '../Common/FieldLabel';
import { AlertCircle, Check, Pencil, X } from 'lucide-react';

function EditableField({
  label,
  value,
  onSave,
  validate,
  type = 'text',
  icon: Icon,
  className = '',
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (validate) {
      const err = validate(draft);
      if (err) {
        setError(err);
        return;
      }
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setDraft(value);
    setError('');
    setEditing(false);
  };

  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      {editing ? (
        <div className="flex flex-col gap-1.5">
          <div
            className="flex items-center border rounded-xl h-10 bg-[#FAFAF9] transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white"
            style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : '#E8E3DC' }}
          >
            {Icon && (
              <Icon
                size={13}
                strokeWidth={1.9}
                className="absolute"
                style={{ color: '#C4BDD0', marginLeft: '12px', pointerEvents: 'none' }}
                aria-hidden="true"
              />
            )}
            <input
              type={type}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError('');
              }}
              className="min-w-0 flex-1 h-full bg-transparent outline-none border-none text-[0.85rem] text-[#1A1523]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                paddingLeft: Icon ? '36px' : '12px',
                paddingRight: '4px',
              }}
              autoFocus
              aria-label={label}
            />
            <div className="flex items-center gap-1 px-2 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors duration-150 disabled:opacity-50"
                aria-label="Save"
              >
                {saving ? (
                  <span className="spinner-xs" aria-hidden="true" />
                ) : (
                  <Check size={12} strokeWidth={2.5} />
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#F2EEE9] transition-colors duration-150"
                style={{ color: '#8A8390' }}
                aria-label="Cancel"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          {error && (
            <span
              className="flex items-center gap-1 text-[0.72rem]"
              style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
            >
              <AlertCircle size={10} strokeWidth={2} />
              {error}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 group">
          <span
            className="text-[0.875rem] font-medium"
            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
          >
            {value || <span style={{ color: '#C4BDD0' }}>Not set</span>}
          </span>
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center transition-[opacity,background-color] duration-150 hover:bg-[#F2EEE9]"
            style={{ color: '#8A8390' }}
            aria-label={`Edit ${label}`}
          >
            <Pencil size={11} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableField;
