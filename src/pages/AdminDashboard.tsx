import Layout from "@/components/layout/Layout";
import { mockAppointments } from "@/data/appointments";
import { doctors } from "@/data/doctors";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, CalendarDays, DollarSign, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const mockUsers = [
  { id: "user-1", name: "Alex Rivera", email: "alex@example.com", appointments: 3 },
  { id: "user-2", name: "Morgan Patel", email: "morgan@example.com", appointments: 2 },
  { id: "user-3", name: "Casey Nguyen", email: "casey@example.com", appointments: 1 },
  { id: "user-4", name: "Jordan Okafor", email: "jordan@example.com", appointments: 1 },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<"overview" | "doctors" | "users" | "appointments">("overview");
  const totalRevenue = mockAppointments.filter(a => a.paymentStatus === "paid").reduce((s, a) => s + a.fees, 0);

  const stats = [
    { icon: Users, label: "Total Users", value: mockUsers.length, color: "text-primary bg-primary/10" },
    { icon: Stethoscope, label: "Doctors", value: doctors.length, color: "text-info bg-info/10" },
    { icon: CalendarDays, label: "Appointments", value: mockAppointments.length, color: "text-warning bg-warning/10" },
    { icon: DollarSign, label: "Revenue", value: `$${totalRevenue}`, color: "text-success bg-success/10" },
  ];

  const tabs = ["overview", "doctors", "users", "appointments"] as const;

  return (
    <Layout>
      <div className="container py-10">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Monitor and manage the MediSync platform</p>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={60}>
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-8">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {tab === "overview" && (
          <>
            <ScrollReveal delay={100}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((s, i) => (
                  <div key={i} className="bg-card border rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.color}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <h2 className="font-semibold text-lg mb-4">Recent Appointments</h2>
              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Doctor</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAppointments.slice(0, 5).map((apt) => (
                        <tr key={apt.id} className="border-b last:border-0">
                          <td className="px-4 py-3">{apt.patientName}</td>
                          <td className="px-4 py-3">{apt.doctorName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{apt.date} {apt.time}</td>
                          <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                          <td className="px-4 py-3 font-medium">${apt.fees}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}

        {tab === "doctors" && (
          <ScrollReveal delay={100}>
            <div className="space-y-3">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.specialization} · {doc.experience} yrs · ${doc.fees}/visit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.available ? "confirmed" : "cancelled"} />
                    <Button variant="destructive" size="sm" onClick={() => toast.success("Doctor removed (demo)")}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {tab === "users" && (
          <ScrollReveal delay={100}>
            <div className="bg-card border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">{u.appointments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        )}

        {tab === "appointments" && (
          <ScrollReveal delay={100}>
            <div className="space-y-3">
              {mockAppointments.map((apt) => (
                <div key={apt.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{apt.patientName} → {apt.doctorName}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    <StatusBadge status={apt.paymentStatus} />
                    <span className="font-semibold">${apt.fees}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </Layout>
  );
}
