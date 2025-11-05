import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  GraduationCap,
  FileText
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { getStaff, getLeaveRequests, getAnalyticsData, initializeSampleData } from "@/lib/localStorage";

interface LeaveRequest {
  id: string;
  staffName: string;
  dates: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface Staff {
  id: string;
  name: string;
  role: string;
  workload: number;
  status: "active" | "on-leave";
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalStaff: 0,
    activeStaff: 0,
    totalLessons: 0,
    pendingLeaveRequests: 0,
    averageWorkload: 0,
    departmentDistribution: {} as Record<string, number>,
  });

  useEffect(() => {
    const load = async () => {
      try {
        initializeSampleData();
        const staffData = getStaff();
        const leaveData = getLeaveRequests() as any;
        const a = getAnalyticsData();
        setStaffList(staffData.map((s: any) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          workload: s.workload,
          status: s.status === "on_leave" ? "on-leave" : (s.status as any),
        })));
        setLeaveRequests(
          (leaveData || []).map((r: any) => ({
            id: r.id,
            staffName: r.submittedBy || "Unknown",
            dates: `${r.startDate} - ${r.endDate}`,
            reason: r.reason,
            status: r.status,
          }))
        );
        setAnalytics(a);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLeaveAction = (id: string, action: "approved" | "rejected") => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: action } : req)
    );
    toast({
      title: action === "approved" ? "Leave Approved" : "Leave Rejected",
      description: `Leave request has been ${action}.`,
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage institution, staff, and monitor overall performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStaff}</div>
              <p className="text-xs text-muted-foreground">{analytics.activeStaff} active</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.max(analytics.totalStaff * 20, 100)}</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pendingLeaveRequests}</div>
              <p className="text-xs text-muted-foreground">Leave applications</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Content Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLessons}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leave" className="space-y-4">
          <TabsList className="glass-card">
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="staff">Staff Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Leave Management Tab */}
          <TabsContent value="leave" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Review and approve staff leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.staffName}</TableCell>
                        <TableCell>{request.dates}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === "approved" ? "default" : 
                            request.status === "rejected" ? "destructive" : 
                            "secondary"
                          }>
                            {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {request.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleLeaveAction(request.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleLeaveAction(request.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Overview Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Monitor staff workload and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Workload</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-secondary rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  staff.workload > 80 ? 'bg-red-500' : 
                                  staff.workload > 60 ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ width: `${staff.workload}%` }}
                              />
                            </div>
                            <span className="text-sm">{staff.workload}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={staff.status === "active" ? "default" : "secondary"}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">AI Content Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">Lessons Generated</span>
                    </div>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      <span className="text-sm">Assessments Created</span>
                    </div>
                    <span className="font-bold">78</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-500" />
                      <span className="text-sm">Weekly Plans</span>
                    </div>
                    <span className="font-bold">24</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI API Response Time</span>
                    <Badge variant="default">Fast</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sessions</span>
                    <span className="font-bold">142</span>
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

export default AdminDashboard;
