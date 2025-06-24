import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import TableAnalysis from "./_components/TableAnalysis";

export default function ManageAnalysisPage() {
  return (
    <ContentLayout title="Manage Analysis">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TableAnalysis />
    </ContentLayout>
  );
}
