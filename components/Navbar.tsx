'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/icon.png"
              alt="Universal Predictor Logo"
              width={32}
              height={32}
              className="rounded-full object-contain"
            />
            <div className="text-xl font-bold text-[#1F2937]">
              Universal Predictor
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
