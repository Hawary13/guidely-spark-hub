import { useState, useEffect } from "react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { FastFirestoreService } from "@/lib/fastFirestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  FileText,
  Monitor,
  ImageIcon
} from "lucide-react";
import type { AboutSection, InsertAboutSection } from "@shared/schema";

export default function AboutSectionManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<AboutSection> | null>(null);
  const [formData, setFormData] = useState<Partial<InsertAboutSection>>({
    title: "",
    content: "",
    mission: "",
    vision: "",
    values: [],
    imageUrl: "",
    isActive: true,
  });
  const [valueInput, setValueInput] = useState("");

  const { toast } = useToast();

  // Load existing data from Firestore
  const { data: aboutSections = [], isLoading } = useFirestoreData(
    ['about-sections'],
    () => FastFirestoreService.getAll('about-sections')
  );

  // Default data from landing page if no existing data
  const defaultAboutData = {
    id: 'main-about',
    title: 'About Giza Systems Foundation',
    content: `For Those Committed to transforming systems, elevating communities, and driving solutions that shape resilient, future-ready societies.

Giza Systems Foundation doesn't just create programs – we aggregate existing systems, resources, and opportunities to maximize impact for Egyptian youth. Our approach connects entrepreneurs with the right mentors, programs with the right participants, and ideas with the right resources.

Since our inception, we've been dedicated to fostering innovation, supporting entrepreneurship, and building sustainable pathways for young Egyptians to succeed in the digital economy.`,
    mission: 'Empower Egyptian youth through innovative programs and strategic partnerships.',
    vision: 'A thriving ecosystem of young Egyptian innovators and entrepreneurs.',
    values: [
      'Innovation First - We believe innovation is the key to solving Egypt\'s challenges and creating opportunities for sustainable growth.',
      'Youth Empowerment - We are committed to empowering young Egyptians with the skills, resources, and opportunities they need to succeed.',
      'Sustainable Impact - We focus on creating long-term, sustainable impact that benefits individuals, communities, and the nation.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    isActive: true,
  };

  // Load default data if no existing about section
  useEffect(() => {
    if (!isLoading && aboutSections.length === 0) {
      setFormData(defaultAboutData);
    } else if (!isLoading && aboutSections.length > 0) {
      const activeSection = aboutSections.find(section => section.isActive) || aboutSections[0];
      setFormData(activeSection);
    }
  }, [aboutSections, isLoading]);

  const createMutation = useFirestoreMutation(
    (data: InsertAboutSection) => FastFirestoreService.create('about-sections', data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "About section created successfully!" });
        resetForm();
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to create about section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const updateMutation = useFirestoreMutation(
    ({ id, data }: { id: string; data: Partial<AboutSection> }) => 
      FastFirestoreService.update('about-sections', id, data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "About section updated successfully!" });
        resetForm();
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to update about section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const deleteMutation = useFirestoreMutation(
    (id: string) => FastFirestoreService.delete('about-sections', id),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "About section deleted successfully!" });
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to delete about section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      mission: "",
      vision: "",
      values: [],
      imageUrl: "",
      isActive: true,
    });
    setEditingId(null);
    setShowPreview(false);
    setPreviewData(null);
    setValueInput("");
  };

  const handleEdit = (aboutSection: AboutSection) => {
    setFormData({
      title: aboutSection.title,
      content: aboutSection.content,
      mission: aboutSection.mission,
      vision: aboutSection.vision,
      values: aboutSection.values,
      imageUrl: aboutSection.imageUrl || "",
      isActive: aboutSection.isActive,
    });
    setEditingId(aboutSection.id);
  };

  const addValue = () => {
    if (valueInput.trim()) {
      setFormData({
        ...formData,
        values: [...(formData.values || []), valueInput.trim()]
      });
      setValueInput("");
    }
  };

  const removeValue = (index: number) => {
    setFormData({
      ...formData,
      values: (formData.values || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.mission || !formData.vision) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const data: InsertAboutSection = {
      id: editingId || `about-${Date.now()}`,
      title: formData.title!,
      content: formData.content!,
      mission: formData.mission!,
      vision: formData.vision!,
      values: formData.values || [],
      imageUrl: formData.imageUrl,
      isActive: formData.isActive ?? true,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this about section?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = () => {
    setPreviewData({
      ...formData,
      id: editingId || 'preview',
      lastModified: new Date(),
    } as AboutSection);
    setShowPreview(true);
  };

  const handleActivate = async (id: string) => {
    // Deactivate all other about sections
    const updatePromises = aboutSections
      .filter(a => a.id !== id)
      .map(a => FastFirestoreService.update('about-sections', a.id, { isActive: false }));
    
    await Promise.all(updatePromises);
    
    // Activate the selected one
    updateMutation.mutate({ 
      id, 
      data: { isActive: true } 
    });
  };

  const handleLoadDefaultData = () => {
    setFormData(defaultAboutData);
    setEditingId(null);
    toast({
      title: "Default Data Loaded",
      description: "Landing page content has been loaded for editing",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gsf-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            About Section Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage about us content, mission, vision and core values
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleLoadDefaultData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Load Landing Page Data
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
              {editingId ? "Edit About Section" : "Create About Section"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Section Title *
                </label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="About Giza Systems Foundation"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Main Content *
                </label>
                <Textarea
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell your foundation's story, history, and purpose..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Mission Statement *
                </label>
                <Textarea
                  value={formData.mission || ""}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="Our mission is to..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Vision Statement *
                </label>
                <Textarea
                  value={formData.vision || ""}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="Our vision is to..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Core Values
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                      placeholder="Add a core value"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                    />
                    <Button
                      type="button"
                      onClick={addValue}
                      disabled={!valueInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {formData.values && formData.values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.values.map((value, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {value}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeValue(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Image URL
                </label>
                <Input
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/about-image.jpg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Preview
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-gsf-secondary hover:bg-gsf-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {showPreview && previewData && (
          <Card className="border-2 border-dashed border-gsf-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gsf-primary mb-4">
                    {previewData.title || "About Us"}
                  </h1>
                  {previewData.imageUrl && (
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={previewData.imageUrl} 
                        alt="About"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {previewData.content || "Your content will appear here..."}
                  </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-gsf-primary">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {previewData.mission || "Mission statement will appear here..."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-gsf-primary">Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {previewData.vision || "Vision statement will appear here..."}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Core Values */}
                {previewData.values && previewData.values.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gsf-primary mb-4">Our Core Values</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {previewData.values.map((value, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-gsf-primary rounded-full"></div>
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Existing About Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Existing About Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {aboutSections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No about sections created yet.</p>
              <p className="text-sm">Create your first about section above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aboutSections.map((aboutSection) => (
                <div
                  key={aboutSection.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{aboutSection.title}</h3>
                      {aboutSection.isActive && (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {aboutSection.content.substring(0, 100)}...
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Values: {aboutSection.values.length}</span>
                      <span>Last modified: {aboutSection.lastModified.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!aboutSection.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(aboutSection.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(aboutSection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(aboutSection.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}