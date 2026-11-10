import React from 'react';



export default function Logo({ className = 'h-8 w-8', size }) {
  return (
    <img
      src="/logo.svg"
      alt="RightWay"
      width={size}
      height={size}
      className={`rounded-md object-contain shrink-0 ${className}`}
    />
  );
}

