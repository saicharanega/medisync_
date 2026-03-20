import ScrollReveal from "@/components/ui/ScrollReveal";
import { Users, Mail, CalendarDays } from "lucide-react";

const mockUsers = [
  { id: "user-1", name: "Alex Rivera", email: "alex@example.com", appointments: 3, joined: "2025-11-14" },
  { id: "user-2", name: "Morgan Patel", email: "morgan@example.com", appointments: 2, joined: "2025-12-02" },
  { id: "user-3", name: "Casey Nguyen", email: "casey@example.com", appointments: 1, joined: "2026-01-18" },
  { id: "user-4", name: "Jordan Okafor", email: "jordan@example.com", appointments: 1, joined: "2026-02-05" },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">All registered patients on the platform</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{u.appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
