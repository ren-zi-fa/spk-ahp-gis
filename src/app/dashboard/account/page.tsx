import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default function ManageUser() {
  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ContentLayout>
  );
}
