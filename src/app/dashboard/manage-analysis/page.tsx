import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import TableAnalysis from "./_components/TableAnalysis";

export default function ManageAnalysisPage() {
  return (
    <ContentLayout title="Manage Analysis">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/dashboard/manage-analysis"
                className="font-bold text-blue-500 "
              >
                Manage Analysis
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TableAnalysis />
    </ContentLayout>
  );
}
