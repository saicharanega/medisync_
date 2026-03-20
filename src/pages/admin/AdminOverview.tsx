import { mockAppointments } from "@/data/appointments";
import { doctors } from "@/data/doctors";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Users, Stethoscope, CalendarDays, DollarSign } from "lucide-react";

const mockUsers = [
  { id: "user-1", name: "Alex Rivera", email: "alex@example.com", appointments: 3 },
  { id: "user-2", name: "Morgan Patel", email: "morgan@example.com", appointments: 2 },
  { id: "user-3", name: "Casey Nguyen", email: "casey@example.com", appointments: 1 },
  { id: "user-4", name: "Jordan Okafor", email: "jordan@example.com", appointments: 1 },
];

export default function AdminOverview() {
  const totalRevenue = mockAppointments.filter(a => a.paymentStatus === "paid").reduce((s, a) => s + a.fees, 0);

  const stats = [
    { icon: Users, label: "Total Users", value: mockUsers.length, color: "text-primary bg-primary/10" },
    { icon: Stethoscope, label: "Doctors", value: doctors.length, color: "text-info bg-info/10" },
    { icon: CalendarDays, label: "Appointments", value: mockAppointments.length, color: "text-warning bg-warning/10" },
    { icon: DollarSign, label: "Revenue", value: `$${totalRevenue}`, color: "text-success bg-success/10" },
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
                {mockAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{apt.patientName}</td>
                    <td className="px-4 py-3">{apt.doctorName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{apt.date} {apt.time}</td>
                    <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">${apt.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
