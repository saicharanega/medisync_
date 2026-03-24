import Layout from "@/components/layout/Layout";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      axios.get('/api/appointments/my', { headers: { Authorization: `Bearer ${user.token}` } })
        .then(res => {
          const formatted = res.data.map(apt => ({
            ...apt,
            id: apt._id,
            patientName: apt.patientId?.name || user.name,
            doctorName: apt.doctorId?.userId?.name || 'Unknown Doctor',
            specialization: apt.doctorId?.specialization || 'General'
          }));
          setAppointments(formatted);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          toast.error("Failed to fetch appointments");
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const cancel = async (id) => {
    try {
      await axios.patch(`/api/appointments/${id}/status`, { status: "cancelled" }, { headers: { Authorization: `Bearer ${user.token}` } });
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
      toast.success("Appointment cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel");
    }
  };

  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  if (loading) {
     return <Layout><div className="flex justify-center items-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div></Layout>;
  }

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
                    <p className="font-medium text-lg">{user?.role === 'doctor' ? apt.patientName : apt.doctorName}</p>
                    <p className="text-sm text-primary font-medium mb-1">{user?.role === 'doctor' ? 'Patient' : apt.specialization}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{apt.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 max-sm:items-start max-sm:mt-2">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={apt.status} />
                      <span className="font-semibold px-3 py-1 bg-secondary rounded-lg">${apt.fees}</span>
                    </div>
                    {(apt.status === "pending" || apt.status === "confirmed") && (
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => cancel(apt.id)}>Cancel Booking</Button>
                      </div>
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
                <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70">
                  <div>
                    <p className="font-medium">{user?.role === 'doctor' ? apt.patientName : apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{user?.role === 'doctor' ? 'Patient' : apt.specialization}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={apt.status} />
                    <span className="text-sm font-medium text-muted-foreground">${apt.fees} Paid</span>
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