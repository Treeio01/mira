import { memo } from 'react';

export const WarningIcon = memo(function WarningIcon() {
  return (
    <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#wi_shadow)">
        <rect width="55" height="55" rx="12" fill="url(#wi_grad)" />
        <path
          d="M27.5 14.25C26.823 14.25 26.205 14.825 26.25 15.5L26.875 32.375C26.875 32.541 26.941 32.7 27.058 32.817C27.175 32.934 27.334 33 27.5 33C27.666 33 27.825 32.934 27.942 32.817C28.059 32.7 28.125 32.541 28.125 32.375L28.75 15.5C28.795 14.825 28.177 14.25 27.5 14.25Z"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M27.5 41.75C28.19 41.75 28.75 41.19 28.75 40.5C28.75 39.81 28.19 39.25 27.5 39.25C26.81 39.25 26.25 39.81 26.25 40.5C26.25 41.19 26.81 41.75 27.5 41.75Z"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter id="wi_shadow" x="0" y="0" width="55" height="59" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" />
          <feBlend in="SourceGraphic" in2="bg" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4.7" />
          <feComposite in2="ha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend in2="shape" result="fx" />
        </filter>
        <linearGradient id="wi_grad" x1="27.5" y1="0" x2="27.5" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary)" />
          <stop offset="1" stopColor="#3D1099" />
        </linearGradient>
      </defs>
    </svg>
  );
});
