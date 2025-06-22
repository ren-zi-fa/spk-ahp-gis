
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import InputAlternativesKriteria from "./_components/InputAlternativesKriteria";

export default function UsersPage() {
  return (
    <ContentLayout title="Analysis">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <InputAlternativesKriteria />
    </ContentLayout>
  );
}
