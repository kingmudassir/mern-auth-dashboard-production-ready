import { Search } from 'lucide-react';

function SearchBar({ placeholder }) {
  return (
    <div className="relative">
      <Search
        size={14}
        strokeWidth={2}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4BDD0] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder={placeholder}
        className="h-9 pl-9 pr-4 rounded-xl border border-[#E8E3DC] bg-white text-[0.82rem] text-[#1A1523] placeholder-[#C4BDD0] outline-none focus:border-[rgba(108,60,225,0.35)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.07)] transition-[border-color,box-shadow] duration-200"
        style={{ fontFamily: "'DM Sans', sans-serif", minWidth: '220px' }}
        aria-label={placeholder}
      />
    </div>
  );
}
export default SearchBar;
