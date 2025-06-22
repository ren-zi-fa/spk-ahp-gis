import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { auth } from "@/lib/auth/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "sebuah system yang berfungsi untuk membandingkan alternatif wilayah kecamatan yang ada di pasaman barat untuk keperluan pemilihan lahan kosong ",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/"); 
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
