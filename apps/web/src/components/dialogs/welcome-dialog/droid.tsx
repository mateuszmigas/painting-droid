export const Droid = () => {
  const fill = "black";
  const stroke = "white";
  const strokeWidth = 2;

  return (
    <div className="w-96 h-96 bg-blue-900">
      <svg height={"300"} width={"200"} className="bg-red-900">
        {/* head */}
        <path
          transform="translate(50, 50)"
          d="M 0 50 A 50 50 0 0 1 100 50 L 0 50 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* eyes */}
        <circle
          cx="100"
          cy="70"
          r="10"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* mouth */}
        <rect
          x="80"
          y="90"
          width="40"
          height="10"
          fill={fill}
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

