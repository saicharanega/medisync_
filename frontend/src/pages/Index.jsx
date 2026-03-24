import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/components/doctors/DoctorCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Search, Shield, CalendarCheck, CreditCard, Star, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

const stats = [
  { label: "Active Doctors", value: "148" },
  { label: "Appointments Booked", value: "12,340" },
  { label: "Patient Satisfaction", value: "97.3%" },
  { label: "Specializations", value: "24" }
];

const steps = [
  { icon: Search, title: "Find a Doctor", desc: "Browse specialists or search by condition. Filter by rating, experience, and availability." },
  { icon: CalendarCheck, title: "Book a Slot", desc: "Pick a date and time that works for you. Real-time availability with instant confirmation." },
  { icon: CreditCard, title: "Pay Securely", desc: "Complete payment through our encrypted gateway. Your health data stays private." },
  { icon: Shield, title: "Get Care", desc: "Show up for your appointment. Receive follow-up notes and prescriptions digitally." }
];

export default function Index() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get('/api/doctors')
      .then(res => {
        const formatted = res.data.map(d => ({
          ...d,
          name: d.userId?.name || 'Unknown Doctor',
        }));
        setFeatured(formatted.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-2xl">
            <ScrollReveal>
              <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-4">Trusted Healthcare Platform</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
                Healthcare appointments, simplified
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg text-wrap-pretty">
                Connect with qualified doctors, book appointments in seconds, and manage your health journey — all in one place.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/doctors">Find a Doctor <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
                <Button asChild variant="hero-outline" size="xl">
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats */}
          <ScrollReveal delay={350}>
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) =>
              <div key={i} className="bg-card rounded-xl border p-5 text-center shadow-sm">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-lg mx-auto mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">How It Works</p>
              <h2 className="text-3xl font-bold">Four steps to better health</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) =>
            <ScrollReveal key={i} delay={i * 100}>
                <div className="p-6 rounded-xl border bg-background hover:shadow-md transition-shadow duration-300">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-wrap-pretty">{step.desc}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Top Rated</p>
                <h2 className="text-3xl font-bold">Featured doctors</h2>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex">
                <Link to="/doctors">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((doc, i) =>
            <ScrollReveal key={doc.id} delay={i * 80}>
                <DoctorCard doctor={doc} />
              </ScrollReveal>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/doctors">View All Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-card">
        <div className="container max-w-3xl text-center">
          <ScrollReveal>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-warning fill-warning" />)}
            </div>
            <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-wrap-pretty">
              "MediSync made finding a specialist incredibly easy. I booked a cardiologist within minutes and the whole experience — from payment to consultation — was seamless."
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold">Daniela Ferreira</p>
              <p className="text-sm text-muted-foreground">Patient since 2024</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <ScrollReveal>
            <div className="bg-primary rounded-2xl p-10 sm:p-14 text-center text-primary-foreground">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to take charge of your health?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                Join thousands of patients who trust MediSync for their healthcare needs.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="xl" variant="secondary">
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button asChild size="xl" variant="hero-outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/doctors">Browse Doctors</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>);

}