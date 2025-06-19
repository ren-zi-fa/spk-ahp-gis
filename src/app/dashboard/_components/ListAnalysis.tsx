"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
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
  if (isLoading) return <div>loading...</div>;
  return (
    <div className=" space-x-4 mt-5">
      <h1 className="my-2">Click Analysis To Process The Calculation</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-5 space-x-4 gap-2">
          {data.map((item, index) => (
            
            <Card
              key={index}
              className="cursor-pointer hover:bg-white/10"
              onClick={() => router.push(`/dashboard/create/${item.id}`)}
            >
              <CardTitle className="text-center">{item.name}</CardTitle>
            </Card>
          ))}
        </div>
      ) : (
        <p>Data kosong</p>
      )}
    </div>
  );
}
