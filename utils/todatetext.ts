export const toDateText = (date: string) => {
  const dt = new Date(date);
  return (
    dt.toLocaleString("default", { month: "long" }) +
    " " +
    dt.getDate() +
    " " +
    dt.getFullYear()
  );
};
