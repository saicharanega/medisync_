import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, CheckCircle2, XCircle, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

const statusFilters = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.token) {
      axios.get('/api/appointments/my', { headers: { Authorization: `Bearer ${user.token}` } })
        .then(res => {
          const formatted = res.data.map(apt => ({
            id: apt._id,
            patientName: apt.patientId?.name || 'Unknown Patient',
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

  const updateStatus = async (id, statusText) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: statusText }, { headers: { Authorization: `Bearer ${user.token}` } });
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: statusText } : a));
      toast.success(`Appointment ${statusText}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage all your patient appointments</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  filter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>No {filter} appointments found.</p>
            </div>
          )}
          {filtered.map((apt) => (
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
                {apt.status === "pending" && (
                  <>
                    <Button variant="success" size="sm" onClick={() => updateStatus(apt.id, 'confirmed')}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => updateStatus(apt.id, 'cancelled')}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </>
                )}
                {apt.status === "confirmed" && (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => updateStatus(apt.id, 'completed')} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => updateStatus(apt.id, 'cancelled')}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}