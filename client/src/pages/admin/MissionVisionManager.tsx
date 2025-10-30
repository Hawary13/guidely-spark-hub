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
  Save, 
  Eye, 
  EyeOff,
  FileText,
  Target,
  Eye as VisionIcon,
  Heart
} from "lucide-react";
import type { MissionVision, InsertMissionVision } from "@shared/schema";

export default function MissionVisionManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<MissionVision> | null>(null);
  const [formData, setFormData] = useState<Partial<InsertMissionVision>>({
    mission: "",
    vision: "",
    values: [],
    isActive: true,
  });

  const { toast } = useToast();

  // Load existing data from Firestore
  const { data: missionVisions = [], isLoading } = useFirestoreData(
    ['mission-vision'],
    () => FastFirestoreService.getAll('mission-vision')
  );

  // Default data from landing page
  const defaultMissionVisionData = {
    id: 'main-mission-vision',
    mission: 'To empower Egyptian youth through innovative technology programs, strategic partnerships, and comprehensive skill development initiatives that bridge the gap between education and employment in the digital economy.',
    vision: 'To be the leading catalyst for youth empowerment in Egypt, creating a sustainable ecosystem where every young person has access to technology education, entrepreneurship opportunities, and the resources needed to thrive in the digital age.',
    values: [
      'Innovation & Excellence',
      'Youth Empowerment',
      'Strategic Partnerships',
      'Sustainable Impact',
      'Technology Leadership',
      'Community Building'
    ],
    isActive: true,
  };

  // Load default data if no existing mission/vision
  useEffect(() => {
    if (!isLoading && missionVisions.length === 0) {
      setFormData(defaultMissionVisionData);
      setEditingId('main-mission-vision');
    } else if (!isLoading && missionVisions.length > 0) {
      const activeSection = missionVisions.find(section => section.isActive) || missionVisions[0];
      setFormData(activeSection);
      setEditingId(activeSection.id);
    }
  }, [missionVisions, isLoading]);

  const updateMutation = useFirestoreMutation(
    ({ id, data }: { id: string; data: Partial<MissionVision> }) => 
      FastFirestoreService.update('mission-vision', id, data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "Mission & Vision updated successfully!" });
        setEditingId(null);
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to update mission & vision: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const createMutation = useFirestoreMutation(
    (data: InsertMissionVision) => FastFirestoreService.create('mission-vision', data),
    {
      onSuccess: () => {
        toast({ title: "Success", description: "Mission & Vision created successfully!" });
        setEditingId(null);
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: `Failed to create mission & vision: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mission || !formData.vision) {
      toast({
        title: "Validation Error",
        description: "Mission and Vision are required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingId && missionVisions.find(mv => mv.id === editingId)) {
      // Update existing
      updateMutation.mutate({
        id: editingId,
        data: formData as Partial<MissionVision>
      });
    } else {
      // Create new
      createMutation.mutate({
        ...formData,
        id: editingId || `mission-vision-${Date.now()}`
      } as InsertMissionVision);
    }
  };

  const handleEdit = (missionVision: MissionVision) => {
    setFormData(missionVision);
    setEditingId(missionVision.id);
  };

  const handlePreview = () => {
    setPreviewData({
      ...formData,
      id: editingId || 'preview',
      lastModified: new Date()
    } as MissionVision);
    setShowPreview(true);
  };

  const handleActivate = async (id: string) => {
    // Deactivate all other mission/vision sections
    const updatePromises = missionVisions
      .filter(mv => mv.id !== id)
      .map(mv => FastFirestoreService.update('mission-vision', mv.id, { isActive: false }));
    
    await Promise.all(updatePromises);
    
    // Activate the selected one
    updateMutation.mutate({ 
      id, 
      data: { isActive: true } 
    });
  };

  const handleLoadDefaultData = () => {
    setFormData(defaultMissionVisionData);
    setEditingId('main-mission-vision');
    toast({
      title: "Default Data Loaded",
      description: "Landing page content has been loaded for editing",
    });
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...(formData.values || [])];
    newValues[index] = value;
    setFormData({ ...formData, values: newValues });
  };

  const addValue = () => {
    setFormData({ 
      ...formData, 
      values: [...(formData.values || []), ''] 
    });
  };

  const removeValue = (index: number) => {
    const newValues = [...(formData.values || [])];
    newValues.splice(index, 1);
    setFormData({ ...formData, values: newValues });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading mission & vision...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mission & Vision Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage mission statement, vision, and core values
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
              <Target className="h-5 w-5" />
              {editingId ? "Edit Mission & Vision" : "Create Mission & Vision"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mission */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Mission Statement
                </label>
                <Textarea
                  value={formData.mission || ""}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="Enter mission statement..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Vision */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <VisionIcon className="h-4 w-4" />
                  Vision Statement
                </label>
                <Textarea
                  value={formData.vision || ""}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="Enter vision statement..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Values */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Core Values
                </label>
                <div className="space-y-2">
                  {(formData.values || []).map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeValue(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addValue}
                    className="w-full"
                  >
                    Add Value
                  </Button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active Status</label>
                <Switch
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Create"} Mission & Vision
                </Button>
                <Button type="button" variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Mission & Vision List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missionVisions.map((missionVision) => (
                <div
                  key={missionVision.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={missionVision.isActive ? "default" : "secondary"}>
                          {missionVision.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Mission:</strong> {missionVision.mission?.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Vision:</strong> {missionVision.vision?.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Values:</strong> {missionVision.values?.length || 0} items
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(missionVision)}
                      >
                        Edit
                      </Button>
                      {!missionVision.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivate(missionVision.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {missionVisions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No mission & vision found. Create your first one!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Mission & Vision Preview</h2>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Close Preview
                </Button>
              </div>
              
              <div className="space-y-8">
                {/* Mission */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Our Mission
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {previewData.mission}
                  </p>
                </div>

                {/* Vision */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <VisionIcon className="h-5 w-5" />
                    Our Vision
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {previewData.vision}
                  </p>
                </div>

                {/* Values */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Our Values
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(previewData.values || []).map((value, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}