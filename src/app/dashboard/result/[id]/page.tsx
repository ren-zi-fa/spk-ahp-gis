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
import ResultCalculation from "../_components/ResultCalculation";
import useSWR from "swr";
import { Analysis } from "@/types";
import { fetcher } from "@/lib/fetcher";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: analysisData } = useSWR<Analysis>(
    `/api/analysis/${id}`,
    fetcher
  );
  return (
    <ContentLayout title={"Result " + (analysisData ? analysisData.name : "")}>
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
              onClick={() => router.push(`/dashboard/create/${id}`)}
            >
              Input Data
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <button
                className="cursor-pointer hover:text-blue-500"
                onClick={() => router.push(`/dashboard/calculate/${id}`)}
              >
                Process Data
              </button>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold text-blue-500">
              Result
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ResultCalculation analysisId={id} />
    </ContentLayout>
  );
}
