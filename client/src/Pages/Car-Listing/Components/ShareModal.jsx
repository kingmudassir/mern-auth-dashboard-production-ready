import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

/**
 * ShareModal Component
 * @param {Function} onClose - Function to close the modal
 * @param {string} title - The title of the listing being shared
 */
export default function ShareModal({ onClose, title }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  // Set URL on mount to avoid SSR issues with window object
  useEffect(() => {
    setUrl(window.location.href);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(26,21,35,0.6)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay click-to-close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full sm:max-w-sm p-6 sm:p-8 animate-in slide-in-from-bottom duration-300"
        style={{
          border: '1px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26,21,35,0.2)',
          borderRadius: '24px 24px 0 0', // Mobile-first top corners
        }}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden mx-auto mb-6 w-10 h-1 rounded-full bg-stone-200" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-[#6C3CE1]">
              <Share2 size={20} />
            </div>
            <h3 className="text-[1.1rem] font-black tracking-tight text-[#1A1523] font-syne">
              Share Listing
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <p className="text-[0.82rem] mb-5 font-medium text-stone-500 leading-tight">{title}</p>

        {/* URL Copy Bar */}
        <div className="flex items-center gap-2 p-2 pl-4 rounded-2xl mb-6 bg-stone-50 border border-stone-200">
          <p className="flex-1 text-[0.75rem] text-stone-400 truncate font-mono">{url}</p>
          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-2 text-[0.75rem] font-bold px-4 py-2 rounded-xl transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-[#6C3CE1] text-white shadow-lg shadow-purple-900/20 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={3} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} strokeWidth={2} />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Social Actions */}
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map(({ label, color, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl text-[0.85rem] font-bold text-white transition-transform active:scale-95 hover:brightness-110"
              style={{
                background: color,
                padding: '14px 10px',
                minHeight: '52px',
              }}
            >
              <ExternalLink size={14} strokeWidth={2.5} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
