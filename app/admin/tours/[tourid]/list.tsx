import {
  CaretDownIcon,
  CaretUpIcon,
  ChevronDownIcon,
  Input,
  MinusIcon,
} from "@components";
import { Dispatch, FC, SetStateAction, useState } from "react";

type TourPlanType = {
  listData: any;
  setListData: Dispatch<SetStateAction<any>>;
  labelName: string;
  descriptionName: string;
};
export const List: FC<TourPlanType> = (props) => {
  const { setListData, listData, labelName, descriptionName } = props;
  const removeListData = (index: number) => {
    setListData([...listData.filter((_: any, ind: number) => ind != index)]);
  };
  const addListData = () => {
    setListData([
      ...listData,
      {
        [labelName]: "",
        [descriptionName]: "",
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
            updateListData={(label, description) => {
              setListData([
                ...listData.map((data: any, ind: number) =>
                  ind == index
                    ? {
                        [labelName]: label,
                        [descriptionName]: description,
                      }
                    : data
                ),
              ]);
            }}
            moveList={moveList}
            addListData={addListData}
            removeListData={removeListData}
            listLength={listData.length}
            label={nodeData[labelName]}
            description={nodeData[descriptionName]}
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
  label: string;
  description: string;
  listLength: number;
  updateListData: (label: string, description: string) => void;
  removeListData: (index: number) => void;
  moveList: (index: number, direction: "up" | "down") => void;
}

const ListItem = ({
  updateListData,
  label,
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
        <div className="flex flex-row items-center flex-1">
          {/* <span className="font-bold text-primary pr-2">DAY {index + 1}</span> */}
          <Input
            value={label}
            type="text"
            onChange={(e) => updateListData(e.target.value, description)}
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
        <textarea
          placeholder="Overview"
          className=" min-h-48 w-full p-4 border rounded-xl"
          value={description}
          onChange={(e) => updateListData(label, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
