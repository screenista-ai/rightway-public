import React from 'react';



export default function Logo({ className = 'h-8 w-8', size }) {
  return (
    <img
      src="/logo.svg"
      alt="RightWay AI"
      width={size}
      height={size}
      className={`rounded-lg object-contain shrink-0 shadow-sm ${className}`}
    />
  );
}

