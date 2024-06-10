export const Droid = () => {
  const fill = "blue";
  const stroke = "white";
  const strokeWidth = 2;
  const duration = "1s";
  return (
    <div className="w-96_ h-96_">
      <svg height={"300"} width={"200"} className="border">
        {/* head */}
        <path
          d="M 50 100 A 50 50 0 0 1 150 100 L 50 100 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0,160"
            to="0,0"
            dur={duration}
            fill="freeze"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 50 50; 360 50 50"
            keyTimes="0; 1"
            dur="2s"
            additive="sum"
          />
        </path>
        {/* eyes */}
        <circle
          cx="100"
          cy="70"
          r="10"
          fill={"red"}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* mouth */}
        <rect
          x="80"
          y="90"
          width="40"
          height="10"
          fill={"black"}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* torse */}
        <rect
          x="50"
          y="110"
          width="100"
          height="100"
          rx="5"
          ry="5"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* left arm */}
        <rect
          x="20"
          y="120"
          width="20"
          height="80"
          rx="5"
          ry="5"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* right arm */}
        <rect
          x="160"
          y="120"
          width="20"
          height="80"
          rx="5"
          ry="5"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* left leg */}
        <rect
          x="65"
          y="220"
          width="20"
          height="40"
          rx="5"
          ry="5"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* right leg */}
        <rect
          x="115"
          y="220"
          width="20"
          height="40"
          rx="5"
          ry="5"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
};

