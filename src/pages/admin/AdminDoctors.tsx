import { doctors } from "@/data/doctors";
import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Stethoscope, Star, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Doctor } from "@/types";

export default function AdminDoctors() {
  const [doctorList, setDoctorList] = useState<Doctor[]>(doctors);

  const removeDoctor = (id: string) => {
    setDoctorList(prev => prev.filter(d => d.id !== id));
    toast.success("Doctor removed (demo)");
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Doctors</h1>
            <p className="text-muted-foreground mt-1">Add, update, or remove doctors from the platform</p>
          </div>
          <Button onClick={() => toast.success("Add doctor form coming soon")}>
            <Plus className="h-4 w-4 mr-1" /> Add Doctor
          </Button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-3">
          {doctorList.map((doc) => (
            <div key={doc.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{doc.specialization}</span>
                    <span>{doc.experience} yrs exp.</span>
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-warning" />{doc.rating}</span>
                    <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3" />{doc.fees}/visit</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.available ? "confirmed" : "cancelled"} />
                <Button variant="destructive" size="sm" onClick={() => removeDoctor(doc.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
