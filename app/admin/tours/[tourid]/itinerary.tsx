import {
  CaretDownIcon,
  CaretUpIcon,
  ChevronDownIcon,
  Input,
  MinusIcon,
  Tiptap,
} from "@components";
import { Dispatch, FC, SetStateAction, useState } from "react";

type TourPlanType = {
  listData: any;
  setListData: Dispatch<SetStateAction<any>>;
};
export const Itinierary: FC<TourPlanType> = (props) => {
  const { setListData, listData } = props;
  const removeListData = (index: number) => {
    setListData([...listData.filter((_: any, ind: number) => ind != index)]);
  };
  const addListData = () => {
    setListData([
      ...listData,
      {
        day: "",
        title: "",
        description: "",
      },
    ]);
  };
  const moveList = (index: number, direction: "up" | "down") => {
    let list = [...listData];
    if (direction == "up") {
      if (index == 0) return;
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      setListData([...list]);
      return;
    }
    if (index == listData.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    setListData([...list]);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="font-medium text-xl flex-1">
        {listData.map((nodeData: any, index: number) => (
          <ListItem
            {...nodeData}
            updateListData={(day, title, description) => {
              setListData([
                ...listData.map((data: any, ind: number) =>
                  ind == index
                    ? {
                        day: day,
                        title: title,
                        description: description,
                      }
                    : data
                ),
              ]);
            }}
            moveList={moveList}
            // addListData={addListData}
            removeListData={removeListData}
            listLength={listData.length}
            // label={nodeData.title}
            // description={nodeData.description}
            // day={nodeData.day | ""}
            index={index}
            key={index}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className="px-3 py-2 bg-quinary ripple font-medium"
          onClick={addListData}
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

interface DayType extends TourPlanType {
  index: number;
  day: string;
  title: string;
  description: string;
  listLength: number;
  updateListData: (day: string, title: string, description: string) => void;
  removeListData: (index: number) => void;
  moveList: (index: number, direction: "up" | "down") => void;
}

const ListItem = ({
  updateListData,
  day = "",
  title,
  description,
  index,
  listLength,
  removeListData,
  moveList,
}: DayType) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border ${index == 0 ? "" : "border-t-0"} ${
        index == 0 ? "rounded-tl rounded-tr" : ""
      } ${index == listLength - 1 ? "rounded-bl rounded-br" : ""}`}
    >
      <div
        className={`text-lg md:text-xl p-3 gap-4 flex flex-row justify-between items-center ${
          open ? "border-b" : ""
        }`}
      >
        <div className="flex flex-col">
          <button
            className={`${index == 0 ? "opacity-50" : "ripple"}`}
            disabled={index == 0}
            onClick={() => moveList(index, "up")}
          >
            <CaretUpIcon color="black" />
          </button>
          <button
            className={`${index == listLength - 1 ? "opacity-50" : "ripple"}`}
            onClick={() => moveList(index, "down")}
          >
            <CaretDownIcon color="black" />
          </button>
        </div>
        <div className="flex flex-row items-center">
          {/* <span className="font-bold text-primary pr-2">DAY {index + 1}</span> */}
          <Input
            value={day}
            type="text"
            onChange={(e) => updateListData(e.target.value, title, description)}
          />
        </div>
        <div className="flex flex-row items-center flex-1">
          {/* <span className="font-bold text-primary pr-2">DAY {index + 1}</span> */}
          <Input
            value={title}
            type="text"
            onChange={(e) => updateListData(day, e.target.value, description)}
          />
        </div>
        <button
          className={`transition-all ripple rounded-full p-1 `}
          onClick={() => setOpen(!open)}
        >
          <div className={`${open ? "rotate-180" : ""}`}>
            <ChevronDownIcon />
          </div>
        </button>
        <button
          className={`transition-all ripple rounded-full p-1 `}
          onClick={() => removeListData(index)}
        >
          <div>
            <MinusIcon color={"red"} />
          </div>
        </button>
      </div>
      <div className={`${open ? "flex" : "hidden"} text-base p-3 font-normal`}>
        <Tiptap
          className="min-h-48 w-full p-2 flex-1 border rounded-2xl"
          content={description}
          setContent={(s: string) => {
            updateListData(day, title, s);
          }}
        />
        {/* <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={description}
          onChange={(e) => updateListData(label, e.target.value)}
        ></textarea> */}
      </div>
    </div>
  );
};
