import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Staff",
      icon: BookOpen,
      description: "Create lesson plans, assessments, and manage your schedule with AI assistance",
      gradient: "from-blue-500 to-indigo-600",
      path: "/login?role=staff"
    },
    {
      title: "Admin",
      icon: Users,
      description: "Oversee staff, approve leaves, and monitor institutional progress",
      gradient: "from-teal-500 to-blue-600",
      path: "/login?role=admin"
    },
    {
      title: "Student",
      icon: GraduationCap,
      description: "Access your lessons, assessments, and get AI-powered learning support",
      gradient: "from-indigo-500 to-purple-600",
      path: "/login?role=student"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-teal-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Education Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Transform Academic Planning with
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Generative AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline weekly planning, generate engaging lesson content, design assessments, 
              and manage resources intelligently with AI assistance.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
            {roles.map((role, index) => (
              <Card
                key={role.title}
                className="group relative overflow-hidden glass-card hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in border-0"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(role.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-8 space-y-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.gradient}`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    onClick={() => navigate(role.path)}
                  >
                    Continue as {role.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
            {[
              { title: "AI Lesson Generation", desc: "Create comprehensive lesson plans instantly" },
              { title: "Smart Scheduling", desc: "Automated weekly planning and optimization" },
              { title: "Assessment Design", desc: "Generate quizzes and assignments with AI" },
              { title: "Leave Management", desc: "Auto-substitute and workload balancing" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
