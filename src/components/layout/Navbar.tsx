import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor-dashboard" : "/my-appointments";

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">MediSync</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/doctors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Doctors</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-2 border-l">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-3">
            <Link to="/" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/doctors" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Doctors</Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Button variant="ghost" className="justify-start" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Log in</Button>
                <Button className="justify-start" onClick={() => { navigate("/register"); setMobileOpen(false); }}>Sign up</Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
