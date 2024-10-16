"use client";
import { TransactionType } from "@/utils";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight, Input, SearchIcon } from "@components";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [input, setInput] = useState("");
  const results = useMemo(() => {
    if (input == "") return transactions;
    return transactions.filter(
      (transaction) =>
        (transaction.firstName + " " + transaction.lastName).includes(input) ||
        transaction.email.includes(input) ||
        transaction.phoneNumber.includes(input)
    );
  }, [input, transactions]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .neq("availableTourId", "-1")
          .order("id", {
            ascending: false,
          });
        if (error) {
          throw error;
        }
        setTransactions(data);
      } catch (error: any) {
        console.error("Error fetching tour transactions:", error.message);
      }
    };
    fetchTransactions();
  }, []);
  return (
    <div className="p-4 flex-1">
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">Transactions</div>
        <div className="flex flex-1 justify-end items-end">
          <div className="min-w-64">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search"
              type="text"
              icon={<SearchIcon />}
            />
          </div>
        </div>
      </div>
      <table className="border overflow-scroll w-full bg-white rounded-md">
        <tr>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            ID
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Status
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Method
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            TransactionID
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Amount
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            P-Type
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-40">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Email
          </th>
          {/* <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Nationality
          </th> */}
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            People
          </th>

          <th className="text-left px-3 py-2 font-semibold md:text-lg max-w-12 border-b w-12"></th>
        </tr>
        {results.map(
          (
            {
              id,
              firstName,
              lastName,
              email,
              nationality,
              peopleCount,
              deposit,
              transactionId,
              transactionDetail,
              paymentType,
              paymentMethod,
            },
            i
          ) => (
            <tr
              className="hover:bg-black/5 table-row hover:bg-grey/50 cursor-pointer"
              key={i}
            >
              <td className="py-2 px-3 ">{id}</td>
              <td className="text-left px-3 py-2 font-semibold md:text-lg">
                {transactionDetail?.errorCode === "000" ? (
                  <div
                    className={`border border-green-500 bg-green-500/10 w-min px-3 py-1 text-sm rounded text-green-500`}
                  >
                    Success
                  </div>
                ) : (
                  <div
                    className={`border border-yellow-500 bg-yellow-500/10 w-min px-3 py-1 text-sm rounded text-yellow-500`}
                  >
                    Awaiting
                  </div>
                )}
              </td>
              <td className="px-3 py-2">{paymentMethod}</td>
              <td className="px-3 py-2">{transactionId}</td>
              <td className="px-3 py-2 font-semibold">${deposit}</td>
              <td className="px-3 py-2 font-semibold uppercase">
                {paymentType}
              </td>
              <td className="py-2 px-3 ">{firstName + " " + lastName}</td>
              <td className="px-3 py-2">{email}</td>
              {/* <td className="px-3 py-2">{nationality}</td> */}
              <td className="px-3 py-2">{peopleCount}</td>
              <td className="">
                <div className="flex items-center justify-center">
                  <Link
                    className="font-bold rounded-full ripple p-3 max-w-12 max-h-12"
                    href={`/admin/transactions/${id}`}
                  >
                    <ArrowRight color="black" />
                  </Link>
                </div>
              </td>
            </tr>
          )
        )}
      </table>
    </div>
  );
};

export default AdminTransactions;
