import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CalendarDays, Clock, Loader2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function AdminAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      axios.get('/api/admin/appointments', { headers: { Authorization: `Bearer ${user.token}` } })
        .then(res => {
          const formatted = res.data.map(apt => ({
            id: apt._id,
            patientName: apt.patientId?.name || 'Unknown Patient',
            doctorName: apt.doctorId?.userId?.name || 'Unknown Doctor',
            specialization: apt.doctorId?.specialization || 'General',
            date: apt.date,
            time: apt.time,
            status: apt.status,
            paymentStatus: apt.paymentStatus,
            fees: apt.fees
          }));
          setAppointments(formatted);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const cancelAppointment = async (id) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: "cancelled" }, { headers: { Authorization: `Bearer ${user.token}` } });
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
      toast.success("Appointment cancelled by Admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">All Appointments</h1>
          <p className="text-muted-foreground mt-1">Platform-wide appointment history and status</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No appointments found.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <p className="font-medium">{apt.patientName} &rarr; {apt.doctorName}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    <span className="text-xs">{apt.specialization}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 max-sm:items-start max-sm:mt-3">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    <StatusBadge status={apt.paymentStatus} />
                    <span className="font-semibold tabular-nums px-3 py-1 bg-secondary rounded-lg">${apt.fees}</span>
                  </div>
                  {(apt.status === "pending" || apt.status === "confirmed") && (
                    <Button variant="destructive" size="sm" onClick={() => cancelAppointment(apt.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Force Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}