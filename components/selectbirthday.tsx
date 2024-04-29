import { useMemo } from "react";

export const SelectBirthday = ({
  onChange,
  value,
}: {
  onChange: (newValue: string) => void;
  value: string;
}) => {
  const { year, month, date } = useMemo(() => {
    const [year, month, date] = value.split("-");
    return {
      year,
      month,
      date,
    };
  }, [value]);
  return (
    <div>
      <div className="text-base font-semibold lg:text-lg">Date of Birth</div>
      <div className="flex flex-row gap-3">
        <div className="flex-1">
          <label className="font-medium">Year:</label>
          <input
            value={year}
            required
            onChange={(e) =>
              onChange(e.target.value + "-" + month + "-" + date)
            }
            type={"number"}
            placeholder="2000"
            min={1900}
            max={new Date().getFullYear()}
            className="text-base rounded px-4 py-3 w-full outline-none border"
          />
        </div>

        <div className="flex-1">
          <label className="font-medium">Month:</label>
          <input
            value={month}
            required
            onChange={(e) => onChange(year + "-" + e.target.value + "-" + date)}
            type={"number"}
            placeholder={"Month"}
            min={1}
            max={12}
            className="text-base rounded px-4 py-3 w-full outline-none border "
          />
        </div>

        <div className="flex-1">
          <label className="font-medium">Day:</label>
          <input
            value={date}
            required
            onChange={(e) =>
              onChange(year + "-" + month + "-" + e.target.value)
            }
            type={"number"}
            min={1}
            max={31}
            placeholder="Day"
            className="text-base rounded px-4 py-3 w-full outline-none border "
          />
        </div>
      </div>
    </div>
  );
};
