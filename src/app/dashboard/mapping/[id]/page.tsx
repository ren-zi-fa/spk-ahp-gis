"use client";

import { useParams } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import MappingAlternatif from "../_components/MappingAlternatif";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { HasilPerengkinganData } from "@/types";
import { Loader2 } from "lucide-react";

export default function MappingPage() {
  const params = useParams<{ id: string }>();
  const {
    data: rangking,
    isLoading,
    error,
  } = useSWR<HasilPerengkinganData>(
    `/api/hasil-rangking/${params.id}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        <p className="mt-4 text-sm text-muted-foreground">Memuat hasil ranking...</p>
      </div>
    );
  }

  if (error || !rangking?.dataRangking) {
    return (
      <div className="text-center text-red-500 font-medium">
        Maaf, tidak ada hasil ranking yang tersimpan.
      </div>
    );
  }

  return (
    <ContentLayout title="Mapping">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MappingAlternatif analysisId={params.id} />
    </ContentLayout>
  );
}
