import React from 'react';

export default function MisisSiomaiLogo({ className = "w-12 h-12" }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Green Circle */}
        <circle cx="100" cy="100" r="94" fill="#166534" stroke="#15803d" strokeWidth="6" />

        {/* Inner subtle ring */}
        <circle cx="100" cy="100" r="88" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />

        {/* Text: "Misis" in script font with white outline */}
        <text
          x="100"
          y="72"
          textAnchor="middle"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="4"
          paintOrder="stroke fill"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontWeight="bold"
          fontSize="42"
        >
          Misis
        </text>

        {/* Text: "Siomai" in bold white */}
        <text
          x="100"
          y="120"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="40"
          letterSpacing="1"
        >
          Siomai
        </text>

        {/* Text: "Cebu" in clean white */}
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fill="#fef08a"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="22"
          letterSpacing="2"
        >
          CEBU
        </text>
      </svg>
    </div>
  );
}
