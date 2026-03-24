import { useState, useMemo, useEffect } from "react";
import { specializations } from "@/data/doctors";
import axios from "axios";
import DoctorCard from "@/components/doctors/DoctorCard";
import Layout from "@/components/layout/Layout";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Search, Loader2 } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("All");

  useEffect(() => {
    axios.get('/api/doctors')
      .then(res => {
        // Map backend returned objects to uniform frontend structure
        const formatted = res.data.map(d => ({
          ...d,
          name: d.userId?.name || 'Unknown Doctor',
          email: d.userId?.email
        }));
        setDoctors(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchSpec = spec === "All" || d.specialization === spec;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
      return matchSpec && matchSearch;
    });
  }, [doctors, search, spec]);

  return (
    <Layout>
      <div className="container py-10">
        <ScrollReveal>
          <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
          <p className="text-muted-foreground mb-8">Browse our network of trusted healthcare professionals</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              
            </div>
            <div className="flex flex-wrap gap-2">
              {specializations.map((s) =>
              <button
                key={s}
                onClick={() => setSpec(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                spec === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`
                }>
                
                  {s}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {filtered.length === 0 ?
        <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div> :

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((doc, i) =>
          <ScrollReveal key={doc.id} delay={i * 60}>
                <DoctorCard doctor={doc} />
              </ScrollReveal>
          )}
          </div>
        }
      </div>
    </Layout>);

}