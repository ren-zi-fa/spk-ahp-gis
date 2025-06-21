import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "sebuah system yang berfungsi untuk membandingkan alternatif wilayah kecamatan yang ada di pasaman barat untuk keperluan pemilihan lahan kosong ",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
