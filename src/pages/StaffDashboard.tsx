import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  ClipboardCheck, 
  UserMinus, 
  BarChart3,
  Sparkles,
  BookOpen,
  Plus
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AILessonGenerator from "@/components/AILessonGenerator";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import AssessmentDesigner from "@/components/AssessmentDesigner";
import LeaveManagement from "@/components/LeaveManagement";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

type ViewType = "overview" | "lesson" | "planner" | "assessment" | "leave" | "analytics";

const StaffDashboard = () => {
  const [currentView, setCurrentView] = useState<ViewType>("overview");

  const quickActions = [
    {
      title: "Generate Lesson",
      icon: Sparkles,
      description: "AI-powered lesson content",
      gradient: "from-blue-500 to-indigo-600",
      action: () => setCurrentView("lesson")
    },
    {
      title: "Weekly Plan",
      icon: Calendar,
      description: "Create weekly schedule",
      gradient: "from-teal-500 to-blue-600",
      action: () => setCurrentView("planner")
    },
    {
      title: "Design Assessment",
      icon: ClipboardCheck,
      description: "Generate quizzes & assignments",
      gradient: "from-indigo-500 to-purple-600",
      action: () => setCurrentView("assessment")
    },
    {
      title: "Manage Leave",
      icon: UserMinus,
      description: "Request & track leave",
      gradient: "from-purple-500 to-pink-600",
      action: () => setCurrentView("leave")
    }
  ];

  const recentActivity = [
    { title: "Physics - Week 12 Plan", time: "2 hours ago", type: "planner" },
    { title: "Chemistry Quiz Generated", time: "5 hours ago", type: "assessment" },
    { title: "Leave Request Approved", time: "1 day ago", type: "leave" },
    { title: "Mathematics Lesson Created", time: "2 days ago", type: "lesson" }
  ];

  const renderContent = () => {
    switch (currentView) {
      case "lesson":
        return <AILessonGenerator onBack={() => setCurrentView("overview")} />;
      case "planner":
        return <WeeklyPlanner onBack={() => setCurrentView("overview")} />;
      case "assessment":
        return <AssessmentDesigner onBack={() => setCurrentView("overview")} />;
      case "leave":
        return <LeaveManagement onBack={() => setCurrentView("overview")} />;
      case "analytics":
        return <AnalyticsDashboard onBack={() => setCurrentView("overview")} />;
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card p-6 border-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome back, Professor! 👋
                  </h2>
                  <p className="text-muted-foreground">
                    Your AI-powered teaching assistant is ready to help you create amazing content.
                  </p>
                </div>
                <Button
                  onClick={() => setCurrentView("analytics")}
                  variant="outline"
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={action.title}
                    className="group cursor-pointer glass-card hover:shadow-lg transition-all duration-300 border-0 overflow-hidden"
                    onClick={action.action}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative p-6 space-y-3">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="glass-card border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lessons Created</p>
                    <p className="text-3xl font-bold text-foreground mt-1">24</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
              </Card>

              <Card className="glass-card border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Assessments</p>
                    <p className="text-3xl font-bold text-foreground mt-1">18</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-full">
                    <ClipboardCheck className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">8 quizzes, 10 assignments</p>
              </Card>

              <Card className="glass-card border-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Plans</p>
                    <p className="text-3xl font-bold text-foreground mt-1">12</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-full">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">All weeks planned ahead</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-card border-0">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <DashboardLayout role="staff">
      {renderContent()}
    </DashboardLayout>
  );
};

export default StaffDashboard;
