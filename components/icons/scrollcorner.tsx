type PropsType = {
  side?: "left" | "right";
};
export const ScrollCorner = (props: PropsType) => {
  const { side = "left" } = props;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={
          side == "left"
            ? "M16 16H0C8.83656 16 16 8.83656 16 0V16Z"
            : "M0 16H16C7.16344 16 0 8.83656 0 0V16Z"
        }
        fill="white"
      />
    </svg>
  );
};

// <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16H16C7.16344 16 0 8.83656 0 0V16Z" fill="white"/>
// </svg>
