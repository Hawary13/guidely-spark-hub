import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { PageContentService, StatisticsService } from "@/lib/firestore";
import type { PageContent, Statistics, InsertPageContent, InsertStatistics } from "@shared/schema";
import { insertPageContentSchema, insertStatisticsSchema } from "@shared/schema";

export default function ImpactPageManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hero");

  // Fetch Impact page content
  const { data: impactPage, isLoading: pageLoading } = useFirestoreData<PageContent>(
    ['pages', 'impact'],
    () => PageContentService.getById('impact'),
    PageContentService.subscribe
  );

  // Fetch Statistics
  const { data: statistics, isLoading: statsLoading } = useFirestoreData<Statistics>(
    ['statistics'],
    StatisticsService.get as any,
    StatisticsService.subscribe
  );

  // Mutations
  const { mutate: updatePage, isPending: pageUpdating } = useFirestoreMutation(
    (data: InsertPageContent) => PageContentService.update('impact', data),
    {
      onSuccess: () => {
        toast({
          title: "Page Updated",
          description: "Impact page content has been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update page content. Please try again.",
          variant: "destructive",
        });
      }
    }
  );

  const { mutate: updateStatistics, isPending: statsUpdating } = useFirestoreMutation(
    (data: InsertStatistics) => StatisticsService.update(data),
    {
      onSuccess: () => {
        toast({
          title: "Statistics Updated",
          description: "Impact statistics have been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update statistics. Please try again.",
          variant: "destructive",
        });
      }
    }
  );

  // Hero Section Form
  const heroForm = useForm<InsertPageContent>({
    resolver: zodResolver(insertPageContentSchema),
    defaultValues: {
      title: impactPage?.title || "Impact & Success Stories",
      subtitle: impactPage?.subtitle || "Success Stories",
      content: impactPage?.content || "Discover how entrepreneurs are building the future through innovation, determination, and the support of our accelerator program.",
      seoTitle: impactPage?.seoTitle || "Impact & Success Stories - GSF",
      seoDescription: impactPage?.seoDescription || "Explore the inspiring success stories and measurable impact of entrepreneurs supported by Giza Systems Foundation accelerator program.",
      isPublished: impactPage?.isPublished ?? true,
    },
  });

  // Statistics Form
  const statsForm = useForm<InsertStatistics>({
    resolver: zodResolver(insertStatisticsSchema),
    defaultValues: {
      totalFundingRaised: statistics?.totalFundingRaised || "$50M+",
      startupSuccessRate: statistics?.startupSuccessRate || "85%",
      jobsCreated: statistics?.jobsCreated || 1200,
      internationalMarkets: statistics?.internationalMarkets || "15+",
      totalStartups: statistics?.totalStartups || 150,
      activePrograms: statistics?.activePrograms || 8,
    },
  });

  // Update forms when data loads
  useState(() => {
    if (impactPage) {
      heroForm.reset({
        title: impactPage.title,
        subtitle: impactPage.subtitle,
        content: impactPage.content,
        seoTitle: impactPage.seoTitle,
        seoDescription: impactPage.seoDescription,
        isPublished: impactPage.isPublished,
      });
    }
  }, [impactPage]);

  useState(() => {
    if (statistics) {
      statsForm.reset({
        totalFundingRaised: statistics.totalFundingRaised,
        startupSuccessRate: statistics.startupSuccessRate,
        jobsCreated: statistics.jobsCreated,
        internationalMarkets: statistics.internationalMarkets,
        totalStartups: statistics.totalStartups,
        activePrograms: statistics.activePrograms,
      });
    }
  }, [statistics]);

  const handleHeroSubmit = (data: InsertPageContent) => {
    updatePage(data);
  };

  const handleStatsSubmit = (data: InsertStatistics) => {
    updateStatistics(data);
  };

  if (pageLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading Impact page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Impact Page Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all content sections for the Impact & Success Stories page
          </p>
        </div>
        <Badge variant={impactPage?.isPublished ? "default" : "secondary"} className="flex items-center gap-2">
          {impactPage?.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {impactPage?.isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="impact-areas">Impact Areas</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Hero Section Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...heroForm}>
                <form onSubmit={heroForm.handleSubmit(handleHeroSubmit)} className="space-y-6">
                  <FormField
                    control={heroForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Impact & Success Stories"
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heroForm.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge Text</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Success Stories"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heroForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Discover how entrepreneurs are building the future..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={pageUpdating} className="flex items-center gap-2">
                      {pageUpdating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {pageUpdating ? "Updating..." : "Update Hero Section"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Impact Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...statsForm}>
                <form onSubmit={statsForm.handleSubmit(handleStatsSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={statsForm.control}
                      name="totalFundingRaised"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Funding Raised</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="$50M+"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="startupSuccessRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Success Rate</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="85%"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="jobsCreated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jobs Created</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="1200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="internationalMarkets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>International Markets</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="15+"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="totalStartups"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Startups</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="150"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="activePrograms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Active Programs</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="8"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={statsUpdating} className="flex items-center gap-2">
                      {statsUpdating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {statsUpdating ? "Updating..." : "Update Statistics"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact-areas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Impact Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Plus className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Impact Areas Configuration</h3>
                    <p className="text-sm">
                      Impact areas are currently hardcoded with Technology, Social Impact, FinTech, and E-commerce.
                      These can be made dynamic in future updates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Technology", description: "AI, blockchain, and digital transformation solutions", stats: "45+ startups" },
                    { title: "Social Impact", description: "Education, healthcare, and sustainability ventures", stats: "30+ ventures" },
                    { title: "FinTech", description: "Digital payments and financial inclusion", stats: "25+ companies" },
                    { title: "E-commerce", description: "Online marketplaces and retail innovation", stats: "35+ platforms" }
                  ].map((area, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{area.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{area.description}</p>
                        <Badge variant="secondary" className="text-xs">{area.stats}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...heroForm}>
                <form onSubmit={heroForm.handleSubmit(handleHeroSubmit)} className="space-y-6">
                  <FormField
                    control={heroForm.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Impact & Success Stories - GSF"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={heroForm.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3}
                            placeholder="Explore the inspiring success stories and measurable impact..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={pageUpdating} className="flex items-center gap-2">
                      {pageUpdating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {pageUpdating ? "Updating..." : "Update SEO Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}