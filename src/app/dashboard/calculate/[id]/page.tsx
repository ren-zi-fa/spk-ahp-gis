"use client";

import { useParams, useRouter } from "next/navigation";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Pairwaise from "../_components/Pairwaise";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Analysis } from "@/types";

export type HasilPerengkinganResponse = {
  id: string;
  dataRangking: Record<string, number>;
  createdAt: string;
  analysisId: string;
};

export default function CalculatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data } = useSWR<HasilPerengkinganResponse>(
    `/api/hasil-rangking?analysisId=${params.id}`,
    fetcher
  );
  const { data: analysisData } = useSWR<Analysis>(
    `/api/analysis/${params.id}`,
    fetcher
  );
  return (
    <ContentLayout
      title={"Process AHP " + (analysisData ? analysisData.name : "")}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Analysis</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage
              className="cursor-pointer hover:text-blue-500"
              onClick={() => router.push(`/dashboard/create/${params.id}`)}
            >
              Input Data
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <button
                className="font-bold text-blue-500 "
                onClick={() => router.push(`/dashboard/calculate/${params.id}`)}
              >
                Process Data
              </button>
            </BreadcrumbPage>
          </BreadcrumbItem>
          {data && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <button
                    className="cursor-pointer hover:text-blue-500 "
                    onClick={() =>
                      router.push(`/dashboard/result/${params.id}`)
                    }
                  >
                    Result Last Time
                  </button>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Pairwaise analysisId={params.id} />
    </ContentLayout>
  );
}
