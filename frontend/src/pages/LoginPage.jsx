import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Heart, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await googleLogin(credentialResponse.credential);
    if (res) {
      toast.success("Successfully authenticated with Google!");
      if (res.role === 'admin') navigate("/admin");
      else if (res.role === 'doctor') navigate("/doctor-dashboard");
      else navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {toast.error("Please fill all fields");return;}
    
    try {
      const userData = await login(email, password);
      
      if (!userData) return; // Halt on failed login
      
      toast.success("Welcome back!");
      if (userData.role === 'admin') navigate("/admin");
      else if (userData.role === 'doctor') navigate("/doctor-dashboard");
      else navigate("/");
    } catch (err) {
      // Error is handled inside the login function typically, but just in case
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="container py-16 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 rounded-xl bg-primary items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your MediSync account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">Sign In</Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In Failed')}
                theme="filled_black"
                shape="rectangular"
                text="signin_with"
                size="large"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground pt-2">
              <p className="mb-2">
                Demo emails: <strong>alex@example.com</strong> (patient), <strong>sarah.mitchell@medisync.com</strong> (doctor), or <strong>admin@medisync.com</strong> (admin).
                <br/>
                <em>Note: Use the actual seeded passwords (e.g. 123456 for admin, password123 for others).</em>
              </p>
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>);

}