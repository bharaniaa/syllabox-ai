import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AILessonGeneratorProps {
  onBack: () => void;
}

const AILessonGenerator = ({ onBack }: AILessonGeneratorProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [objectives, setObjectives] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrors({});

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

    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedContent(`# ${s} Lesson Plan - Grade ${grade}

## Topic: ${t}

### Learning Objectives
${o || "Students will understand the core concepts of " + t}

### Introduction (10 minutes)
- Begin with a real-world example related to ${topic}
- Ask students what they already know about the subject
- Present the day's learning objectives

### Main Content (30 minutes)
1. **Concept Introduction**
   - Define key terms and concepts
   - Use visual aids and diagrams
   - Provide concrete examples

2. **Interactive Activity**
   - Group discussion on practical applications
   - Hands-on demonstration or experiment
   - Problem-solving exercises

3. **Reinforcement**
   - Review main points
   - Address student questions
   - Connect to previous lessons

### Assessment (10 minutes)
- Quick quiz or worksheet
- Class discussion
- Exit ticket to gauge understanding

### Homework Assignment
- Reading: Pages related to ${topic}
- Practice problems
- Prepare questions for next class

### Materials Needed
- Whiteboard and markers
- Handouts
- Digital presentation
- Reference materials

### Notes for Teacher
- Adjust pacing based on student comprehension
- Have additional examples ready
- Prepare extension activities for advanced students`);
      
      setIsGenerating(false);
      toast({
        title: "Lesson Generated!",
        description: "Your AI-powered lesson plan is ready",
      });
    }, 2000);
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
