import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeeklyPlannerProps {
  onBack: () => void;
}

const WeeklyPlanner = ({ onBack }: WeeklyPlannerProps) => {
  const [selectedWeek, setSelectedWeek] = useState("Week 12");

  const weeklySchedule = [
    {
      day: "Monday",
      slots: [
        { time: "9:00 AM", subject: "Mathematics", topic: "Calculus - Integration", class: "Grade 12A" },
        { time: "11:00 AM", subject: "Mathematics", topic: "Algebra Review", class: "Grade 11B" },
      ]
    },
    {
      day: "Tuesday",
      slots: [
        { time: "10:00 AM", subject: "Physics", topic: "Thermodynamics", class: "Grade 12A" },
        { time: "2:00 PM", subject: "Mathematics", topic: "Statistics", class: "Grade 10C" },
      ]
    },
    {
      day: "Wednesday",
      slots: [
        { time: "9:00 AM", subject: "Mathematics", topic: "Geometry", class: "Grade 11A" },
        { time: "1:00 PM", subject: "Mathematics", topic: "Trigonometry", class: "Grade 12B" },
      ]
    },
    {
      day: "Thursday",
      slots: [
        { time: "10:00 AM", subject: "Physics", topic: "Optics", class: "Grade 11B" },
        { time: "3:00 PM", subject: "Mathematics", topic: "Probability", class: "Grade 10A" },
      ]
    },
    {
      day: "Friday",
      slots: [
        { time: "9:00 AM", subject: "Mathematics", topic: "Calculus - Differentiation", class: "Grade 12A" },
        { time: "11:00 AM", subject: "Assessment", topic: "Weekly Quiz", class: "Grade 11B" },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Weekly Planner</h2>
            <p className="text-muted-foreground">Manage your weekly schedule</p>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      <div className="flex gap-2">
        {["Week 11", "Week 12", "Week 13", "Week 14"].map((week) => (
          <Button
            key={week}
            variant={selectedWeek === week ? "default" : "outline"}
            onClick={() => setSelectedWeek(week)}
            className={selectedWeek === week ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {week}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {weeklySchedule.map((day, dayIndex) => (
          <Card key={day.day} className="glass-card border-0 p-6">
            <h3 className="font-semibold text-lg mb-4">{day.day}</h3>
            <div className="space-y-3">
              {day.slots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-muted-foreground w-20">
                      {slot.time}
                    </div>
                    <div>
                      <p className="font-semibold">{slot.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{slot.subject}</Badge>
                        <span className="text-xs text-muted-foreground">{slot.class}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
