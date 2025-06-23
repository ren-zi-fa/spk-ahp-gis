"use client";

import { useParams } from "next/navigation";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import MappingAlternatif from "../_components/MappingAlternatif";

export default function MappingPage() {
  const params = useParams<{ id: string }>();


  return (
    <ContentLayout title="Mapping ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MappingAlternatif analysisId={params.id} />
    </ContentLayout>
  );
}
