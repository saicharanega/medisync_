import { useParams, useNavigate } from "react-router-dom";
import { doctors } from "@/data/doctors";
import Layout from "@/components/layout/Layout";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Star, MapPin, GraduationCap, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

function getInitials(name: string) {
  return name.replace("Dr. ", "").split(" ").map(n => n[0]).join("").slice(0, 2);
}

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const doctor = doctors.find((d) => d.id === id);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!doctor) {
    return <Layout><div className="container py-20 text-center text-muted-foreground">Doctor not found.</div></Layout>;
  }

  const daySlots = doctor.availability.find((a) => a.day === selectedDay)?.slots || [];

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book an appointment");
      navigate("/login");
      return;
    }
    if (!selectedDay || !selectedSlot) {
      toast.error("Please select a day and time slot");
      return;
    }
    toast.success(`Appointment booked with ${doctor.name} on ${selectedDay} at ${selectedSlot}!`);
    navigate("/my-appointments");
  };

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <ScrollReveal>
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary to-background p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                  {getInitials(doctor.name)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{doctor.name}</h1>
                  <p className="text-primary font-medium mt-1">{doctor.specialization}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <strong className="text-foreground">{doctor.rating}</strong> ({doctor.totalReviews} reviews)
                    </span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{doctor.experience} yrs</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{doctor.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${doctor.fees}</div>
                  <div className="text-xs text-muted-foreground">per consultation</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* About */}
              <div>
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-sm text-muted-foreground text-wrap-pretty">{doctor.bio}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{doctor.education}</span>
              </div>

              {/* Booking */}
              <div className="border-t pt-8">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Book an Appointment
                </h2>

                {/* Day selection */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Select a day</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availability.map((a) => (
                      <button
                        key={a.day}
                        onClick={() => { setSelectedDay(a.day); setSelectedSlot(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedDay === a.day
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {a.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDay && (
                  <div className="animate-reveal-up">
                    <p className="text-sm text-muted-foreground mb-2">Available slots for {selectedDay}</p>
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            selectedSlot === slot
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm */}
                {selectedDay && selectedSlot && (
                  <div className="mt-6 flex items-center gap-4 animate-reveal-up">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {selectedDay} at {selectedSlot}
                    </div>
                    <Button onClick={handleBook} variant="hero" size="lg">
                      Confirm & Pay ${doctor.fees}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
}
