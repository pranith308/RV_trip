type MountainsProps = {
  variant: 'hero' | 'strip'
}

export function Mountains({ variant }: MountainsProps) {
  const tall = variant === 'hero'
  return (
    <svg
      className={`mountains mountains-${variant}`}
      viewBox={tall ? '0 0 400 150' : '0 0 400 56'}
      aria-hidden="true"
    >
      <rect width="400" height={tall ? 150 : 56} fill="#7ba3b8" />
      {tall && <circle cx="318" cy="38" r="22" fill="#e2c36a" />}
      <path
        fill="#1e3d56"
        d={
          tall
            ? 'M0 150 L0 92 L70 40 L120 78 L175 28 L250 88 L310 48 L400 96 L400 150 Z'
            : 'M0 56 L0 28 L70 8 L120 26 L175 4 L250 30 L310 12 L400 32 L400 56 Z'
        }
      />
      <path
        fill="#2c4a3e"
        d={
          tall
            ? 'M0 150 L0 110 L90 62 L150 98 L210 70 L280 108 L360 80 L400 108 L400 150 Z'
            : 'M0 56 L0 36 L90 18 L150 34 L210 22 L280 38 L360 24 L400 36 L400 56 Z'
        }
      />
      <path fill="#1a3329" d={tall ? 'M0 150 V128 H400 V150 Z' : 'M0 56 V48 H400 V56 Z'} />
      {tall && (
        <g fill="#c4471a">
          <rect x="46" y="118" width="36" height="16" rx="1" />
          <rect x="54" y="110" width="14" height="10" />
        </g>
      )}
    </svg>
  )
}
