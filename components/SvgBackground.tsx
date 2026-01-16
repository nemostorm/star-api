function SvgBackground() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0a0a0a', stopOpacity: 1 }} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#grad1)" />

        <circle cx="10%" cy="15%" r="1.5" fill="#60a5fa" opacity="0.6" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="85%" cy="25%" r="1" fill="#38bdf8" opacity="0.5" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="25%" cy="70%" r="1.2" fill="#7dd3fc" opacity="0.4" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="75%" cy="80%" r="1.3" fill="#60a5fa" opacity="0.5" filter="url(#glow)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50%" cy="40%" r="0.8" fill="#93c5fd" opacity="0.3" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="90%" cy="60%" r="1.1" fill="#38bdf8" opacity="0.4" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="15%" cy="45%" r="0.9" fill="#7dd3fc" opacity="0.5" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="60%" cy="20%" r="1.4" fill="#60a5fa" opacity="0.4" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40%" cy="85%" r="1" fill="#93c5fd" opacity="0.3" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="70%" cy="50%" r="0.7" fill="#38bdf8" opacity="0.4" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.2s" repeatCount="indefinite" />
        </circle>

        <g opacity="0.1">
          <path d="M0,100 Q250,80 500,100 T1000,100 T1500,100 T2000,100"
                stroke="#60a5fa"
                strokeWidth="0.5"
                fill="none">
            <animate attributeName="d"
                     values="M0,100 Q250,80 500,100 T1000,100 T1500,100 T2000,100;
                             M0,100 Q250,120 500,100 T1000,100 T1500,100 T2000,100;
                             M0,100 Q250,80 500,100 T1000,100 T1500,100 T2000,100"
                     dur="10s"
                     repeatCount="indefinite" />
          </path>
          <path d="M0,200 Q250,180 500,200 T1000,200 T1500,200 T2000,200"
                stroke="#38bdf8"
                strokeWidth="0.5"
                fill="none">
            <animate attributeName="d"
                     values="M0,200 Q250,180 500,200 T1000,200 T1500,200 T2000,200;
                             M0,200 Q250,220 500,200 T1000,200 T1500,200 T2000,200;
                             M0,200 Q250,180 500,200 T1000,200 T1500,200 T2000,200"
                     dur="12s"
                     repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    </div>
  );
}

export default SvgBackground;
