import { doctors } from "@/data/doctors";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, GraduationCap, Stethoscope, Star, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function DoctorProfile() {
  const doctor = doctors.find(d => d.id === "dr-1")!;
  const [name, setName] = useState(doctor.name);
  const [fees, setFees] = useState(doctor.fees.toString());
  const [bio, setBio] = useState(doctor.bio);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated (demo)");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Update your professional information</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{doctor.name}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" />{doctor.specialization}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning" />{doctor.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {doctor.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {doctor.address}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" /> {doctor.education}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" /> ${doctor.fees} per visit
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <form onSubmit={handleSave} className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold">Edit Profile</h3>
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Consultation Fee ($)</label>
            <input type="number" value={fees} onChange={e => setFees(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </ScrollReveal>
    </div>
  );
}
