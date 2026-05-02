import React from 'react';

const StocklyXLogo = ({ width = 200, height = 100 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Logo de StocklyX"
  >
    {/* Cubos apilados */}
    <rect x="10" y="60" width="20" height="20" fill="#0A1F44" />
    <rect x="30" y="40" width="20" height="20" fill="#0A1F44" />
    <rect x="50" y="20" width="20" height="20" fill="#0A1F44" />

    {/* Flecha ascendente */}
    <polyline
      points="10,80 30,60 50,40 70,20"
      fill="none"
      stroke="#0A1F44"
      strokeWidth="4"
    />
    <polygon points="70,20 65,25 75,25" fill="#0A1F44" />

    {/* Texto StocklyX */}
    <text
      x="90"
      y="65"
      fontFamily="Arial, sans-serif"
      fontSize="32"
      fill="#0A1F44"
    >
      StocklyX
    </text>
  </svg>
);

export default StocklyXLogo;
