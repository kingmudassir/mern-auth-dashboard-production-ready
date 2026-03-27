import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';

const AdminNotesManager = ({ notes, setNotes, onSave, isSaving }) => {
  return (
    <SectionCard>
      <SectionTitle sub="Internal notes — not visible to user">Admin Notes</SectionTitle>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes about this user…"
        rows={4}
        className="w-full rounded-xl border bg-[#FAFAF9] text-[0.82rem] p-3 outline-none resize-none transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white"
        style={{
          borderColor: '#E8E3DC',
          color: '#1A1523',
          fontFamily: "'DM Sans', sans-serif",
        }}
        aria-label="Admin notes"
      />

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="mt-2 w-full py-2.5 rounded-xl text-[0.8rem] font-semibold text-white transition-opacity duration-150 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {isSaving ? 'Saving…' : 'Save Notes'}
      </button>
    </SectionCard>
  );
};

export default AdminNotesManager;
