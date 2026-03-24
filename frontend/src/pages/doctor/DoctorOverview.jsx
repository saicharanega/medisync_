import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, DollarSign, Users, CheckCircle2, XCircle, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function DoctorOverview() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  const totalEarnings = appointments.filter((a) => a.paymentStatus === "paid" && a.status !== "cancelled").reduce((s, a) => s + a.fees, 0);
  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed" || a.status === "completed").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Dr. {user?.name?.split(' ')?.[0] || 'Doctor'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your practice today.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: "Total Earnings", value: `$${totalEarnings}`, color: "text-success bg-success/10" },
            { icon: Clock, label: "Pending", value: pending, color: "text-warning bg-warning/10" },
            { icon: Users, label: "Confirmed", value: confirmed, color: "text-primary bg-primary/10" },
            { icon: TrendingUp, label: "Completed", value: completed, color: "text-info bg-info/10" }
          ].map((stat, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <h2 className="font-semibold text-lg mb-4">Recent Appointments</h2>
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments found.</p>
          ) : (
            appointments.slice(0, 5).map((apt) => (
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
            ))
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}