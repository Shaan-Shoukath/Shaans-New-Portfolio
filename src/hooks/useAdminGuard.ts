"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

export function useAdminGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, router, pathname]);

  return { user, loading };
}
