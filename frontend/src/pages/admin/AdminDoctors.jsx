import StatusBadge from "@/components/ui/StatusBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Stethoscope, Star, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function AdminDoctors() {
  const { user } = useAuth();
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    specialization: "General Physician", experience: "", fees: "", bio: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      const formatted = res.data.map(doc => ({
        ...doc,
        id: doc._id,
        name: doc.userId?.name || 'Unknown',
        available: true // Simplify for demo
      }));
      setDoctorList(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load doctors");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const removeDoctor = async (id) => {
    try {
      await axios.delete(`/api/admin/doctors/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setDoctorList((prev) => prev.filter((d) => d.id !== id));
      toast.success("Doctor permanently removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove doctor");
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/admin/doctors', formData, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success("Doctor account created securely!");
      setIsModalOpen(false);
      fetchDoctors(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create doctor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-32"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Doctors</h1>
            <p className="text-muted-foreground mt-1">Add, update, or remove doctors from the platform</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Doctor
          </Button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        {doctorList.length === 0 ? (
          <p className="text-muted-foreground">No doctors found in the database.</p>
        ) : (
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
        )}
      </ScrollReveal>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl border shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Specialization</label>
                  <input required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Experience (Years)</label>
                  <input required type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fees ($)</label>
                  <input required type="number" value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Bio</label>
                <textarea required rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary resize-none" />
              </div>
              
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Confirm & Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}