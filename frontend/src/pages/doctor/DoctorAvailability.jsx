import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2, Loader2, CalendarPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorAvailability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddDay, setShowAddDay] = useState(false);
  const [newDaySelect, setNewDaySelect] = useState("Monday");
  const [newSlotInputs, setNewSlotInputs] = useState({});

  useEffect(() => {
    if (user?.token) {
      axios.get('/api/doctors')
        .then(res => {
          const myProfile = res.data.find(d => d.userId?._id === user._id || d.userId === user._id);
          if (myProfile?.availability) setAvailability(myProfile.availability);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const saveAvailability = async (newAvailability) => {
    try {
      await axios.put('/api/doctors/profile', { availability: newAvailability }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("Schedule updated");
    } catch (err) {
      toast.error("Failed to sync availability");
    }
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const updated = availability.map((day, di) =>
      di === dayIndex ? { ...day, slots: day.slots.filter((_, si) => si !== slotIndex) } : day
    );
    setAvailability(updated);
    saveAvailability(updated);
  };

  const addSlot = (dayIndex) => {
    const time = newSlotInputs[dayIndex];
    if (!time) {
      toast.error("Please pick a valid time");
      return;
    }
    const updated = availability.map((day, di) =>
      di === dayIndex ? { ...day, slots: [...new Set([...day.slots, time])].sort() } : day
    );
    setAvailability(updated);
    saveAvailability(updated);
    setNewSlotInputs(prev => ({ ...prev, [dayIndex]: "" }));
  };

  const addDay = () => {
    if (!newDaySelect) return;
    if (availability.some(d => d.day === newDaySelect)) {
      toast.error(`${newDaySelect} is already in your schedule`);
      setShowAddDay(false);
      return;
    }
    const updated = [...availability, { day: newDaySelect, slots: [] }];
    setAvailability(updated);
    saveAvailability(updated);
    setShowAddDay(false);
  };

  const removeDay = (dayIndex) => {
    if (!confirm("Remove this entire day?")) return;
    const updated = availability.filter((_, di) => di !== dayIndex);
    setAvailability(updated);
    saveAvailability(updated);
  };

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Availability Calendar</h1>
            <p className="text-muted-foreground mt-1">Configure your weekly working hours graphically</p>
          </div>
          {!showAddDay ? (
            <Button onClick={() => setShowAddDay(true)}>
              <CalendarPlus className="h-4 w-4 mr-1" /> Add Day
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
              <select 
                value={newDaySelect} 
                onChange={(e) => setNewDaySelect(e.target.value)}
                className="h-9 px-3 rounded-md border bg-background text-sm focus:outline-none"
              >
                {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <Button size="sm" onClick={addDay}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddDay(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-4">
          {availability.length === 0 ? <p className="text-muted-foreground italic bg-muted/50 p-6 rounded-xl border border-dashed text-center">Your calendar is currently empty. Add a day to start scheduling.</p> : null}
          {availability.map((day, dayIndex) => (
            <div key={day.day} className="bg-card border rounded-xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{day.day}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-secondary rounded-full">
                    {day.slots.length} slots
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                    <input 
                      type="time" 
                      value={newSlotInputs[dayIndex] || ""} 
                      onChange={(e) => setNewSlotInputs(prev => ({...prev, [dayIndex]: e.target.value}))}
                      className="h-8 px-2 text-sm rounded-md border bg-background"
                    />
                    <Button variant="default" size="sm" className="h-8" onClick={() => addSlot(dayIndex)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Time
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDay(dayIndex)} className="text-destructive hover:bg-destructive/10 h-8 w-8 ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.slots.length === 0 ? <span className="text-sm text-muted-foreground p-2">No time slots scheduled yet. Add one above.</span> : null}
                {day.slots.map((slot, slotIndex) => (
                  <div
                    key={slot}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-primary/5 text-primary text-sm font-semibold tabular-nums hover:border-destructive/30 hover:bg-destructive/5 transition-colors"
                  >
                    {slot}
                    <button
                      onClick={() => removeSlot(dayIndex, slotIndex)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      aria-label="Remove slot"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}