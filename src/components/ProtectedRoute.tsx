import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { AppRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
}

const ProtectedRoute = ({ children, requiredRole = "admin" }: ProtectedRouteProps) => {
  const { loading, session, isAdmin } = useAuth();
  const location = useLocation();

  if (loading || (session && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const roleSatisfied = requiredRole === "admin" ? isAdmin === true : false;

  if (!roleSatisfied) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Not authorised</h1>
        <p className="text-muted-foreground">Your account does not have access to the admin area.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
