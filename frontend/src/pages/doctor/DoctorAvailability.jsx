import { doctors } from "@/data/doctors";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function DoctorAvailability() {
  const doctor = doctors.find((d) => d.id === "dr-1");
  const [availability, setAvailability] = useState(doctor.availability);

  const removeSlot = (dayIndex, slotIndex) => {
    setAvailability((prev) => prev.map((day, di) =>
    di === dayIndex ? { ...day, slots: day.slots.filter((_, si) => si !== slotIndex) } : day
    ));
    toast.success("Slot removed");
  };

  const addSlot = (dayIndex) => {
    const time = prompt("Enter time slot (e.g. 16:00):");
    if (!time) return;
    setAvailability((prev) => prev.map((day, di) =>
    di === dayIndex ? { ...day, slots: [...day.slots, time].sort() } : day
    ));
    toast.success("Slot added");
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="text-2xl font-bold">Availability</h1>
          <p className="text-muted-foreground mt-1">Manage your available time slots for patient bookings</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-4">
          {availability.map((day, dayIndex) =>
          <div key={day.day} className="bg-card border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{day.day}</h3>
                  <span className="text-xs text-muted-foreground">({day.slots.length} slots)</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => addSlot(dayIndex)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Slot
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot, slotIndex) =>
              <div
                key={slot}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background text-sm font-medium tabular-nums hover:border-destructive/50 transition-colors">
                
                    {slot}
                    <button
                  onClick={() => removeSlot(dayIndex, slotIndex)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                  
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
              )}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>);

}