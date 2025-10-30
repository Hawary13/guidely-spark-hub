import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Award, TrendingUp, Upload } from "lucide-react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { SuccessStoryService } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import type { SuccessStory, InsertSuccessStory } from "@shared/schema";
import { insertSuccessStorySchema } from "@shared/schema";
import AddSuccessStories from "@/components/admin/AddSuccessStories";

export default function SuccessStoriesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const { toast } = useToast();

  const { data: successStories = [], isLoading } = useFirestoreData<SuccessStory>(
    ['success-stories'],
    SuccessStoryService.getAll,
    SuccessStoryService.subscribe
  );

  const form = useForm<InsertSuccessStory>({
    resolver: zodResolver(insertSuccessStorySchema),
    defaultValues: {
      personName: "",
      personTitle: "",
      companyName: "",
      story: "",
      quote: "",
      achievements: [],
      fundingRaised: "",
      jobsCreated: "0",
      revenue: "",
      imageUrl: "",
      linkedinUrl: "",
      companyUrl: "",
      industry: "",
      programAttended: "",
      yearCompleted: new Date().getFullYear().toString(),
      isPublished: true
    }
  });

  const createMutation = useFirestoreMutation(
    SuccessStoryService.create,
    {
      onSuccess: () => {
        toast({ title: "Success story created successfully!" });
        setIsDialogOpen(false);
        form.reset();
      },
      onError: (error: any) => {
        toast({ title: "Error creating success story", description: error.message, variant: "destructive" });
      }
    }
  );

  const updateMutation = useFirestoreMutation(
    ({ id, data }: { id: string; data: Partial<SuccessStory> }) => 
      SuccessStoryService.update(id, data),
    {
      onSuccess: () => {
        toast({ title: "Success story updated successfully!" });
        setIsDialogOpen(false);
        setEditingStory(null);
        form.reset();
      },
      onError: (error: any) => {
        toast({ title: "Error updating success story", description: error.message, variant: "destructive" });
      }
    }
  );

  const deleteMutation = useFirestoreMutation(
    SuccessStoryService.delete,
    {
      onSuccess: () => {
        toast({ title: "Success story deleted successfully!" });
      },
      onError: (error: any) => {
        toast({ title: "Error deleting success story", description: error.message, variant: "destructive" });
      }
    }
  );

  const onSubmit = (data: any) => {
    // Convert achievements string to array
    const achievementsArray = typeof data.achievements === 'string' 
      ? data.achievements.split('\n').filter((a: string) => a.trim())
      : data.achievements;

    const submitData = {
      ...data,
      achievements: achievementsArray,
      createdAt: new Date()
    };

    if (editingStory) {
      updateMutation.mutate({ id: editingStory.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (story: SuccessStory) => {
    setEditingStory(story);
    form.reset({
      ...story,
      achievements: story.achievements.join('\n') as any
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this success story?')) {
      deleteMutation.mutate(id);
    }
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
          <h1 className="text-3xl font-bold text-gsf-primary dark:text-white">Success Stories</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage inspiring stories from GSF alumni and program participants.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingStory(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Success Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="personName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Person Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Person Title</FormLabel>
                        <FormControl>
                          <Input placeholder="CEO & Founder" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="TechStartup Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="FinTech, E-commerce, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Story</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell the complete story of their journey..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A memorable quote from the person..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Achievements (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Raised $1M in funding&#10;Expanded to 3 countries&#10;Created 50+ jobs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="fundingRaised"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Raised</FormLabel>
                        <FormControl>
                          <Input placeholder="$1.2M" {...field} />
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
                            placeholder="50" 
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
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Revenue</FormLabel>
                        <FormControl>
                          <Input placeholder="$500K ARR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="programAttended"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Attended</FormLabel>
                        <FormControl>
                          <Input placeholder="Startup Accelerator Program" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearCompleted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Completed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2023" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Published</SelectItem>
                          <SelectItem value="false">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingStory ? 'Update' : 'Create'} Success Story
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Stories</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{story.personName}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {story.personTitle} at {story.companyName}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={story.isPublished ? "default" : "secondary"}>
                      {story.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">
                      Tech
                    </Badge>
                  </div>
                  
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.personName}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {story.story}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {story.fundingRaised && (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {story.fundingRaised}
                        </div>
                      )}
                      {story.jobsCreated && (
                        <div className="flex items-center text-purple-600">
                          <Award className="h-4 w-4 mr-1" />
                          {story.jobsCreated} jobs
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    GSF Program • 2023
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {successStories.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No success stories yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start by adding your first success story to showcase GSF's impact.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bulk-upload">
          <AddSuccessStories />
        </TabsContent>
      </Tabs>
    </div>
  );
}