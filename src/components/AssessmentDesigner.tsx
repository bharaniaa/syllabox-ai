import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, AssessmentRequest } from "@/lib/aiService";
import { addAssessment } from "@/lib/localStorage";

interface AssessmentDesignerProps {
  onBack: () => void;
}

const AssessmentDesigner = ({ onBack }: AssessmentDesignerProps) => {
  const { toast } = useToast();
  const [assessmentType, setAssessmentType] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConnectionStatus, setAiConnectionStatus] = useState<"testing" | "connected" | "failed">("testing");
  const [aiError, setAiError] = useState<string | null>(null);

  const sanitizeInput = (input: string): string =>
    input.trim().replace(/[<>"'&]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").substring(0, 500);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const ok = await aiService.testConnection();
        setAiConnectionStatus(ok ? "connected" : "failed");
      } catch {
        setAiConnectionStatus("failed");
      }
    };
    testConnection();
  }, []);

  const generateMockAssessment = (request: AssessmentRequest) => {
    return {
      title: `${request.course} Assessment - ${request.topic}`,
      course: request.course,
      topic: request.topic,
      difficulty: request.difficulty,
      type: request.type,
      questions: Array.from({ length: request.questions }, (_, i) => ({
        id: i + 1,
        type: 'multiple_choice',
        question: `Sample question ${i + 1} about ${request.topic}`,
        options: [
          `Option A for ${request.topic}`,
          `Option B for ${request.topic}`,
          `Option C for ${request.topic}`,
          `Option D for ${request.topic}`
        ],
        correct_answer: 'A',
        explanation: 'This demonstrates understanding of the topic.'
      })),
      time_limit: `${Math.max(30, request.questions * 2)} minutes`,
      total_points: request.questions * 5,
      instructions: 'Select the best answer for each question.',
      rubric: {
        excellent: '90-100%: Comprehensive understanding',
        good: '80-89%: Good grasp of concepts',
        satisfactory: '70-79%: Basic understanding'
      }
    };
  };

  const handleGenerateAssessment = async () => {
    if (!assessmentType.trim()) {
      toast({ title: "Validation Error", description: "Assessment type is required", variant: "destructive" });
      return;
    }
    if (!subject.trim()) {
      toast({ title: "Validation Error", description: "Course name is required", variant: "destructive" });
      return;
    }
    if (!topic.trim()) {
      toast({ title: "Validation Error", description: "Topic is required", variant: "destructive" });
      return;
    }
    const q = parseInt(numQuestions || "0", 10);
    if (isNaN(q) || q < 1 || q > 50) {
      toast({ title: "Validation Error", description: "Number of questions must be between 1 and 50", variant: "destructive" });
      return;
    }

    try {
      setIsGenerating(true);
      setAiError(null);

      if (aiConnectionStatus === 'failed') {
        toast({ title: "AI Connection Issue", description: "Unable to connect to AI service. Using fallback mode.", variant: "destructive" });
      }

      const assessmentRequest: AssessmentRequest = {
        course: sanitizeInput(subject),
        topic: sanitizeInput(topic),
        questions: q,
        difficulty: difficulty || 'medium',
        type: assessmentType,
      };

      let assessmentData: any;
      try {
        if (aiConnectionStatus === 'connected') {
          assessmentData = await aiService.generateAssessment(assessmentRequest);
        } else {
          assessmentData = generateMockAssessment(assessmentRequest);
        }
      } catch (err) {
        setAiError('AI generation temporarily unavailable. Using template.');
        assessmentData = generateMockAssessment(assessmentRequest);
      }

      const saved = addAssessment({
        title: assessmentData.title,
        course: assessmentData.course,
        questions: q,
        difficulty: assessmentData.difficulty,
        type: assessmentData.type,
        createdBy: 'AI Generator',
        createdAt: new Date().toISOString(),
      });

      toast({
        title: aiConnectionStatus === 'connected' ? 'AI Assessment Created!' : 'Assessment Generated',
        description: aiConnectionStatus === 'connected' ? 'Your AI-powered assessment is ready!' : 'Assessment created using template (AI unavailable).',
      });
    } catch (error) {
      setAiError('An error occurred while generating the assessment');
      toast({ title: 'Generation Failed', description: 'An error occurred while generating the assessment', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Assessment Designer</h2>
          <p className="text-muted-foreground">Create AI-powered assessments and quizzes</p>
        </div>
      </div>

      <div className="mb-4">
        <div className={`flex items-center space-x-2 text-sm ${
          aiConnectionStatus === 'connected' ? 'text-green-600' :
          aiConnectionStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            aiConnectionStatus === 'connected' ? 'bg-green-500' :
            aiConnectionStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span>
            {aiConnectionStatus === 'connected' ? 'AI Connected - Generating intelligent assessments' :
             aiConnectionStatus === 'failed' ? 'AI Offline - Using templates' :
             'Testing AI connection...'}
          </span>
        </div>
        {aiError && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{aiError}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card border-0 p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Assessment Type *</Label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz (MCQ)</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam Paper</SelectItem>
                  <SelectItem value="worksheet">Worksheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white/50"
              />
            </div>

            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Quadratic Equations"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-white/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="questions">Number of Questions</Label>
                <Input
                  id="questions"
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateAssessment}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Assessment...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Assessment
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="glass-card border-0 p-6">
          <h3 className="font-semibold mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {[
              { title: "Physics Quiz - Ch.5", date: "2 days ago" },
              { title: "Math Assignment", date: "5 days ago" },
              { title: "Chemistry Exam", date: "1 week ago" },
              { title: "Biology Worksheet", date: "2 weeks ago" }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors cursor-pointer"
              >
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentDesigner;
