import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  TrendingUp,
  Clock,
  Award,
  MessageSquare,
  Send,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  teacher: string;
  status: "upcoming" | "completed" | "in-progress";
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

const StudentDashboard = () => {
  const { toast } = useToast();
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [lessons] = useState<Lesson[]>([
    { id: "1", subject: "Mathematics", topic: "Calculus - Derivatives", date: "Today", time: "9:00 AM", teacher: "Dr. Sarah Johnson", status: "upcoming" },
    { id: "2", subject: "Physics", topic: "Quantum Mechanics", date: "Today", time: "11:00 AM", teacher: "Prof. Michael Chen", status: "upcoming" },
    { id: "3", subject: "Computer Science", topic: "Data Structures", date: "Today", time: "2:00 PM", teacher: "Dr. Emily White", status: "in-progress" },
  ]);

  const [assignments] = useState<Assignment[]>([
    { id: "1", title: "Calculus Problem Set", subject: "Mathematics", dueDate: "May 20, 2024", status: "pending" },
    { id: "2", title: "Physics Lab Report", subject: "Physics", dueDate: "May 18, 2024", status: "submitted" },
    { id: "3", title: "Algorithm Analysis", subject: "Computer Science", dueDate: "May 15, 2024", status: "graded", grade: 95 },
  ]);

  const handleAiQuestion = () => {
    if (!aiQuestion.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Based on your question about "${aiQuestion}", here's a comprehensive explanation:\n\nThis is a simulated AI response. In a production environment, this would connect to a real AI service to provide detailed explanations, homework help, and study guidance tailored to your specific question.`);
      setIsAiLoading(false);
      toast({
        title: "AI Response Generated",
        description: "Your answer is ready!",
      });
    }, 2000);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Your personalized learning hub</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 completed</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.filter(a => a.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Due this week</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="glass-card">
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="ai-help">AI Tutor</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{lesson.subject}</h4>
                              <Badge variant={
                                lesson.status === "upcoming" ? "secondary" :
                                lesson.status === "in-progress" ? "default" :
                                "outline"
                              }>
                                {lesson.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.time}
                              </span>
                              <span>{lesson.teacher}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Track your assignments and submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold">{assignment.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">Due: {assignment.dueDate}</span>
                            <Badge variant={
                              assignment.status === "pending" ? "destructive" :
                              assignment.status === "submitted" ? "secondary" :
                              "default"
                            }>
                              {assignment.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {assignment.status === "submitted" && <Clock className="h-3 w-3 mr-1" />}
                              {assignment.status === "graded" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {assignment.status}
                            </Badge>
                            {assignment.grade && (
                              <Badge variant="default" className="bg-green-500">
                                Grade: {assignment.grade}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        {assignment.status === "pending" && (
                          <Button size="sm">Submit</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tutor Tab */}
          <TabsContent value="ai-help" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Learning Assistant
                </CardTitle>
                <CardDescription>Ask questions and get instant help with your studies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ask your question:</label>
                  <Textarea
                    placeholder="e.g., Can you explain derivatives in calculus?"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleAiQuestion}
                    disabled={isAiLoading}
                    className="w-full"
                  >
                    {isAiLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Get AI Help
                      </>
                    )}
                  </Button>
                </div>

                {aiResponse && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-base">AI Response:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-line">{aiResponse}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Quick Help Topics:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAiQuestion("Explain quadratic equations")}>
                      Quadratic Equations
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiQuestion("Help with essay writing")}>
                      Essay Writing
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiQuestion("Study tips for exams")}>
                      Study Tips
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAiQuestion("Time management strategies")}>
                      Time Management
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Subject Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mathematics</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Physics</span>
                      <span className="font-semibold">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Computer Science</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Chemistry</span>
                      <span className="font-semibold">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Perfect Score</p>
                      <p className="text-xs text-muted-foreground">Mathematics Quiz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Award className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Early Submission</p>
                      <p className="text-xs text-muted-foreground">Physics Lab Report</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Award className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Top Performer</p>
                      <p className="text-xs text-muted-foreground">CS Data Structures</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
