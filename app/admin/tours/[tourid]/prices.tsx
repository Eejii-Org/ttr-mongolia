import { PriceType } from "@/utils";
import { Input, MinusIcon } from "@components";
import { Dispatch, FC, SetStateAction, useState } from "react";

export const Prices = ({
  prices,
  setPrices,
}: {
  prices: PriceType[];
  setPrices: (newPrices: PriceType[]) => void;
}) => {
  // const [prices, setPrices] = useState([]);
  return (
    <div className="flex flex-col">
      <label className="pl-2 font-medium">Prices:</label>
      <List listData={prices} setListData={setPrices} />
    </div>
  );
};

type TourPlanType = {
  listData: any;
  setListData: Dispatch<SetStateAction<any>>;
};

const List: FC<TourPlanType> = (props) => {
  const { setListData, listData } = props;
  const removeListData = (index: number) => {
    setListData([...listData.filter((_: any, ind: number) => ind != index)]);
  };
  const addListData = () => {
    setListData([
      ...listData,
      {
        pricePerPerson: 1000,
        passengerCount:
          listData.length == 0 ? 1 : listData.at(-1).passengerCount + 1,
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
      <div className="font-medium text-xl flex-1 flex flex-row flex-wrap gap-3">
        {listData.map((nodeData: any, index: number) => (
          <ListItem
            {...nodeData}
            updateListData={(value, key) => {
              setListData([
                ...listData.map((data: any, ind: number) =>
                  ind == index
                    ? {
                        ...data,
                        [key]: value,
                      }
                    : data
                ),
              ]);
            }}
            moveList={moveList}
            addListData={addListData}
            removeListData={removeListData}
            listLength={listData.length}
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
  pricePerPerson: number;
  passengerCount: number;
  listLength: number;
  updateListData: (value: number, key: string) => void;
  removeListData: (index: number) => void;
  moveList: (index: number, direction: "up" | "down") => void;
}

const ListItem = ({
  updateListData,
  index,
  listLength,
  removeListData,
  passengerCount,
  pricePerPerson,
}: DayType) => {
  return (
    <div
      className={`border ${index == 0 ? "rounded-tl rounded-tr" : ""} ${
        index == listLength - 1 ? "rounded-bl rounded-br" : ""
      }`}
    >
      <div
        className={`text-lg md:text-xl p-3 gap-4 flex flex-row justify-between items-center`}
      >
        <div className="flex flex-row items-center flex-1 gap-3">
          <div className="flex flex-col">
            <span className="text-sm">Passenger Count:</span>
            <Input
              value={passengerCount}
              placeholder="Passenger Count"
              type="number"
              onChange={(e) =>
                updateListData(Number(e.target.value), "passengerCount")
              }
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Price Per Person:</span>
            <Input
              type="number"
              value={pricePerPerson}
              placeholder="Price Per Person"
              onChange={(e) =>
                updateListData(Number(e.target.value), "pricePerPerson")
              }
            />
          </div>
        </div>
        <button
          className={`transition-all ripple rounded-full p-1 `}
          onClick={() => removeListData(index)}
        >
          <div>
            <MinusIcon color={"red"} />
          </div>
        </button>
      </div>
    </div>
  );
};
