'use client';

import Image from 'next/image';

export default function StatsBanner() {
  return (
    <div className="bg-[#F9FAFB] rounded-xl border border-gray-200 px-[60px] py-4 w-[calc(100%-8px)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Historical Prediction Accuracy */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/1.png"
              alt="Historical Prediction Accuracy"
              width={96}
              height={96}
              className="object-contain w-12 h-12"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#0D7A6A]">
              Historical Prediction Accuracy
            </h3>
            <p className="text-sm text-[#1F2937] font-normal">
              94.2% · Trailing 30-Day Avg.
            </p>
          </div>
        </div>

        {/* Avg. Market Divergence */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/2.png"
              alt="Avg. Market Divergence"
              width={96}
              height={96}
              className="object-contain w-12 h-12"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#0D7A6A]">
              Avg. Market Divergence
            </h3>
            <p className="text-sm text-[#1F2937] font-normal">
              +12% · Median Identified Edge
            </p>
          </div>
        </div>

        {/* Active Markets */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/3.png"
              alt="Active Markets"
              width={96}
              height={96}
              className="object-contain w-12 h-12"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#0D7A6A]">
              Active Markets
            </h3>
            <p className="text-sm text-[#1F2937] font-normal">
              Tracked in Real-Time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
