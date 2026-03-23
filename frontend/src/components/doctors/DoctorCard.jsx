
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

function getInitials(name) {
  return name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2);
}

const specColors = {
  Cardiologist: "bg-red-50 text-red-700",
  Dermatologist: "bg-amber-50 text-amber-700",
  Pediatrician: "bg-emerald-50 text-emerald-700",
  "Orthopedic Surgeon": "bg-blue-50 text-blue-700",
  Neurologist: "bg-purple-50 text-purple-700",
  "General Physician": "bg-teal-50 text-teal-700",
  Ophthalmologist: "bg-cyan-50 text-cyan-700",
  Psychiatrist: "bg-rose-50 text-rose-700"
};

export default function DoctorCard({ doctor }) {
  return (
    <div className="group bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {getInitials(doctor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate">{doctor.name}</h3>
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${specColors[doctor.specialization] || "bg-muted text-muted-foreground"}`}>
              {doctor.specialization}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{doctor.experience} yrs experience</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{doctor.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-warning fill-warning" />
            <span className="text-foreground font-medium">{doctor.rating}</span>
            <span>({doctor.totalReviews} reviews)</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">${doctor.fees}</span>
            <span className="text-xs text-muted-foreground ml-1">/ visit</span>
          </div>
          <Button asChild size="sm">
            <Link to={`/doctors/${doctor.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </div>);

}