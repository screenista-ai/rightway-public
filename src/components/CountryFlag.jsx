import React from 'react';

/**
 * Universal SVG Country Flag Component
 * Windows OS font natively omits country flag emojis (renders as letters DE, NL, etc.).
 * This SVG component renders crisp, pixel-perfect flags on all operating systems and browsers.
 */
export default function CountryFlag({ code, country, className = 'h-5 w-7 shrink-0 rounded shadow-xs overflow-hidden inline-block align-middle' }) {
  const normalized = String(code || country || '').trim().toLowerCase();

  switch (normalized) {
    case 'de':
    case 'germany':
    case 'deutschland':
    case '🇩🇪':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Germany">
          <rect width="640" height="160" fill="#000000" />
          <rect y="160" width="640" height="160" fill="#DD0000" />
          <rect y="320" width="640" height="160" fill="#FFCE00" />
        </svg>
      );

    case 'nl':
    case 'netherlands':
    case 'holland':
    case 'nederland':
    case '🇳🇱':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Netherlands">
          <rect width="640" height="160" fill="#AE1C28" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#21468B" />
        </svg>
      );

    case 'se':
    case 'sweden':
    case 'sverige':
    case '🇸🇪':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Sweden">
          <rect width="640" height="480" fill="#006AA7" />
          <rect x="180" width="80" height="480" fill="#FECC00" />
          <rect y="200" width="640" height="80" fill="#FECC00" />
        </svg>
      );

    case 'fr':
    case 'france':
    case '🇫🇷':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of France">
          <rect width="213.3" height="480" fill="#002654" />
          <rect x="213.3" width="213.3" height="480" fill="#FFFFFF" />
          <rect x="426.6" width="213.4" height="480" fill="#ED2939" />
        </svg>
      );

    case 'ie':
    case 'ireland':
    case '🇮🇪':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Ireland">
          <rect width="213.3" height="480" fill="#169B62" />
          <rect x="213.3" width="213.3" height="480" fill="#FFFFFF" />
          <rect x="426.6" width="213.4" height="480" fill="#FF883E" />
        </svg>
      );

    case 'eu':
    case 'europe':
    case 'european union':
    case '🇪🇺':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of European Union">
          <rect width="640" height="480" fill="#003399" />
          <g fill="#FFCC00" transform="translate(320,240) scale(24)">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 5.5 * Math.sin(angle);
              const y = -5.5 * Math.cos(angle);
              return (
                <polygon
                  key={i}
                  points="0,-0.8 0.24,-0.25 0.76,-0.25 0.35,0.1 0.5,0.64 0,0.3 -0.5,0.64 -0.35,0.1 -0.76,-0.25 -0.24,-0.25"
                  transform={`translate(${x},${y})`}
                />
              );
            })}
          </g>
        </svg>
      );

    case 'es':
    case 'spain':
    case 'españa':
    case '🇪🇸':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Spain">
          <rect width="640" height="120" fill="#AA151B" />
          <rect y="120" width="640" height="240" fill="#F1BF00" />
          <rect y="360" width="640" height="120" fill="#AA151B" />
        </svg>
      );

    case 'ch':
    case 'switzerland':
    case 'schweiz':
    case '🇨🇭':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Switzerland">
          <rect width="640" height="480" fill="#D52B1E" />
          <rect x="270" y="110" width="100" height="260" fill="#FFFFFF" />
          <rect x="190" y="190" width="260" height="100" fill="#FFFFFF" />
        </svg>
      );

    case 'pl':
    case 'poland':
    case 'polska':
    case '🇵🇱':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Poland">
          <rect width="640" height="240" fill="#FFFFFF" />
          <rect y="240" width="640" height="240" fill="#DC143C" />
        </svg>
      );

    case 'ee':
    case 'estonia':
    case 'eesti':
    case '🇪🇪':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Estonia">
          <rect width="640" height="160" fill="#0072CE" />
          <rect y="160" width="640" height="160" fill="#000000" />
          <rect y="320" width="640" height="160" fill="#FFFFFF" />
        </svg>
      );

    case 'us':
    case 'usa':
    case 'united states':
    case 'united-states':
    case '🇺🇸':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of United States">
          <rect width="640" height="480" fill="#B22234" />
          <g fill="#FFFFFF">
            {[...Array(6)].map((_, i) => (
              <rect key={i} y={i * 73.85 + 36.9} width="640" height="36.9" />
            ))}
          </g>
          <rect width="256" height="259" fill="#3C3B6E" />
        </svg>
      );

    case 'ca':
    case 'canada':
    case '🇨🇦':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Canada">
          <rect width="640" height="480" fill="#FF0000" />
          <rect x="160" width="320" height="480" fill="#FFFFFF" />
          <path
            fill="#FF0000"
            d="M320 120l28 84h88l-72 52 28 84-72-52-72 52 28-84-72-52h88z"
          />
        </svg>
      );

    case 'au':
    case 'australia':
    case '🇦🇺':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of Australia">
          <rect width="640" height="480" fill="#00008B" />
          <g fill="#FFFFFF">
            <polygon points="320,80 332,116 370,116 340,140 352,176 320,152 288,176 300,140 270,116 308,116" />
            <polygon points="480,160 488,184 514,184 494,200 502,224 480,208 458,224 466,200 446,184 472,184" transform="scale(0.7) translate(200,80)" />
          </g>
          <rect width="280" height="240" fill="#00008B" />
          <g stroke="#FFFFFF" strokeWidth="20">
            <line x1="0" y1="0" x2="280" y2="240" />
            <line x1="280" y1="0" x2="0" y2="240" />
          </g>
          <g stroke="#CE1126" strokeWidth="12">
            <line x1="0" y1="0" x2="280" y2="240" />
            <line x1="280" y1="0" x2="0" y2="240" />
          </g>
          <rect x="110" width="60" height="240" fill="#FFFFFF" />
          <rect y="90" width="280" height="60" fill="#FFFFFF" />
          <rect x="122" width="36" height="240" fill="#CE1126" />
          <rect y="102" width="280" height="36" fill="#CE1126" />
        </svg>
      );

    case 'nz':
    case 'new zealand':
    case 'new-zealand':
    case '🇳🇿':
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Flag of New Zealand">
          <rect width="640" height="480" fill="#00247D" />
          <rect width="280" height="240" fill="#00247D" />
          <g stroke="#FFFFFF" strokeWidth="20">
            <line x1="0" y1="0" x2="280" y2="240" />
            <line x1="280" y1="0" x2="0" y2="240" />
          </g>
          <g stroke="#CC142B" strokeWidth="12">
            <line x1="0" y1="0" x2="280" y2="240" />
            <line x1="280" y1="0" x2="0" y2="240" />
          </g>
          <rect x="110" width="60" height="240" fill="#FFFFFF" />
          <rect y="90" width="280" height="60" fill="#FFFFFF" />
          <rect x="122" width="36" height="240" fill="#CC142B" />
          <rect y="102" width="280" height="36" fill="#CC142B" />
          <g fill="#CC142B" stroke="#FFFFFF" strokeWidth="2">
            <polygon points="420,140 428,164 454,164 434,180 442,204 420,188 398,204 406,180 386,164 412,164" />
            <polygon points="500,200 506,218 526,218 510,230 516,248 500,236 484,248 490,230 474,218 494,218" />
            <polygon points="460,280 466,298 486,298 470,310 476,328 460,316 444,328 450,310 434,298 454,298" />
            <polygon points="520,300 524,312 538,312 528,320 532,332 520,324 508,332 512,320 502,312 516,312" />
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 640 480" className={className} aria-label="Country Flag">
          <rect width="640" height="480" fill="#E4E4E7" />
          <circle cx="320" cy="240" r="120" fill="#A1A1AA" />
        </svg>
      );
  }
}

