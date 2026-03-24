import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Users, Stethoscope, CalendarDays, DollarSign, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function AdminOverview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.token) {
      axios.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${user.token}` } })
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!data) {
     return <div className="flex justify-center items-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;
  }

  const stats = [
    { icon: Users, label: "Total Patients", value: data.totalUsers, color: "text-primary bg-primary/10" },
    { icon: Stethoscope, label: "Doctors", value: data.totalDoctors, color: "text-info bg-info/10" },
    { icon: CalendarDays, label: "Appointments", value: data.totalAppointments, color: "text-warning bg-warning/10" },
    { icon: DollarSign, label: "Revenue", value: `$${data.totalRevenue}`, color: "text-success bg-success/10" }
  ];

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage the MediSync platform</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <h2 className="font-semibold text-lg mb-4">Recent Appointments</h2>
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Doctor</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAppointments.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted-foreground">No recent appointments</td></tr>
                ) : (
                  data.recentAppointments.map((apt) => (
                    <tr key={apt._id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{apt.patientId?.name || 'Unknown'}</td>
                      <td className="px-4 py-3">{apt.doctorId?.userId?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{apt.date} {apt.time}</td>
                      <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">${apt.fees}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}