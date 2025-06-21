"use client";
import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import AlternatifKritera from "../../_components/ManagementDataSPK/AlternatifKritera";
import useSWR from "swr";
import { Alternatif, Kriteria } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

export default function CreatePage() {
  const params = useParams<{ id: string }>();
  const { data: kriteriaData } = useSWR<Kriteria[]>(
    `/api/kriteria?analysisId=${params.id}`,
    fetcher
  );
  const { data: alternatifData } = useSWR<Alternatif[]>(
    `/api/alternatif?analysisId=${params.id}`,
    fetcher
  );
  const nextButton = () => {
    if (
      !kriteriaData ||
      kriteriaData.length === 0 ||
      !alternatifData ||
      alternatifData.length === 0
    ) {
      toast.error("Data kriteria dan alternatif belum lengkap");
      return;
    }
    router.push(`/dashboard/calculate/${params.id}`);
  };

  const router = useRouter();
  return (
    <ContentLayout title="Input Data">
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
              className="text-blue-500 font-bold"
              onClick={() => router.push(`/dashboard/create/${params.id}`)}
            >
              Input Data
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <button
                className="cursor-pointer hover:text-blue-500"
                onClick={nextButton}
              >
                Process Data
              </button>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AlternatifKritera id={params.id} />
    </ContentLayout>
  );
}
