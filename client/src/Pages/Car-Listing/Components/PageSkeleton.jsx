import React from 'react';

/**
 * PageSkeleton Component
 * Provides a shimmering loading state for the listing detail page.
 */
export default function PageSkeleton() {
  const Box = ({ w = '100%', h = '16px', r = '8px', mt = '0' }) => (
    <div
      className="animate-pulse bg-[#EDE8E2]"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginTop: mt,
      }}
    />
  );

  return (
    <div className="w-full min-h-screen pt-[66px] bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Media & Primary Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Gallery Placeholder */}
            <Box h="420px" r="24px" />

            {/* Title Card */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E8E3DC] flex flex-col gap-4">
              <Box w="60%" h="28px" />
              <Box w="30%" h="16px" />
              <div className="pt-4 border-t border-[#F7F4F0]">
                <Box w="45%" h="32px" />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E8E3DC] flex flex-col gap-4">
              <Box w="40%" h="20px" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Box key={i} h="14px" w={`${85 - i * 5}%`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Contact */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[20px] p-6 border border-[#E8E3DC] sticky top-24">
              <div className="flex flex-col gap-5">
                <Box w="75%" h="24px" />
                <Box w="50%" h="16px" />
                <div className="py-2">
                  <Box w="55%" h="36px" />
                </div>
                <div className="space-y-3 pt-4">
                  <Box h="54px" r="14px" />
                  <Box h="54px" r="14px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
