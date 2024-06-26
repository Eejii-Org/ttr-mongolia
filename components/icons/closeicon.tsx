export const CloseIcon = ({
  color = "black",
  width = 32,
  height = 32,
}: {
  color?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35.9999 35.9999L24 24M24 24L12 12M24 24L36.0001 12M24 24L12 36.0001"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
