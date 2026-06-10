'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function CreateProjectButton() {
  return (
    <Link
      href="/builder/create"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
    >
      <Plus size={20} />
      Create New Agent
    </Link>
  );
}
