'use client';

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { usePathname } from "next/navigation";
import ChatWidget from "@/components/ui/ChatWidget";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <div suppressHydrationWarning className="relative isolate">
          {children}
        </div>
      </AdminAuthProvider>
    </AuthProvider>
  );
}