import Layout from "@/components/layout/Layout";
import { mockAppointments } from "@/data/appointments";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Appointment } from "@/types";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter((a) => a.patientId === "user-1")
  );

  const cancel = (id: string) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
    toast.success("Appointment cancelled");
  };

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground mb-8">Manage your upcoming and past appointments</p>
        </ScrollReveal>

        {/* Upcoming */}
        <ScrollReveal delay={100}>
          <h2 className="font-semibold text-lg mb-4">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground mb-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-3 mb-10">
              {upcoming.map((apt) => (
                <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.specialization}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    <span className="font-semibold">${apt.fees}</span>
                    {apt.status !== "cancelled" && (
                      <Button variant="destructive" size="sm" onClick={() => cancel(apt.id)}>Cancel</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Past */}
        <ScrollReveal delay={200}>
          <h2 className="font-semibold text-lg mb-4">Past</h2>
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past appointments</p>
          ) : (
            <div className="space-y-3">
              {past.map((apt) => (
                <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
                  <div>
                    <p className="font-medium">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.specialization}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    <span className="font-semibold">${apt.fees}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </Layout>
  );
}
