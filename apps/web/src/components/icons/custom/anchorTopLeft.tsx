export const AnchorTopLeft = (props: {
  size: string | number;
  className?: string;
}) => {
  const { size, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-box-select ${className}`}
    >
      <path d="m9 9 10 10" />
      <path d="M19 9v10H9" />
      <path d="M3 3v14" />
      <path d="M3 3h12" />
    </svg>
  );
};

