import { useRef, useEffect } from 'react';

export function InputOTP({ value, onChange, hasError, disabled }) {
  const refs = useRef([]);
  const digits = value.split('');

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = '';
        onChange(next.join(''));
      } else if (i > 0) {
        next[i - 1] = '';
        onChange(next.join(''));
        refs.current[i - 1]?.focus();
      }
      return;
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowRight' && i < 5) {
      refs.current[i + 1]?.focus();
      return;
    }
    if (!/^[0-9]$/.test(e.key)) return;
    e.preventDefault();
    const next = [...digits];
    next[i] = e.key;
    onChange(next.join(''));
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Auto-focus first box on mount
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  return (
    <div
      className="flex gap-2.5 justify-center"
      role="group"
      aria-label="6-digit verification code"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onChange={() => {}}
          disabled={disabled}
          className={`
            w-11 text-center text-[1.15rem] font-bold
            border rounded-xl outline-none
            transition-[border-color,box-shadow,background-color,opacity] duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              hasError
                ? 'border-[rgba(232,98,42,0.5)] bg-[rgba(232,98,42,0.04)] text-[#E8622A] focus:border-[#E8622A] focus:shadow-[0_0_0_3px_rgba(232,98,42,0.1)]'
                : digits[i]
                  ? 'border-[#6C3CE1] bg-[rgba(108,60,225,0.05)] text-[#1A1523] shadow-[0_0_0_2px_rgba(108,60,225,0.1)] focus:border-[#6C3CE1] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] focus:bg-white'
                  : 'border-[#E8E3DC] bg-[#FAFAF9] text-[#1A1523] focus:border-[rgba(108,60,225,0.45)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white'
            }
          `}
          style={{
            fontFamily: "'Syne', sans-serif",
            height: '52px',
            caretColor: 'transparent',
          }}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={hasError}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  );
}
