'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between pt-5 pb-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/icon.png"
              alt="Universal Predictor Logo"
              width={44}
              height={44}
              className="rounded-full object-contain flex-shrink-0"
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold text-[#1F2937]">
                Universal Predictor
              </div>
              <div className="text-xs text-gray-500 font-normal leading-tight">
                AI that outpredicts the prediction market
              </div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
