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
        height="80"
        rx="5"
        ry="5"
      />
      {/* right arm */}
      <rect
        {...commonProps}
        x="160"
        y="120"
        width="20"
        height="80"
        rx="5"
        ry="5"
      />
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

