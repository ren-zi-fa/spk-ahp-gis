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
export default function CalculatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  console.log("from calculate", params.id);
  return (
    <ContentLayout title="AHP Process  ">
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
        </BreadcrumbList>
      </Breadcrumb>
      <Pairwaise analysisId={params.id} />
    </ContentLayout>
  );
}
