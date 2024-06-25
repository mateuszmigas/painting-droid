import { memo } from "react";

export const Droid = memo((props: { typingDurationSeconds: number }) => {
  const { typingDurationSeconds } = props;
  const color = "hsl(var(--ring))";
  const strokeWidth = 4;
  const commonProps = {
    fill: color,
    stroke: color,
    strokeWidth,
  };
  return (
    <svg viewBox="0 0 200 300">
      {/* head */}
      <path {...commonProps} d="M 50 100 A 50 50 0 0 1 150 100 L 50 100 Z" />
      {/* eye */}
      <circle
        {...commonProps}
        className="glowing-eye"
        fill={"red"}
        cx="100"
        cy="70"
        r="10"
      />
      {/* mouth */}
      <g transform="translate(80, 90)">
        <rect
          {...commonProps}
          fill="hsl(var(--background))"
          x="0"
          y="0"
          rx="2"
          ry="2"
          width="40"
          height="10"
        >
          <animate
            attributeName="height"
            from="0"
            to="10"
            begin="0s"
            dur="0.25s"
            repeatCount={(typingDurationSeconds / 0.25).toString()}
            values="10;15;10"
            keyTimes="0;0.7;1"
            keySplines=".42,0,.58,1;.42,0,.58,1"
            calcMode="spline"
          />
        </rect>
      </g>
      {/* torse */}
      <rect
        {...commonProps}
        x="50"
        y="110"
        width="100"
        height="100"
        rx="5"
        ry="5"
      />
      {/* left arm */}
      <rect
        {...commonProps}
        x="20"
        y="120"
        width="20"
        height="60"
        rx="5"
        ry="5"
      />

      <g {...commonProps} transform="translate(12, 195)" strokeWidth="4">
        <g transform="rotate(-45)">
          <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </g>
      </g>
      {/* right arm */}
      <rect
        {...commonProps}
        x="160"
        y="120"
        width="20"
        height="60"
        rx="5"
        ry="5"
      />
      <g {...commonProps} transform="translate(182, 205)">
        <g transform="rotate(180)">
          <path d="M10 2v2" />
          <path d="M14 2v4" />
          <path d="M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" />
          <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1" />
        </g>
      </g>
      {/* left leg */}
      <rect
        {...commonProps}
        x="65"
        y="220"
        width="20"
        height="40"
        rx="5"
        ry="5"
      />
      {/* right leg */}
      <rect
        {...commonProps}
        x="115"
        y="220"
        width="20"
        height="40"
        rx="5"
        ry="5"
      />
    </svg>
  );
});

