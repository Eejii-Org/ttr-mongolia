"use client";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight, Input, Modal, NewInput, SearchIcon } from "@components";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<CustomTransactionType[]>([]);
  const [issueOpen, setIssueOpen] = useState(false);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState<number>();
  const [note, setNote] = useState<string>("");
  const [issueLoading, setIssueLoading] = useState(false);
  const [newIssue, setNewIssue] = useState<CustomTransactionType | null>(null);
  const results = useMemo(() => {
    if (input == "") return transactions;
    return transactions.filter(
      (transaction) =>
        (transaction.firstName + " " + transaction.lastName).includes(input) ||
        transaction.email.includes(input) ||
        transaction.phoneNumber.includes(input)
    );
  }, [input, transactions]);
  const issueCustomTransaction = async () => {
    setIssueLoading(true);
    try {
      const { data, error } = await supabase
        .from("customTransactions")
        .insert({
          amount,
          note,
        })
        .select("*");
      if (data) {
        setNewIssue(data[0] as CustomTransactionType);
      } else {
        console.error("Error creating custom transaction");
      }
      setIssueLoading(false);
    } catch (error: any) {
      console.error("Error creating custom transaction:", error.message);
      setIssueLoading(false);
    }
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("customTransactions")
          .select()
          .order("created_at", {
            ascending: false,
          });
        if (error) {
          throw error;
        }
        setTransactions(data);
      } catch (error: any) {
        console.error("Error fetching custom transactions:", error.message);
      }
    };
    fetchTransactions();
  }, []);
  return (
    <div className="p-4 flex-1">
      <Modal open={issueOpen} close={() => setIssueOpen(false)}>
        <div className="bg-white p-5 rounded-2xl min-w-[400px] flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-center">
            Create Transaction
          </h1>

          {newIssue ? (
            <>
              <NewInput
                type="text"
                label="Transaction Link:"
                value={"https://www.ttrmongolia.com/cp?issue=" + newIssue.id}
                disabled
              />
              <button
                className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://www.ttrmongolia.com/cp?issue=" + newIssue.id
                  );
                  alert("Copied");
                }}
              >
                Copy transaction link
              </button>
            </>
          ) : (
            <>
              <NewInput
                label="Amount:"
                type="number"
                value={amount || 0}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <NewInput
                label="Note:"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                className="bg-primary px-4 py-3 width-full text-center text-white whitespace-nowrap font-bold ripple rounded-2xl"
                onClick={issueCustomTransaction}
              >
                {issueLoading ? "Loading..." : "Issue Transaction"}
              </button>
            </>
          )}
        </div>
      </Modal>
      <div className="flex flex-row justify-between pb-4">
        <div className="text-2xl md:text-4xl font-semibold">
          Custom Transactions
        </div>
        <div className="flex flex-1 justify-end items-end gap-4">
          <button
            className="cursor-pointer ripple bg-primary px-4 h-full flex-row text-tertiary items-center rounded hidden md:flex"
            onClick={() => setIssueOpen(true)}
          >
            Issue Custom Transaction
          </button>
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
            TransactionID
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Amount
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b w-40">
            Name
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            Email
          </th>
          <th className="text-left px-3 py-2 font-semibold md:text-lg  border-b">
            PhoneNumber
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
              phoneNumber,
              amount,
              transactionId,
              transactionDetail,
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
              <td className="px-3 py-2">{transactionId}</td>
              <td className="px-3 py-2 font-semibold">${amount}</td>
              <td className="py-2 px-3 ">{firstName + " " + lastName}</td>
              <td className="px-3 py-2">{email}</td>
              <td className="px-3 py-2">{phoneNumber}</td>
              {/* <td className="px-3 py-2">{nationality}</td>
              <td className="px-3 py-2">{peopleCount}</td> */}
              <td className="">
                <div className="flex items-center justify-center">
                  <Link
                    className="font-bold rounded-full ripple p-3 max-w-12 max-h-12"
                    href={`/admin/customtransactions/${id}`}
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
