import { Navbar } from "@/components/Navbar";
import { useCelebrities, useCreateCelebrity } from "@/hooks/use-celebrities";
import { useForm } from "react-hook-form";
import { insertCelebritySchema, type InsertCelebrity } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Users, Calendar, Star, LayoutDashboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Manager() {
  const { data: celebrities, isLoading } = useCelebrities();
  const { mutate, isPending } = useCreateCelebrity();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertCelebrity>({
    resolver: zodResolver(insertCelebritySchema),
    defaultValues: {
      name: "",
      slug: "",
      bio: "",
      heroImage: "",
      avatarImage: "",
      accentColor: "#3b82f6",
      isFeatured: false
    }
  });

  const onSubmit = (data: InsertCelebrity) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 mt-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight italic uppercase">Manager Portal</h1>
            <p className="text-slate-500 text-lg mt-2">Oversee talent roster and fan base growth.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-primary shadow-xl transition-all px-8">
                <Plus size={24} className="mr-2" /> Add Celebrity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[32px] p-8 border-none shadow-2xl">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-display font-black italic">ADD NEW TALENT</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Taylor Swift" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Slug</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="taylor-swift" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="rounded-xl bg-slate-50 border-none font-bold resize-none min-h-[120px]" placeholder="Artist biography..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heroImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Hero URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avatarImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Avatar URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Accent Color</FormLabel>
                        <FormControl>
                          <Input {...field} type="color" className="h-12 rounded-xl bg-slate-50 border-none cursor-pointer p-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-primary transition-all shadow-xl"
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : 'CREATE PROFILE'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 p-6 flex items-center gap-6 group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={32} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Fans</div>
              <div className="text-3xl font-display font-black text-slate-900">12,450</div>
            </div>
          </Card>
          <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 p-6 flex items-center gap-6 group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Star size={32} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Talent</div>
              <div className="text-3xl font-display font-black text-slate-900">{celebrities?.length || 0}</div>
            </div>
          </Card>
          <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 p-6 flex items-center gap-6 group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar size={32} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Events Live</div>
              <div className="text-3xl font-display font-black text-slate-900">24</div>
            </div>
          </Card>
        </div>

        <h2 className="text-xl font-display font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-8">
          <LayoutDashboard size={18} className="text-primary" />
          Talent Roster
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-80 bg-slate-200 rounded-[32px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {celebrities?.map((celeb) => (
              <Card key={celeb.id} className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 overflow-hidden group hover:shadow-2xl transition-all">
                <div className="h-48 relative overflow-hidden">
                  <img src={celeb.heroImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={celeb.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <img 
                    src={celeb.avatarImage} 
                    className="absolute -bottom-6 left-8 w-20 h-20 rounded-full border-4 border-white shadow-2xl object-cover z-10" 
                    alt="avatar"
                  />
                  <div className="absolute bottom-4 right-8 z-10">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 font-black text-[10px] uppercase tracking-widest px-3 py-1">
                      {celeb.slug}
                    </Badge>
                  </div>
                </div>
                <CardContent className="pt-10 p-8">
                  <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight italic mb-4">{celeb.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{celeb.bio}</p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border border-slate-100 shadow-sm" style={{ backgroundColor: celeb.accentColor || '#000' }} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theme</span>
                    </div>
                    <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-primary hover:bg-primary/5 rounded-lg">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
