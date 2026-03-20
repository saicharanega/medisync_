import { mockAppointments } from "@/data/appointments";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StatusBadge from "@/components/ui/StatusBadge";
import { DollarSign, TrendingUp, CalendarDays, CreditCard } from "lucide-react";

export default function DoctorEarnings() {
  const myAppointments = mockAppointments.filter(a => a.doctorId === "dr-1");
  const paid = myAppointments.filter(a => a.paymentStatus === "paid" && a.status !== "cancelled");
  const totalEarnings = paid.reduce((s, a) => s + a.fees, 0);
  const avgPerVisit = paid.length > 0 ? Math.round(totalEarnings / paid.length) : 0;
  const pendingPayments = myAppointments.filter(a => a.paymentStatus === "pending").length;

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your revenue and payment history</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: DollarSign, label: "Total Earnings", value: `$${totalEarnings}`, color: "text-success bg-success/10" },
            { icon: TrendingUp, label: "Avg. Per Visit", value: `$${avgPerVisit}`, color: "text-primary bg-primary/10" },
            { icon: CreditCard, label: "Pending Payments", value: pendingPayments, color: "text-warning bg-warning/10" },
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
        <h2 className="font-semibold text-lg mb-4">Payment History</h2>
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map((apt) => (
                <tr key={apt.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{apt.patientName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{apt.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={apt.paymentStatus} /></td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">${apt.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
