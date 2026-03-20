import { mockAppointments } from "@/data/appointments";
import { doctors } from "@/data/doctors";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";

export default function AdminAnalytics() {
  const total = mockAppointments.length;
  const completed = mockAppointments.filter(a => a.status === "completed").length;
  const pending = mockAppointments.filter(a => a.status === "pending").length;
  const cancelled = mockAppointments.filter(a => a.status === "cancelled").length;
  const confirmed = mockAppointments.filter(a => a.status === "confirmed").length;
  const revenue = mockAppointments.filter(a => a.paymentStatus === "paid").reduce((s, a) => s + a.fees, 0);

  const bySpec = doctors.reduce((acc, doc) => {
    const count = mockAppointments.filter(a => a.doctorId === doc.id).length;
    acc[doc.specialization] = (acc[doc.specialization] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const specEntries = Object.entries(bySpec).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Platform performance and insights</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: "Total Bookings", value: total, color: "text-primary bg-primary/10" },
            { icon: TrendingUp, label: "Completion Rate", value: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`, color: "text-success bg-success/10" },
            { icon: BarChart3, label: "Total Revenue", value: `$${revenue}`, color: "text-info bg-info/10" },
            { icon: PieChart, label: "Active Doctors", value: doctors.filter(d => d.available).length, color: "text-warning bg-warning/10" },
          ].map((s, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollReveal delay={160}>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Appointment Status Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Completed", count: completed, pct: Math.round((completed / total) * 100), color: "bg-success" },
                { label: "Confirmed", count: confirmed, pct: Math.round((confirmed / total) * 100), color: "bg-primary" },
                { label: "Pending", count: pending, pct: Math.round((pending / total) * 100), color: "bg-warning" },
                { label: "Cancelled", count: cancelled, pct: Math.round((cancelled / total) * 100), color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium tabular-nums">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Bookings by Specialization</h3>
            <div className="space-y-3">
              {specEntries.map(([spec, count]) => (
                <div key={spec} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{spec}</span>
                  <span className="text-sm font-semibold tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
