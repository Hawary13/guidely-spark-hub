import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestore";
import { 
  ProgramService, 
  EventService, 
  FormSubmissionService, 
  StatisticsService,
  SuccessStoryService,
  NewsService 
} from "@/lib/firestore";
import type { Program, Event, FormSubmission, Statistics } from "@shared/schema";

export default function AdminDashboard() {

  // Load dashboard data
  const { data: programs = [] } = useFirestoreData<Program>(
    ['admin', 'programs'],
    ProgramService.getAll
  );

  const { data: events = [] } = useFirestoreData<Event>(
    ['admin', 'events'],
    EventService.getAll
  );

  const { data: submissions = [] } = useFirestoreData<FormSubmission>(
    ['admin', 'submissions'],
    FormSubmissionService.getAll
  );

  const { data: statistics } = useFirestoreData<Statistics>(
    ['admin', 'statistics'],
    StatisticsService.get as any
  );

  // Calculate dashboard metrics
  const activePrograms = programs.filter(p => p.status === 'Active').length;
  const upcomingEvents = events.filter(e => e.date >= new Date() && e.isPublished).length;
  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-gsf-primary dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Here's an overview of your GSF platform.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Programs
                    </p>
                    <p className="text-2xl font-bold text-gsf-primary dark:text-white">
                      {activePrograms}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gsf-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold text-gsf-primary dark:text-white">
                      {upcomingEvents}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gsf-green/10 dark:bg-gsf-green/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gsf-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      New Submissions
                    </p>
                    <p className="text-2xl font-bold text-gsf-primary dark:text-white">
                      {newSubmissions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gsf-yellow/10 dark:bg-gsf-yellow/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-gsf-yellow" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Impact
                    </p>
                    <p className="text-2xl font-bold text-gsf-primary dark:text-white">
                      {statistics?.youthEmpowered.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gsf-purple/10 dark:bg-gsf-purple/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-gsf-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Programs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Recent Programs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {programs.slice(0, 5).map((program) => (
                        <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gsf-primary dark:text-white">
                              {program.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {program.status} • {program.participants}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events
                        .filter(e => e.date >= new Date())
                        .slice(0, 5)
                        .map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-semibold text-gsf-primary dark:text-white">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {event.date.toLocaleDateString()} • {event.type}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Statistics */}
              {statistics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Impact Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gsf-secondary mb-2">
                          {statistics.totalFundingRaised}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Funding</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gsf-green mb-2">
                          {statistics.startupSuccessRate}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gsf-purple mb-2">
                          {statistics.jobsCreated.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Jobs Created</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gsf-yellow mb-2">
                          {statistics.internationalMarkets}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Markets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            submission.status === 'new' ? 'bg-gsf-red' : 
                            submission.status === 'reviewed' ? 'bg-gsf-yellow' : 
                            'bg-gsf-green'
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gsf-primary dark:text-white">
                              {submission.data.name || 'Unknown'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {submission.type} • {submission.submittedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            submission.status === 'new' ? 'bg-gsf-red/10 text-gsf-red' :
                            submission.status === 'reviewed' ? 'bg-gsf-yellow/10 text-gsf-yellow' :
                            'bg-gsf-green/10 text-gsf-green'
                          }`}>
                            {submission.status}
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {programs.map((program) => (
                        <div key={program.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{program.title}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-gsf-secondary rounded-full" 
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.floor(Math.random() * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{event.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {Math.floor(Math.random() * 200)} attendees
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quick-actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gsf-secondary mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Create New Program</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Add a new program to the GSF portfolio
                    </p>
                    <Button className="w-full">Create Program</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-gsf-green mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Schedule Event</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Create a new event or workshop
                    </p>
                    <Button className="w-full">Schedule Event</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-gsf-yellow mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Add Success Story</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Share a new entrepreneur success story
                    </p>
                    <Button className="w-full">Add Story</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-gsf-purple mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Update Statistics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Update impact numbers and metrics
                    </p>
                    <Button className="w-full">Update Stats</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-gsf-teal mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Manage Team</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Add or update team member profiles
                    </p>
                    <Button className="w-full">Manage Team</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gsf-red mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold mb-2">Review Submissions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Process new application submissions
                    </p>
                    <Button className="w-full">Review All</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
  );
}
