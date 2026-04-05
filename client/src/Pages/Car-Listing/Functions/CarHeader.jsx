import React from 'react';
import { MapPin, Clock, Calendar, Gauge, Fuel, Settings2 } from 'lucide-react';

export default function CarHeader({
  car,
  title,
  priceFormatted,
  postedAgo,
  fmtMileage,
  isMobile = false,
}) {
  return (
    <div className={`${isMobile ? 'mobile-title-block' : ''} cl-card ${isMobile ? 'mt-4' : ''}`}>
      <h1
        className={`${isMobile ? 'text-[1.2rem]' : 'text-[1.4rem]'} font-extrabold tracking-[-0.03em] leading-tight mb-1`}
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <MapPin size={isMobile ? 12 : 13} strokeWidth={2} style={{ color: '#C4BDD0' }} />
        <span
          className="text-[0.75rem]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {car.area ? `${car.area}, ` : ''}
          {car.city}
        </span>
        <span style={{ color: '#E8E3DC' }}>·</span>
        <Clock size={isMobile ? 11 : 12} strokeWidth={2} style={{ color: '#C4BDD0' }} />
        <span
          className="text-[0.75rem]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {postedAgo}
        </span>
      </div>

      <div
        className={`flex items-baseline gap-2 ${!isMobile ? 'mb-5 pb-5 border-b border-[#F2EEE9]' : ''}`}
      >
        <p
          className={`${isMobile ? 'text-[1.8rem]' : 'text-[2rem]'} font-extrabold tracking-[-0.04em]`}
          style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
        >
          {priceFormatted}
        </p>
        {!isMobile && (
          <span
            className="text-[0.75rem]"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            PKR
          </span>
        )}
        {car.negotiable && (
          <span
            className={`${isMobile ? 'text-[0.7rem] font-normal' : 'text-[0.72rem] font-semibold px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] text-[#16a34a]'}`}
            style={{ color: isMobile ? '#8A8390' : '', fontFamily: "'DM Sans', sans-serif" }}
          >
            {isMobile ? '· Negotiable' : 'Negotiable'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {[
          { icon: Calendar, val: car.year },
          { icon: Gauge, val: car.mileage != null ? fmtMileage(car.mileage) : 'N/A' },
          { icon: Fuel, val: car.fuel },
          { icon: Settings2, val: car.transmission },
        ].map(({ icon: Icon, val }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: '#F7F4F0' }}
          >
            <Icon size={12} strokeWidth={1.9} style={{ color: '#6C3CE1', flexShrink: 0 }} />
            <span
              className="text-[0.75rem] font-medium"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
