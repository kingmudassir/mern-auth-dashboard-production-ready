import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

/**
 * MobileCTABar Component
 * Sticky action bar for mobile listing pages.
 */
export default function MobileCTABar({ phone, whatsapp, title, phoneVisible, setPhoneVisible }) {
  // Local logic: Normalize phone number for WhatsApp (92 prefix)
  const cleanNumber = phone?.replace(/\D/g, '');
  const waNumber = cleanNumber?.startsWith('92')
    ? cleanNumber
    : `92${cleanNumber?.replace(/^0/, '')}`;

  const waMessage = encodeURIComponent(`Hi, I'm interested in your ${title} on Paiyya.`);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#E8E3DC] p-4 flex gap-3 sm:hidden pb-safe">
      {/* Call Seller Button */}
      <button
        type="button"
        onClick={() => setPhoneVisible((p) => !p)}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl text-white text-[0.875rem] font-bold transition-all active:scale-95 shadow-lg shadow-purple-900/20"
        style={{
          background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
          minHeight: '52px',
          border: 'none',
        }}
      >
        <Phone size={16} strokeWidth={2.5} />
        <span className="font-dm-sans">{phoneVisible ? phone : 'Call Seller'}</span>
      </button>

      {/* WhatsApp Button (Conditional) */}
      {whatsapp && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl text-white text-[0.875rem] font-bold transition-all active:scale-95 shadow-lg shadow-green-900/10"
          style={{
            background: '#25D366',
            minHeight: '52px',
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={18} strokeWidth={2.5} />
          <span className="font-dm-sans">WhatsApp</span>
        </a>
      )}
    </div>
  );
}
