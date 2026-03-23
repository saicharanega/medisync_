import { mockAppointments } from "@/data/appointments";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CalendarDays, Clock } from "lucide-react";

export default function AdminAppointments() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">All Appointments</h1>
          <p className="text-muted-foreground mt-1">Platform-wide appointment history and status</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-3">
          {mockAppointments.map((apt) =>
          <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="font-medium">{apt.patientName} → {apt.doctorName}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                  <span className="text-xs">{apt.specialization}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={apt.status} />
                <StatusBadge status={apt.paymentStatus} />
                <span className="font-semibold tabular-nums">${apt.fees}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>);

}