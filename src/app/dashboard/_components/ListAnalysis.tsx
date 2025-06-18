"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

type Analysis = {
  id: string;
  name: string;
};

export default function ListAnalysis() {
  const { data, error, isLoading } = useSWR<Analysis[]>(
    "/api/analysis",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div className=" space-x-4 mt-5">
      {data && data.length > 0 ? (
        <div className="grid grid-cols-5 space-x-4 gap-2">
          {data.map((item, index) => (
            <Card key={index}>
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
