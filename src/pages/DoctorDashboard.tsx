import Layout from "@/components/layout/Layout";
import { mockAppointments } from "@/data/appointments";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, DollarSign, Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Appointment } from "@/types";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter((a) => a.doctorId === "dr-1")
  );

  const accept = (id: string) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "confirmed" } : a));
    toast.success("Appointment confirmed");
  };

  const reject = (id: string) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
    toast.success("Appointment rejected");
  };

  const totalEarnings = appointments.filter(a => a.paymentStatus === "paid" && a.status !== "cancelled").reduce((s, a) => s + a.fees, 0);
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed" || a.status === "completed").length;

  return (
    <Layout>
      <div className="container py-10">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage your appointments and availability</p>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={80}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-success" /></div>
                <span className="text-sm text-muted-foreground">Earnings</span>
              </div>
              <p className="text-2xl font-bold">${totalEarnings}</p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center"><Clock className="h-4 w-4 text-warning" /></div>
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold">{pending}</p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-4 w-4 text-primary" /></div>
                <span className="text-sm text-muted-foreground">Confirmed</span>
              </div>
              <p className="text-2xl font-bold">{confirmed}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Appointments */}
        <ScrollReveal delay={160}>
          <h2 className="font-semibold text-lg mb-4">All Appointments</h2>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{apt.patientName}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    <span className="font-medium text-foreground">${apt.fees}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  {apt.status === "pending" && (
                    <>
                      <Button variant="success" size="sm" onClick={() => accept(apt.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => reject(apt.id)}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
}
