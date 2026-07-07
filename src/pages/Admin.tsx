import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { checkAdminStatus } from "@/lib/admin.functions";

export default function Admin() {
  useEffect(() => {
    document.title = "Admin — Lara";
  }, []);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkAdminStatus()
      .then(({ unlocked }) => {
        if (!unlocked) navigate("/admin/unlock", { replace: true });
        else setReady(true);
      })
      .catch(() => navigate("/admin/unlock", { replace: true }));
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
          Checking session…
        </div>
      </div>
    );
  }
  return <AdminDashboard />;
}