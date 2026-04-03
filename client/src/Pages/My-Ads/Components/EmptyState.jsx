import { Car, Plus } from 'lucide-react';

const EmptyState = ({ isFiltered, onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      {/* Visual Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(108, 60, 225, 0.07)' }}
        aria-hidden="true"
      >
        <Car size={30} strokeWidth={1.5} style={{ color: '#6C3CE1', opacity: 0.45 }} />
      </div>

      {/* Main Title */}
      <h2
        className="text-[1.15rem] font-extrabold tracking-[-0.03em] mb-2"
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {isFiltered ? 'No ads match your search' : 'No ads posted yet'}
      </h2>

      {/* Description Text */}
      <p
        className="text-[0.85rem] max-w-xs leading-relaxed mb-7 mx-auto"
        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
      >
        {isFiltered
          ? 'Try adjusting your filters or using a different search term to find what you’re looking for.'
          : 'Post your first car listing and start reaching buyers across Pakistan today.'}
      </p>

      {/* Conditional Call to Action */}
      {isFiltered ? (
        <button
          type="button"
          onClick={onClear}
          className="text-[0.82rem] font-semibold px-5 py-2.5 rounded-xl border transition-all hover:bg-[rgba(108,60,225,0.08)]"
          style={{
            color: '#6C3CE1',
            borderColor: 'rgba(108, 60, 225, 0.28)',
            background: 'rgba(108, 60, 225, 0.05)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Clear all filters
        </button>
      ) : (
        <a
          href="/post-ad"
          className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white px-6 py-3 rounded-xl no-underline transition-all duration-150 hover:-translate-y-px active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
            boxShadow: '0 4px 12px rgba(108, 60, 225, 0.28)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          Post Your First Ad
        </a>
      )}
    </div>
  );
};

export default EmptyState;
