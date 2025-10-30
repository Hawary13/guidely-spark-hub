import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { FastUnSdgService } from "@/lib/fastFirestore";
import { UnSdg, InsertUnSdg, insertUnSdgSchema } from "@shared/schema";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Target } from "lucide-react";

// Default UN SDGs data for loading
const defaultUnSdgs = [
  {
    id: "sdg-10",
    sdgNumber: 10,
    title: "Reduced Inequalities",
    description: "Bridging the digital divide by providing equal access to technology education and entrepreneurship opportunities for all Egyptian youth, regardless of background.",
    colorFrom: "red-500",
    colorTo: "pink-500",
    isActive: true,
  },
  {
    id: "sdg-12",
    sdgNumber: 12,
    title: "Responsible Consumption and Production",
    description: "Promoting sustainable business practices and circular economy principles through our incubation programs and startup support initiatives.",
    colorFrom: "yellow-500",
    colorTo: "orange-500",
    isActive: true,
  },
  {
    id: "sdg-17",
    sdgNumber: 17,
    title: "Partnerships for the Goals",
    description: "Building strategic alliances with local and international organizations to amplify impact and create sustainable solutions for Egyptian communities.",
    colorFrom: "blue-500",
    colorTo: "purple-500",
    isActive: true,
  },
];

export default function UnSdgsManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Fetch UN SDGs data
  const { data: unSdgs = [], isLoading, refetch } = useFirestoreData<UnSdg[]>({
    queryKey: ['un-sdgs'],
    queryFn: () => FastUnSdgService.getAll(),
  });

  // Mutations
  const createMutation = useFirestoreMutation(
    (data: InsertUnSdg) => FastUnSdgService.create(data),
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "UN SDG created successfully",
        });
        refetch();
        setEditingId(null);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create UN SDG",
          variant: "destructive",
        });
      },
    }
  );

  const updateMutation = useFirestoreMutation(
    ({ id, data }: { id: string; data: Partial<UnSdg> }) => 
      FastUnSdgService.update(id, data),
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "UN SDG updated successfully",
        });
        refetch();
        setEditingId(null);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update UN SDG",
          variant: "destructive",
        });
      },
    }
  );

  const deleteMutation = useFirestoreMutation(
    (id: string) => FastUnSdgService.delete(id),
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "UN SDG deleted successfully",
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete UN SDG",
          variant: "destructive",
        });
      },
    }
  );

  // Form setup
  const form = useForm<InsertUnSdg>({
    resolver: zodResolver(insertUnSdgSchema),
    defaultValues: {
      id: "",
      sdgNumber: 1,
      title: "",
      description: "",
      colorFrom: "",
      colorTo: "",
      isActive: true,
    },
  });

  const handleSubmit = async (formData: InsertUnSdg) => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingId && unSdgs.find(sdg => sdg.id === editingId)) {
      // Update existing
      updateMutation.mutate({
        id: editingId,
        data: formData as Partial<UnSdg>
      });
    } else {
      // Create new
      const data: InsertUnSdg = {
        ...formData,
        id: editingId || `sdg-${formData.sdgNumber}`,
        title: formData.title!,
        description: formData.description!,
        colorFrom: formData.colorFrom!,
        colorTo: formData.colorTo!,
        isActive: formData.isActive ?? true,
      };
      createMutation.mutate(data);
    }
  };

  const handleEdit = (unSdg: UnSdg) => {
    setEditingId(unSdg.id);
    form.reset({
      id: unSdg.id,
      sdgNumber: unSdg.sdgNumber,
      title: unSdg.title,
      description: unSdg.description,
      colorFrom: unSdg.colorFrom,
      colorTo: unSdg.colorTo,
      isActive: unSdg.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this UN SDG?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = (unSdg: UnSdg) => {
    // Create preview data
    setShowPreview(true);
  };

  const handleLoadDefaultData = () => {
    // Load all default UN SDGs
    defaultUnSdgs.forEach(async (sdg) => {
      try {
        await FastUnSdgService.create(sdg);
      } catch (error) {
        // SDG might already exist
      }
    });
    
    refetch();
    toast({
      title: "Default Data Loaded",
      description: "Default UN SDGs have been loaded",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gsf-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading UN SDGs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            UN SDGs Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage UN Sustainable Development Goals content and preview changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleLoadDefaultData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Load Default UN SDGs
          </Button>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingId ? "Edit UN SDG" : "Create UN SDG"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sdgNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SDG Number (1-17)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="17"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Reduced Inequalities" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe how your organization contributes to this SDG..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="colorFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gradient Color From</FormLabel>
                        <FormControl>
                          <Input placeholder="red-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gradient Color To</FormLabel>
                        <FormControl>
                          <Input placeholder="pink-500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingId
                      ? "Update SDG"
                      : "Create SDG"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* UN SDGs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              UN SDGs ({unSdgs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unSdgs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No UN SDGs found</p>
                <p className="text-sm">Click "Load Default UN SDGs" to get started</p>
              </div>
            ) : (
              unSdgs.map((unSdg) => (
                <div
                  key={unSdg.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${unSdg.colorFrom} to-${unSdg.colorTo} flex items-center justify-center text-white text-sm font-bold`}>
                        {unSdg.sdgNumber}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {unSdg.title}
                      </h3>
                      {unSdg.isActive ? (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {unSdg.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(unSdg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(unSdg)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(unSdg.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>UN SDGs Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {unSdgs.filter(sdg => sdg.isActive).map((unSdg) => (
                <div
                  key={unSdg.id}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border rounded-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${unSdg.colorFrom}/10 to-${unSdg.colorTo}/10 group-hover:from-${unSdg.colorFrom}/20 group-hover:to-${unSdg.colorTo}/20 transition-all duration-300`}></div>
                  <div className="relative p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-${unSdg.colorFrom} to-${unSdg.colorTo} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {unSdg.sdgNumber}
                    </div>
                    <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                      {unSdg.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {unSdg.description}
                    </p>
                    <div className="mt-6 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-${unSdg.colorFrom} to-${unSdg.colorTo} rounded-full transform scale-x-75 group-hover:scale-x-100 transition-transform duration-700`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}