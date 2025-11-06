import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, LessonRequest } from "@/lib/aiService";
import { addLesson } from "@/lib/localStorage";
import { useAuth } from "@/hooks/useAuth";

interface AILessonGeneratorProps {
  onBack: () => void;
}

const AILessonGenerator = ({ onBack }: AILessonGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [objectives, setObjectives] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiError, setAiError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "failed">("testing");

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>"'&]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .substring(0, 500);
  };

  const validateInput = (value: string, fieldName: string): string | null => {
    if (!value.trim()) return `${fieldName} is required`;
    if (value.length < 2) return `${fieldName} must be at least 2 characters long`;
    if (value.length > 200) return `${fieldName} must be less than 200 characters`;
    const dangerousPatterns = /<script|javascript:|on\w+=/gi;
    if (dangerousPatterns.test(value)) return `Invalid characters detected in ${fieldName}`;
    return null;
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await aiService.testConnection();
        setConnectionStatus(isConnected ? "connected" : "failed");
      } catch (error) {
        setConnectionStatus("failed");
      }
    };
    testConnection();
  }, []);

  const generateMockLesson = (request: LessonRequest) => {
    return {
      title: `${request.subject} - ${request.topic}`,
      gradeLevel: request.gradeLevel,
      duration: request.duration || "45 minutes",
      objectives: request.objectives
        ? request.objectives.split("\n").filter((o) => o.trim())
        : [
            `Understand key concepts of ${request.topic}`,
            `Apply ${request.subject} knowledge to problems`,
            `Demonstrate learning through practice`,
          ],
      materials: ["Whiteboard", "Handouts", "Projector"],
      sections: [
        {
          title: "Introduction",
          duration: "10 minutes",
          activities: [
            `Hook with real-world example of ${request.topic}`,
            "Present learning objectives",
            "Activate prior knowledge",
          ],
        },
        {
          title: "Main Content",
          duration: "25 minutes",
          activities: [
            `Explain core ideas about ${request.topic}`,
            "Guided practice",
            "Independent practice",
          ],
        },
        {
          title: "Conclusion",
          duration: "10 minutes",
          activities: [
            "Summarize key points",
            "Exit ticket",
            "Assign homework",
          ],
        },
      ],
      assessment: {
        formative: ["Questioning", "Observation", "Exit ticket"],
        summative: ["Quiz", "Assignment"],
      },
      extensions: ["Challenge problems", "Real-world project"],
    };
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrors({});
    setAiError(null);

    const s = sanitizeInput(subject);
    const t = sanitizeInput(topic);
    const o = sanitizeInput(objectives);

    const newErrors: Record<string, string> = {};
    const subjErr = validateInput(s, "Subject");
    if (subjErr) newErrors.subject = subjErr;
    const topicErr = validateInput(t, "Topic");
    if (topicErr) newErrors.topic = topicErr;
    if (!grade) newErrors.grade = "Grade level is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedContent("");

      if (connectionStatus === "failed") {
        toast({
          title: "AI Connection Issue",
          description: "Unable to connect to AI service. Using fallback mode.",
          variant: "destructive",
        });
      }

      const lessonRequest: LessonRequest = {
        subject: s,
        topic: t,
        objectives: o,
        gradeLevel: `Grade ${grade}`,
        duration: "45 minutes",
      };

      let generatedData: any;
      try {
        if (connectionStatus === "connected") {
          generatedData = await aiService.generateLesson(lessonRequest);
        } else {
          generatedData = generateMockLesson(lessonRequest);
        }
      } catch (err) {
        setAiError("AI generation temporarily unavailable. Using template.");
        generatedData = generateMockLesson(lessonRequest);
      }

      const saved = addLesson({
        subject: s,
        topic: t,
        objectives: o,
        gradeLevel: `Grade ${grade}`,
        content: generatedData,
        createdBy: user?.email || "AI Generator",
        createdAt: new Date().toISOString(),
      });

      setGeneratedContent(JSON.stringify({ ...generatedData, id: saved.id }, null, 2));

      toast({
        title: connectionStatus === "connected" ? "AI Lesson Generated!" : "Lesson Generated",
        description:
          connectionStatus === "connected"
            ? "Your AI-powered lesson plan is ready!"
            : "Lesson created using template (AI unavailable).",
      });
    } catch (error) {
      setAiError("An error occurred while generating the lesson");
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating the lesson",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Lesson content copied to clipboard",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">AI Lesson Generator</h2>
          <p className="text-muted-foreground">Create comprehensive lesson plans with AI</p>
        </div>
      </div>

      <div className="mb-6">
        <div
          className={`flex items-center space-x-2 text-sm ${
            connectionStatus === "connected"
              ? "text-green-600"
              : connectionStatus === "failed"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-green-500"
                : connectionStatus === "failed"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          ></div>
          <span>
            {connectionStatus === "connected"
              ? "AI Connected - Generating intelligent content"
              : connectionStatus === "failed"
              ? "AI Offline - Using fallback templates"
              : "Testing AI connection..."}
          </span>
        </div>

        {aiError && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{aiError}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="glass-card border-0 p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Mathematics, Physics, English"
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`bg-white/50 ${errors.subject ? "border-red-500" : ""}`}
              />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
            </div>

            <div>
              <Label htmlFor="grade">Grade Level *</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
            </div>

            <div>
              <Label htmlFor="topic">Topic/Chapter *</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., Quadratic Equations, Newton's Laws"
                maxLength={200}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`bg-white/50 ${errors.topic ? "border-red-500" : ""}`}
              />
              {errors.topic && <p className="text-sm text-red-500">{errors.topic}</p>}
            </div>

            <div>
              <Label htmlFor="objectives">Learning Objectives (Optional)</Label>
              <Textarea
                id="objectives"
                name="objectives"
                placeholder="Enter specific learning objectives..."
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="bg-white/50 min-h-[100px]"
                maxLength={500}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Lesson Plan
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Generated Content */}
        <Card className="glass-card border-0 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generated Content</h3>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            {generatedContent ? (
              <div className="prose prose-sm max-w-none bg-white/50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm">{generatedContent}</pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your AI-generated lesson plan will appear here</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AILessonGenerator;
