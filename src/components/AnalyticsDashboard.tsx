import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, FileText, Calendar, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalyticsDashboardProps {
  onBack: () => void;
}

const AnalyticsDashboard = ({ onBack }: AnalyticsDashboardProps) => {
  const metrics = [
    {
      title: "Content Generated",
      value: "42",
      change: "+18%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Weekly Plans",
      value: "12",
      change: "+25%",
      icon: Calendar,
      color: "text-teal-600"
    },
    {
      title: "Assessments Created",
      value: "28",
      change: "+12%",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Student Engagement",
      value: "94%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ];

  const recentActivity = [
    { month: "Jan", lessons: 8, assessments: 5 },
    { month: "Feb", lessons: 12, assessments: 7 },
    { month: "Mar", lessons: 15, assessments: 9 },
    { month: "Apr", lessons: 18, assessments: 12 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your teaching progress and productivity</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
              <span className="text-sm text-green-600 font-medium">{metric.change}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
            <p className="text-3xl font-bold">{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card className="glass-card border-0 p-6">
        <h3 className="font-semibold mb-6">Monthly Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{month.month}</span>
                <div className="flex gap-4 text-muted-foreground">
                  <span>{month.lessons} lessons</span>
                  <span>{month.assessments} assessments</span>
                </div>
              </div>
              <Progress value={(month.lessons / 20) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-0 p-6">
          <h3 className="font-semibold mb-4">Top Subjects</h3>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", count: 18, percentage: 45 },
              { subject: "Physics", count: 12, percentage: 30 },
              { subject: "Chemistry", count: 8, percentage: 20 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <span className="text-sm text-muted-foreground">{item.count} lessons</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card border-0 p-6">
          <h3 className="font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { title: "100 Lessons Milestone", date: "2 days ago" },
              { title: "Perfect Attendance", date: "1 week ago" },
              { title: "Top Content Creator", date: "2 weeks ago" },
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
