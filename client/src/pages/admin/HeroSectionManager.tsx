import { useState, useEffect } from "react";
import { useFirestoreData, useFirestoreMutation } from "@/hooks/useFirestore";
import { FastFirestoreService } from "@/lib/fastFirestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  ExternalLink,
  Monitor,
  FileText
} from "lucide-react";
import type { HeroSection, InsertHeroSection } from "@shared/schema";

export default function HeroSectionManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<HeroSection> | null>(null);
  const [formData, setFormData] = useState<Partial<InsertHeroSection>>({
    title: "",
    subtitle: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    backgroundImageUrl: "",
    isActive: true,
  });

  const { toast } = useToast();

  // Load existing data from Firestore
  const { data: heroSections = [], isLoading } = useFirestoreData(
    ['hero-sections'],
    () => FastFirestoreService.getAll('hero-sections')
  );

  // Default data from landing page
  const defaultHeroData = {
    id: 'main-hero',
    title: 'Giza Systems Foundation',
    subtitle: 'We are system aggregators, connecting opportunities with talent, resources with innovation, and dreams with reality.',
    description: 'Empowering Egyptian youth through innovative programs and strategic partnerships in the digital economy.',
    primaryButtonText: 'Get Involved',
    primaryButtonLink: '/join',
    secondaryButtonText: 'Explore Programs',
    secondaryButtonLink: '/programs',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800',
    isActive: true,
  };

  // Load default data if no existing hero section
  useEffect(() => {
    if (!isLoading && heroSections.length === 0) {
      setFormData(defaultHeroData);
      setEditingId('main-hero');
    } else if (!isLoading && heroSections.length > 0) {
      const activeSection = heroSections.find(section => section.isActive) || heroSections[0];
      setFormData(activeSection);
      setEditingId(activeSection.id);
    }
  }, [heroSections, isLoading]);

  const updateMutation = useFirestoreMutation(
    ({ id, data }: { id: string; data: Partial<HeroSection> }) => 
      FastFirestoreService.update('hero-sections', id, data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "Hero section updated successfully!" });
        setEditingId(null);
        setFormData({
          title: "",
          subtitle: "",
          description: "",
          primaryButtonText: "",
          primaryButtonLink: "",
          secondaryButtonText: "",
          secondaryButtonLink: "",
          backgroundImageUrl: "",
          isActive: true,
        });
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to update hero section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const createMutation = useFirestoreMutation(
    (data: InsertHeroSection) => FastFirestoreService.create('hero-sections', data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "Hero section created successfully!" });
        setEditingId(null);
        setFormData({
          title: "",
          subtitle: "",
          description: "",
          primaryButtonText: "",
          primaryButtonLink: "",
          secondaryButtonText: "",
          secondaryButtonLink: "",
          backgroundImageUrl: "",
          isActive: true,
        });
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to update hero section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const deleteMutation = useFirestoreMutation(
    (id: string) => FastFirestoreService.delete('hero-sections', id),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "Hero section deleted successfully!" });
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to delete hero section: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      backgroundImageUrl: "",
      isActive: true,
    });
    setEditingId(null);
    setShowPreview(false);
    setPreviewData(null);
  };

  const handleEdit = (heroSection: HeroSection) => {
    setFormData({
      title: heroSection.title,
      subtitle: heroSection.subtitle,
      description: heroSection.description,
      primaryButtonText: heroSection.primaryButtonText,
      primaryButtonLink: heroSection.primaryButtonLink,
      secondaryButtonText: heroSection.secondaryButtonText || "",
      secondaryButtonLink: heroSection.secondaryButtonLink || "",
      backgroundImageUrl: heroSection.backgroundImageUrl || "",
      isActive: heroSection.isActive,
    });
    setEditingId(heroSection.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.description || 
        !formData.primaryButtonText || !formData.primaryButtonLink) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingId && heroSections.find(hs => hs.id === editingId)) {
      // Update existing
      updateMutation.mutate({
        id: editingId,
        data: formData as Partial<HeroSection>
      });
    } else {
      // Create new
      const data: InsertHeroSection = {
        ...formData,
        id: editingId || `hero-${Date.now()}`,
        title: formData.title!,
        subtitle: formData.subtitle!,
        description: formData.description!,
        primaryButtonText: formData.primaryButtonText!,
        primaryButtonLink: formData.primaryButtonLink!,
        secondaryButtonText: formData.secondaryButtonText || "",
        secondaryButtonLink: formData.secondaryButtonLink || "",
        backgroundImageUrl: formData.backgroundImageUrl || "",
        isActive: formData.isActive ?? true,
      };
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hero section?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = () => {
    setPreviewData({
      ...formData,
      id: editingId || 'preview',
      lastModified: new Date(),
    } as HeroSection);
    setShowPreview(true);
  };

  const handleActivate = async (id: string) => {
    // Deactivate all other hero sections
    const updatePromises = heroSections
      .filter(h => h.id !== id)
      .map(h => FastFirestoreService.update('hero-sections', h.id, { isActive: false }));
    
    await Promise.all(updatePromises);
    
    // Activate the selected one
    updateMutation.mutate({ 
      id, 
      data: { isActive: true } 
    });
  };

  const handleLoadDefaultData = () => {
    setFormData(defaultHeroData);
    setEditingId('main-hero');
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
          <p className="text-muted-foreground">Loading hero sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hero Section Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage the hero section content and preview changes in real-time
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
              {editingId ? "Edit Hero Section" : "Create Hero Section"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Main Title *
                </label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter compelling main title"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subtitle *
                </label>
                <Input
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Supporting subtitle"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description *
                </label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your foundation's mission and impact"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primary Button Text *
                  </label>
                  <Input
                    value={formData.primaryButtonText || ""}
                    onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                    placeholder="Get Started"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primary Button Link *
                  </label>
                  <Input
                    value={formData.primaryButtonLink || ""}
                    onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                    placeholder="/join"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Secondary Button Text
                  </label>
                  <Input
                    value={formData.secondaryButtonText || ""}
                    onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Secondary Button Link
                  </label>
                  <Input
                    value={formData.secondaryButtonLink || ""}
                    onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                    placeholder="/about"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Background Image URL
                </label>
                <Input
                  value={formData.backgroundImageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })}
                  placeholder="https://example.com/hero-background.jpg"
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
              <div 
                className="relative min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-gsf-primary to-gsf-secondary text-white p-8 flex items-center"
                style={{
                  backgroundImage: previewData.backgroundImageUrl 
                    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${previewData.backgroundImageUrl})`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {previewData.title || "Your Title Here"}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-6 opacity-90">
                    {previewData.subtitle || "Your subtitle here"}
                  </h2>
                  <p className="text-lg mb-8 opacity-80 leading-relaxed">
                    {previewData.description || "Your description will appear here"}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg"
                      className="bg-white text-gsf-primary hover:bg-gray-100"
                    >
                      {previewData.primaryButtonText || "Primary Button"}
                    </Button>
                    {previewData.secondaryButtonText && (
                      <Button 
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold"
                      >
                        {previewData.secondaryButtonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Existing Hero Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Hero Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {heroSections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hero sections created yet.</p>
              <p className="text-sm">Create your first hero section above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {heroSections.map((heroSection) => (
                <div
                  key={heroSection.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{heroSection.title}</h3>
                      {heroSection.isActive && (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {heroSection.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {heroSection.lastModified.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!heroSection.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(heroSection.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(heroSection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(heroSection.id)}
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