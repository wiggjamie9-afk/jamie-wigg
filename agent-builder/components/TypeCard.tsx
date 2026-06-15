"use client";

import React from "react";

interface UseCase {
  title: string;
  description: string;
}

interface TypeCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  useCases: UseCase[];
  tier: 'starter' | 'pro' | 'addon';
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

const tierColors = {
  starter: 'bg-blue-50 border-blue-200',
  pro: 'bg-purple-50 border-purple-200',
  addon: 'bg-amber-50 border-amber-200',
};

const tierBadgeColors = {
  starter: 'bg-blue-100 text-blue-800',
  pro: 'bg-purple-100 text-purple-800',
  addon: 'bg-amber-100 text-amber-800',
};

export function TypeCard({
  id,
  name,
  description,
  icon,
  useCases,
  tier,
  isSelected,
  onSelect,
}: TypeCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : `border-gray-200 bg-white shadow-sm hover:shadow-md ${tierColors[tier]}`
      }`}
      onClick={() => onSelect(id)}
    >
      {/* Header with icon and tier badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{icon}</div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierBadgeColors[tier]}`}
        >
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      </div>

      {/* Title and description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

      {/* Use cases */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Use Cases
        </p>
        <ul className="space-y-1">
          {useCases.slice(0, 3).map((useCase, idx) => (
            <li key={idx} className="text-xs text-gray-600 flex items-start">
              <span className="mr-2 text-blue-500 font-bold">•</span>
              <span>{useCase.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select button */}
      <button
        onClick={() => onSelect(id)}
        className={`w-full py-2.5 px-3 rounded-lg font-semibold text-sm transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {isSelected ? '✓ Selected' : 'Select Agent'}
      </button>
    </div>
  );
}
