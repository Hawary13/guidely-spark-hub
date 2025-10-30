import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Save, Eye, FileText, Home, Users, TrendingUp } from "lucide-react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { PageContentService, StatisticsService } from "@/lib/firestore";
import type { PageContent, Statistics, InsertPageContent, InsertStatistics } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const pageContentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  aboutTitle: z.string().optional(),
  aboutContent: z.string().optional(),
  seoTitle: z.string().min(1, "SEO title is required"),
  seoDescription: z.string().min(1, "SEO description is required"),
  seoKeywords: z.string().optional(),
});

const statisticsSchema = z.object({
  youthEmpowered: z.number().min(0),
  innovationProjects: z.number().min(0),
  partnerOrganizations: z.number().min(0),
  awardsWon: z.number().min(0),
  totalFundingRaised: z.string().min(1),
  startupSuccessRate: z.string().min(1),
  jobsCreated: z.number().min(0),
  internationalMarkets: z.number().min(0),
});

type PageContentForm = z.infer<typeof pageContentSchema>;
type StatisticsForm = z.infer<typeof statisticsSchema>;

export default function PagesEditor() {

  const [selectedPage, setSelectedPage] = useState("home");
  const { toast } = useToast();

  // Load page content
  const { data: pages = [] } = useFirestoreData<PageContent>(
    ['admin', 'pages'],
    PageContentService.getAll
  );

  // Load statistics
  const { data: statistics } = useFirestoreData<Statistics>(
    ['admin', 'statistics'],
    StatisticsService.get as any
  );

  const currentPage = pages.find(p => p.slug === selectedPage);

  const pageForm = useForm<PageContentForm>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      slug: selectedPage,
      title: currentPage?.title || "",
      heroTitle: currentPage?.content?.heroTitle || "",
      heroSubtitle: currentPage?.content?.heroSubtitle || "",
      aboutTitle: currentPage?.content?.aboutTitle || "",
      aboutContent: currentPage?.content?.aboutContent || "",
      seoTitle: currentPage?.seoTitle || "",
      seoDescription: currentPage?.seoDescription || "",
      seoKeywords: currentPage?.seoKeywords || "",
    },
  });

  const statisticsForm = useForm<StatisticsForm>({
    resolver: zodResolver(statisticsSchema),
    defaultValues: {
      youthEmpowered: statistics?.youthEmpowered || 5000,
      innovationProjects: statistics?.innovationProjects || 200,
      partnerOrganizations: statistics?.partnerOrganizations || 50,
      awardsWon: statistics?.awardsWon || 15,
      totalFundingRaised: statistics?.totalFundingRaised || "$25M+",
      startupSuccessRate: statistics?.startupSuccessRate || "85%",
      jobsCreated: statistics?.jobsCreated || 2000,
      internationalMarkets: statistics?.internationalMarkets || 15,
    },
  });

  // Mutations
  const updatePageMutation = useFirestoreMutation<string, any>(
    async (data) => {
      if (currentPage) {
        await PageContentService.update(currentPage.id, data);
        return currentPage.id;
      } else {
        return await PageContentService.create(data);
      }
    },
    {
      onSuccess: () => {
        toast({
          title: "Page Updated",
          description: "Page content has been saved successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Update Failed",
          description: "Failed to update page content. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const updateStatsMutation = useFirestoreMutation<void, Partial<Statistics>>(
    StatisticsService.update,
    {
      onSuccess: () => {
        toast({
          title: "Statistics Updated",
          description: "Impact statistics have been updated successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Update Failed",
          description: "Failed to update statistics. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  const onPageSubmit = (data: PageContentForm) => {
    const pageData = {
      slug: data.slug,
      title: data.title,
      content: {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        aboutTitle: data.aboutTitle,
        aboutContent: data.aboutContent,
      },
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      isPublished: true,
    };

    updatePageMutation.mutate(pageData);
  };

  const onStatsSubmit = (data: StatisticsForm) => {
    updateStatsMutation.mutate(data);
  };

  const pages_list = [
    { id: "home", title: "Home Page", icon: Home },
    { id: "about", title: "About Us", icon: Users },
    { id: "impact", title: "Impact & Stories", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-gsf-primary dark:text-white">
              Pages Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage page content, SEO settings, and website statistics.
            </p>
          </div>

          <Tabs value={selectedPage} onValueChange={setSelectedPage} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              {pages_list.map((page) => {
                const Icon = page.icon;
                return (
                  <TabsTrigger key={page.id} value={page.id} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{page.title}</span>
                  </TabsTrigger>
                );
              })}
              <TabsTrigger value="statistics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>

            {pages_list.map((page) => (
              <TabsContent key={page.id} value={page.id} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Content Editor */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          {page.title} Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Form {...pageForm}>
                          <form onSubmit={pageForm.handleSubmit(onPageSubmit)} className="space-y-6">
                            <FormField
                              control={pageForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Page Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter page title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={pageForm.control}
                              name="heroTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Hero Section Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Main headline for the hero section" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={pageForm.control}
                              name="heroSubtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Hero Section Subtitle</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Supporting text for the hero section"
                                      rows={3}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {page.id === "about" && (
                              <>
                                <FormField
                                  control={pageForm.control}
                                  name="aboutTitle"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>About Section Title</FormLabel>
                                      <FormControl>
                                        <Input placeholder="About section headline" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={pageForm.control}
                                  name="aboutContent"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>About Section Content</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Detailed about content"
                                          rows={6}
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}

                            <div className="flex items-center space-x-4">
                              <Button 
                                type="submit" 
                                disabled={updatePageMutation.isPending}
                                className="bg-gsf-secondary hover:bg-gsf-primary"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                {updatePageMutation.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                              <Button variant="outline" type="button">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SEO Settings */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>SEO Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={pageForm.control}
                          name="seoTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Page title for search engines" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={pageForm.control}
                          name="seoDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Meta description for search engines"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={pageForm.control}
                          name="seoKeywords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Keywords</FormLabel>
                              <FormControl>
                                <Input placeholder="Comma-separated keywords" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}

            <TabsContent value="statistics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Impact Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...statisticsForm}>
                    <form onSubmit={statisticsForm.handleSubmit(onStatsSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={statisticsForm.control}
                          name="youthEmpowered"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Youth Empowered</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="innovationProjects"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Innovation Projects</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="partnerOrganizations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Partner Organizations</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="awardsWon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Awards Won</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="totalFundingRaised"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Funding Raised</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $25M+" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="startupSuccessRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Startup Success Rate</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 85%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="jobsCreated"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jobs Created</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={statisticsForm.control}
                          name="internationalMarkets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>International Markets</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={updateStatsMutation.isPending}
                        className="bg-gsf-secondary hover:bg-gsf-primary"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateStatsMutation.isPending ? "Updating..." : "Update Statistics"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
