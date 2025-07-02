"use client";
import MyLoading from "@/components/MyLoading";
import { Card, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import useSWR from "swr";

type Analysis = {
  id: string;
  name: string;
};

export default function ListAnalysis() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<Analysis[]>(
    "/api/analysis",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <MyLoading />;
  return (
    <div className=" space-x-4 mt-5">
      <div
        className="flex flex-col md:flex-row items-center text-center space-x-2 p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        role="alert"
      >
        <CircleAlertIcon />
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium ">
            Click Nama Analysis di bawah untuk melakukan process AHP
          </span>
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 space-x-4 gap-2">
          {data.map((item, index) => (
            <Card
              key={index}
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-sm shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 "
              onClick={() => router.push(`/dashboard/create/${item.id}`)}
            >
              <CardTitle className="text-center cursor-pointer break-words whitespace-normal">
                {item.name}
              </CardTitle>
            </Card>
          ))}
        </div>
      ) : (
        <p>Data kosong</p>
      )}
    </div>
  );
}
