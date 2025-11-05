import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface LeaveManagementProps {
  onBack: () => void;
}

const LeaveManagement = ({ onBack }: LeaveManagementProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!date || !reason) {
      toast({
        title: "Missing Information",
        description: "Please select a date and provide a reason",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Leave Request Submitted",
      description: "AI is automatically adjusting your schedule and finding substitutes",
    });
    setReason("");
  };

  const leaveHistory = [
    { date: "Dec 15, 2024", reason: "Medical", status: "approved", substitute: "Dr. Smith" },
    { date: "Nov 28, 2024", reason: "Personal", status: "approved", substitute: "Prof. Johnson" },
    { date: "Nov 10, 2024", reason: "Conference", status: "pending", substitute: "TBD" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-muted-foreground">Request leave with AI-powered auto-substitution</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card border-0 p-6">
          <h3 className="font-semibold mb-4">Request Leave</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Select Date(s)</Label>
              <div className="mt-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border bg-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-white/50 mt-2"
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>AI Auto-Substitution:</strong> Our AI will automatically redistribute your 
                workload and assign suitable substitutes based on availability and subject expertise.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Submit Leave Request
            </Button>
          </div>
        </Card>

        <Card className="glass-card border-0 p-6">
          <h3 className="font-semibold mb-4">Leave History</h3>
          
          <div className="space-y-3">
            {leaveHistory.map((leave, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/50 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{leave.date}</p>
                    <p className="text-sm text-muted-foreground">{leave.reason}</p>
                  </div>
                  <Badge
                    variant={
                      leave.status === "approved" ? "default" :
                      leave.status === "pending" ? "secondary" : "destructive"
                    }
                    className="flex items-center gap-1"
                  >
                    {leave.status === "approved" && <CheckCircle className="h-3 w-3" />}
                    {leave.status === "pending" && <Clock className="h-3 w-3" />}
                    {leave.status === "rejected" && <XCircle className="h-3 w-3" />}
                    {leave.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Substitute: <span className="font-medium text-foreground">{leave.substitute}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeaveManagement;
