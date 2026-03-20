import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">MediSync</span>
            </Link>
            <p className="text-sm text-muted-foreground text-wrap-pretty max-w-xs">
              Connecting patients with trusted healthcare professionals. Book appointments with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/doctors" className="hover:text-foreground transition-colors">Find Doctors</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Patient Login</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Doctor Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Specializations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cardiology</li>
              <li>Dermatology</li>
              <li>Pediatrics</li>
              <li>Neurology</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@medisync.com</li>
              <li>+1 (555) 234-5678</li>
              <li>412 Health Ave, Medical District</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MediSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
