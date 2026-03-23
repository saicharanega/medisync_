import { mockAppointments } from "@/data/appointments";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";


const statusFilters = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(
    mockAppointments.filter((a) => a.doctorId === "dr-1")
  );
  const [filter, setFilter] = useState("all");

  const accept = (id) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "confirmed" } : a));
    toast.success("Appointment confirmed");
  };
  const reject = (id) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
    toast.success("Appointment rejected");
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage all your patient appointments</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {statusFilters.map((s) =>
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              filter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`
              }>
              
                {s}
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-3">
          {filtered.length === 0 &&
          <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>No {filter} appointments found.</p>
            </div>
          }
          {filtered.map((apt) =>
          <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="font-medium">{apt.patientName}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                  <span className="font-medium text-foreground tabular-nums">${apt.fees}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={apt.status} />
                <StatusBadge status={apt.paymentStatus} />
                {apt.status === "pending" &&
              <>
                    <Button variant="success" size="sm" onClick={() => accept(apt.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => reject(apt.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </>
              }
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>);

}