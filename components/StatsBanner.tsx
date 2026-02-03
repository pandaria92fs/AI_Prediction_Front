'use client';

import Image from 'next/image';

export default function StatsBanner() {
  return (
    <div className="bg-[#F9FAFB] rounded-xl border border-gray-200 shadow-[0_2px_9px_rgba(0,0,0,0.08)] px-[60px] py-4 w-[calc(100%-8px)]">
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
              65% accuracy
            </p>
          </div>
        </div>

        {/* Proprietary Data Ingestion */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/2.png"
              alt="Proprietary Data Ingestion"
              width={96}
              height={96}
              className="object-contain w-12 h-12"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#0D7A6A]">
              Proprietary Data Ingestion
            </h3>
            <p className="text-sm text-[#1F2937] font-normal">
              2.5B+ · Daily Unstructured Signals Analyzed
            </p>
          </div>
        </div>

        {/* Model Re-calibration Rate */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/3.png"
              alt="Model Re-calibration Rate"
              width={96}
              height={96}
              className="object-contain w-12 h-12"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#0D7A6A]">
              Model Re-calibration Rate
            </h3>
            <p className="text-sm text-[#1F2937] font-normal">
              Real-time · Sub-second Processing Latency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
