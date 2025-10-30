import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { StatisticsService } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Statistics, InsertStatistics } from "@shared/schema";
import { insertStatisticsSchema } from "@shared/schema";

export default function StatisticsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: statistics, isLoading } = useFirestoreData<Statistics>(
    ['statistics'],
    StatisticsService.get as any,
    StatisticsService.subscribe
  );

  const form = useForm<InsertStatistics>({
    resolver: zodResolver(insertStatisticsSchema),
    defaultValues: {
      totalFundingRaised: "",
      startupSuccessRate: "",
      jobsCreated: 0,
      internationalMarkets: 0,
      totalStartups: 0,
      activePrograms: 0,
      mentorsNetworked: 0,
      partnershipsForged: 0
    }
  });

  const updateMutation = useFirestoreMutation(
    (data: InsertStatistics) => StatisticsService.update(data),
    {
      onSuccess: () => {
        toast({ title: "Statistics updated successfully!" });
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast({ title: "Error updating statistics", description: error.message, variant: "destructive" });
      }
    }
  );

  const onSubmit = (data: InsertStatistics) => {
    const submitData = {
      ...data,
      lastUpdated: new Date()
    };
    updateMutation.mutate(submitData);
  };

  const handleEdit = () => {
    if (statistics) {
      form.reset(statistics);
    }
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gsf-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gsf-primary dark:text-white">Impact Statistics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage and update GSF's impact metrics displayed on the website.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Update Statistics
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Impact Statistics</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="totalFundingRaised"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Funding Raised</FormLabel>
                        <FormControl>
                          <Input placeholder="$50M+" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startupSuccessRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startup Success Rate</FormLabel>
                        <FormControl>
                          <Input placeholder="85%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobsCreated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jobs Created</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1200" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="internationalMarkets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>International Markets</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalStartups"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Startups Supported</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="250" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activePrograms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Programs</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="8" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mentorsNetworked"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mentors in Network</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="150" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partnershipsForged"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partnerships Forged</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="75" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    Update Statistics
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Statistics Display */}
      {statistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-gsf-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-secondary mb-2">
              {statistics.totalFundingRaised}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Total Funding Raised</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-green/10 dark:bg-gsf-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-gsf-green" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-green mb-2">
              {statistics.startupSuccessRate}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Startup Success Rate</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-purple/10 dark:bg-gsf-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-gsf-purple" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-purple mb-2">
              {statistics.jobsCreated.toLocaleString()}+
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Jobs Created</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-yellow/10 dark:bg-gsf-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-gsf-yellow" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-yellow mb-2">
              {statistics.internationalMarkets}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">International Markets</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-primary/10 dark:bg-gsf-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-gsf-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-primary mb-2">
              {statistics.totalStartups}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Total Startups Supported</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-red/10 dark:bg-gsf-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-gsf-red" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-red mb-2">
              {statistics.activePrograms}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Active Programs</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-teal/10 dark:bg-gsf-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-gsf-teal" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-teal mb-2">
              {statistics.mentorsNetworked}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Mentors in Network</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-gsf-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold text-gsf-secondary mb-2">
              {statistics.partnershipsForged}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Partnerships Forged</p>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No statistics configured
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Set up your impact statistics to showcase GSF's achievements.
          </p>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Add Statistics
          </Button>
        </Card>
      )}

      {statistics && (
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Statistics Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last Updated:</strong> {statistics.lastUpdated ? new Date(statistics.lastUpdated).toLocaleDateString() : 'Never'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These statistics are displayed on the Impact & Success Stories page to showcase GSF's collective achievements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}