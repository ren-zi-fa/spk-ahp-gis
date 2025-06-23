import { auth } from "@/lib/auth/auth";

export default auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
