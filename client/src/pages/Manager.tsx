import { Navbar } from "@/components/Navbar";
import { useCelebrities, useCreateCelebrity } from "@/hooks/use-celebrities";
import { useForm } from "react-hook-form";
import { insertCelebritySchema, type InsertCelebrity } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Users, Calendar, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function Manager() {
  const { data: celebrities, isLoading } = useCelebrities();
  const { mutate, isPending } = useCreateCelebrity();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InsertCelebrity>({
    resolver: zodResolver(insertCelebritySchema)
  });

  const onSubmit = (data: InsertCelebrity) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-display text-4xl font-bold text-slate-900">Manager Portal</h1>
            <p className="text-slate-600">Overview of talent and fan engagement</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <Plus size={20} /> Add Celebrity
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Celebrity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <input {...register("name")} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Taylor Swift" />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Slug</label>
                    <input {...register("slug")} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. taylor-swift" />
                    {errors.slug && <span className="text-xs text-red-500">{errors.slug.message}</span>}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea {...register("bio")} className="w-full px-3 py-2 border rounded-lg h-24" placeholder="Artist biography..." />
                  {errors.bio && <span className="text-xs text-red-500">{errors.bio.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Hero Image URL</label>
                  <input {...register("heroImage")} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..." />
                  {errors.heroImage && <span className="text-xs text-red-500">{errors.heroImage.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Avatar Image URL</label>
                  <input {...register("avatarImage")} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..." />
                  {errors.avatarImage && <span className="text-xs text-red-500">{errors.avatarImage.message}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Accent Color</label>
                  <input {...register("accentColor")} type="color" className="w-full h-10 border rounded-lg cursor-pointer" />
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  {isPending ? 'Creating...' : 'Create Profile'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={24} /></div>
              <div>
                <div className="text-sm text-slate-500">Total Fans</div>
                <div className="text-2xl font-bold font-display">12,450</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Star size={24} /></div>
              <div>
                <div className="text-sm text-slate-500">Active Talent</div>
                <div className="text-2xl font-bold font-display">{celebrities?.length || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Calendar size={24} /></div>
              <div>
                <div className="text-sm text-slate-500">Upcoming Events</div>
                <div className="text-2xl font-bold font-display">24</div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold mb-6">Talent Roster</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {celebrities?.map((celeb) => (
              <div key={celeb.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                <div className="h-40 relative">
                  <img src={celeb.heroImage} className="w-full h-full object-cover" alt={celeb.name} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <img 
                    src={celeb.avatarImage} 
                    className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white shadow-md object-cover" 
                    alt="avatar"
                  />
                </div>
                <div className="pt-12 p-6">
                  <h3 className="font-display text-xl font-bold mb-1">{celeb.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: celeb.accentColor || '#000' }} />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Brand Color</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-500">Slug: <span className="font-mono text-xs">{celeb.slug}</span></div>
                    <button className="text-primary text-sm font-medium hover:underline">Edit Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
