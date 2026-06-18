import { Suspense } from "react";
import { AdminLoginPage } from "@/components/admin/admin-login-page";

export default function AdminLoginRoute() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  );
}
