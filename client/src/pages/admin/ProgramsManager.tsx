import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Star,
  Target,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Program, InsertProgram } from "@shared/schema";

// Icon mapping for programs
const iconMap = {
  TrendingUp: TrendingUp,
  Heart: Heart,
  Star: Star,
  Target: Target,
  Lightbulb: Lightbulb,
  Sparkles: Sparkles,
  Calendar: Calendar,
  Users: Users,
  Clock: Clock,
};

const statusOptions = ['Active', 'Upcoming', 'Archived'] as const;
const colorOptions = [
  { value: 'blue', label: 'Blue', gradient: 'from-blue-500 to-cyan-500' },
  { value: 'orange', label: 'Orange', gradient: 'from-orange-500 to-red-500' },
  { value: 'red', label: 'Red', gradient: 'from-red-500 to-pink-500' },
  { value: 'green', label: 'Green', gradient: 'from-green-500 to-emerald-500' },
  { value: 'purple', label: 'Purple', gradient: 'from-purple-500 to-indigo-500' },
  { value: 'teal', label: 'Teal', gradient: 'from-teal-500 to-cyan-500' },
];

const initialProgramData: Omit<InsertProgram, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  fullDescription: '',
  overview: '',
  objectives: [],
  process: [],
  keyAchievements: [],
  features: [],
  requirements: [],
  status: 'Active',
  duration: '',
  participants: '',
  applicationDeadline: '',
  imageUrl: '',
  logoUrl: '',
  iconName: 'Star',
  gradient: 'from-blue-500 to-cyan-500',
  color: 'blue',
  isAcceptingApplications: false,
  order: 0,
  isActive: true,
};

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [programData, setProgramData] = useState<Omit<InsertProgram, 'id'>>(initialProgramData);
  const [newFeature, setNewFeature] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newProcess, setNewProcess] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const { toast } = useToast();

  // Mock data for development - in production, this would come from API
  useEffect(() => {
    // Simulate API call
    const mockPrograms: Program[] = [
      {
        id: 'bridgez',
        title: 'BridgEz Acceleration Program',
        subtitle: 'Fueling Social Impact Startups',
        description: 'Structured mentorship and investment readiness training for social impact startups.',
        fullDescription: 'The BridgEz Acceleration Program is our flagship initiative for early-stage social impact startups. We provide entrepreneurs with the tools, knowledge, and connections they need to scale their ventures and create meaningful change in their communities.',
        overview: 'A comprehensive 6-month acceleration program for social impact startups.',
        objectives: ['Scale social ventures', 'Connect with investors', 'Build sustainable business models'],
        process: ['Application review', 'Mentorship pairing', 'Weekly workshops', 'Demo day'],
        keyAchievements: ['Accelerated 100+ startups', 'Raised $50M+ in funding', '85% success rate'],
        features: [
          'Weekly mentorship sessions with industry experts',
          'Investment readiness workshops and pitch training',
          'Access to our network of investors and partners',
          'Technical support and product development guidance',
          'Legal and financial advisory services',
          'Demo day presentation to investor panel'
        ],
        requirements: [
          'Early-stage startup with social impact mission',
          'Committed founding team',
          'Scalable business model',
          'Technology-enabled solution preferred'
        ],
        status: 'Active',
        duration: '6 months',
        participants: '15-20 startups per cohort',
        applicationDeadline: 'Rolling admissions',
        imageUrl: '',
        logoUrl: '',
        iconName: 'TrendingUp',
        gradient: 'from-orange-500 to-red-500',
        color: 'orange',
        isAcceptingApplications: true,
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'imentor',
        title: 'iMentor Program',
        subtitle: 'Expert Guidance for Social Entrepreneurs',
        description: 'Expert guidance for social entrepreneurs through personalized mentorship relationships.',
        fullDescription: 'The iMentor Program facilitates meaningful connections between social entrepreneurs and seasoned professionals across various industries. Our carefully curated network of mentors provides personalized guidance to help entrepreneurs navigate challenges and accelerate their impact.',
        overview: 'A 12-month mentorship program connecting entrepreneurs with industry experts.',
        objectives: ['Provide expert guidance', 'Accelerate growth', 'Build professional networks'],
        process: ['Mentor matching', 'Goal setting', 'Regular sessions', 'Progress tracking'],
        keyAchievements: ['300+ successful matches', '90% satisfaction rate', 'High retention'],
        features: [
          '1-on-1 mentorship with matched industry expert',
          'Monthly goal-setting and progress review sessions',
          'Access to mentor network and peer community',
          'Specialized workshops on business development',
          'Quarterly networking events and masterclasses',
          'Ongoing support and resource sharing'
        ],
        requirements: [
          'Social entrepreneur with established venture',
          'Clear vision and goals for mentorship',
          'Commitment to regular mentorship meetings',
          'Willingness to give back to the community'
        ],
        status: 'Active',
        duration: '12 months',
        participants: '30+ entrepreneurs per year',
        applicationDeadline: 'Quarterly intake',
        imageUrl: '',
        logoUrl: '',
        iconName: 'Heart',
        gradient: 'from-red-500 to-pink-500',
        color: 'red',
        isAcceptingApplications: true,
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    setTimeout(() => {
      setPrograms(mockPrograms);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProgram(null);
    setProgramData(initialProgramData);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsCreating(false);
    setProgramData({
      title: program.title,
      subtitle: program.subtitle || '',
      description: program.description,
      fullDescription: program.fullDescription,
      overview: program.overview,
      objectives: program.objectives,
      process: program.process,
      keyAchievements: program.keyAchievements,
      features: program.features,
      requirements: program.requirements,
      status: program.status,
      duration: program.duration,
      participants: program.participants,
      applicationDeadline: program.applicationDeadline,
      imageUrl: program.imageUrl || '',
      logoUrl: program.logoUrl || '',
      iconName: program.iconName || 'Star',
      gradient: program.gradient,
      color: program.color,
      isAcceptingApplications: program.isAcceptingApplications,
      order: program.order,
      isActive: program.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newProgram: Program = {
          ...programData,
          id: `program-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setPrograms([...programs, newProgram]);
        toast({
          title: "Success",
          description: "Program created successfully!",
        });
      } else if (editingProgram) {
        const updatedProgram: Program = {
          ...editingProgram,
          ...programData,
          updatedAt: new Date(),
        };
        setPrograms(programs.map(p => p.id === editingProgram.id ? updatedProgram : p));
        toast({
          title: "Success", 
          description: "Program updated successfully!",
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save program. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        setPrograms(programs.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Program deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete program. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProgram(null);
    setProgramData(initialProgramData);
    setNewFeature('');
    setNewRequirement('');
    setNewObjective('');
    setNewProcess('');
    setNewAchievement('');
  };

  const addListItem = (field: keyof Pick<typeof programData, 'features' | 'requirements' | 'objectives' | 'process' | 'keyAchievements'>, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setProgramData({
        ...programData,
        [field]: [...programData[field], value.trim()]
      });
      setter('');
    }
  };

  const removeListItem = (field: keyof Pick<typeof programData, 'features' | 'requirements' | 'objectives' | 'process' | 'keyAchievements'>, index: number) => {
    setProgramData({
      ...programData,
      [field]: programData[field].filter((_, i) => i !== index)
    });
  };

  const handleColorChange = (value: string) => {
    const colorOption = colorOptions.find(c => c.value === value);
    if (colorOption) {
      setProgramData({
        ...programData,
        color: value,
        gradient: colorOption.gradient
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programs Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage programs that appear on the website and navbar
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-gsf-primary hover:bg-gsf-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      {(isCreating || editingProgram) && (
        <Card className="border-2 border-gsf-primary/20">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Program' : 'Edit Program'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Program Title *</Label>
                    <Input
                      id="title"
                      value={programData.title}
                      onChange={(e) => setProgramData({...programData, title: e.target.value})}
                      placeholder="e.g., BridgEz Acceleration Program"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={programData.subtitle}
                      onChange={(e) => setProgramData({...programData, subtitle: e.target.value})}
                      placeholder="e.g., Fueling Social Impact Startups"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={programData.description}
                    onChange={(e) => setProgramData({...programData, description: e.target.value})}
                    placeholder="Brief description for cards and navbar"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="fullDescription">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={programData.fullDescription}
                    onChange={(e) => setProgramData({...programData, fullDescription: e.target.value})}
                    placeholder="Detailed description for program page"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="overview">Overview *</Label>
                  <Textarea
                    id="overview"
                    value={programData.overview}
                    onChange={(e) => setProgramData({...programData, overview: e.target.value})}
                    placeholder="Program overview"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={programData.status} onValueChange={(value) => setProgramData({...programData, status: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={programData.duration}
                      onChange={(e) => setProgramData({...programData, duration: e.target.value})}
                      placeholder="e.g., 6 months"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participants">Participants *</Label>
                    <Input
                      id="participants"
                      value={programData.participants}
                      onChange={(e) => setProgramData({...programData, participants: e.target.value})}
                      placeholder="e.g., 15-20 startups per cohort"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      value={programData.applicationDeadline}
                      onChange={(e) => setProgramData({...programData, applicationDeadline: e.target.value})}
                      placeholder="e.g., Rolling admissions"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Program Image</Label>
                    <ImageUpload
                      value={programData.imageUrl}
                      onChange={(url) => setProgramData({...programData, imageUrl: url})}
                      onRemove={() => setProgramData({...programData, imageUrl: ''})}
                      placeholder="Upload program image"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Program Logo</Label>
                    <ImageUpload
                      value={programData.logoUrl}
                      onChange={(url) => setProgramData({...programData, logoUrl: url})}
                      onRemove={() => setProgramData({...programData, logoUrl: ''})}
                      placeholder="Upload program logo"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={programData.order}
                      onChange={(e) => setProgramData({...programData, order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={programData.isActive}
                        onCheckedChange={(checked) => setProgramData({...programData, isActive: checked})}
                      />
                      <Label>Active (visible on website)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={programData.isAcceptingApplications}
                        onCheckedChange={(checked) => setProgramData({...programData, isAcceptingApplications: checked})}
                      />
                      <Label>Accepting Applications</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {/* Objectives */}
                <div>
                  <Label>Objectives</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        placeholder="Add objective..."
                        onKeyPress={(e) => e.key === 'Enter' && addListItem('objectives', newObjective, setNewObjective)}
                      />
                      <Button onClick={() => addListItem('objectives', newObjective, setNewObjective)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-24">
                      {programData.objectives.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeListItem('objectives', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                {/* Process */}
                <div>
                  <Label>Process Steps</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newProcess}
                        onChange={(e) => setNewProcess(e.target.value)}
                        placeholder="Add process step..."
                        onKeyPress={(e) => e.key === 'Enter' && addListItem('process', newProcess, setNewProcess)}
                      />
                      <Button onClick={() => addListItem('process', newProcess, setNewProcess)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-24">
                      {programData.process.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeListItem('process', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <Label>Key Achievements</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder="Add achievement..."
                        onKeyPress={(e) => e.key === 'Enter' && addListItem('keyAchievements', newAchievement, setNewAchievement)}
                      />
                      <Button onClick={() => addListItem('keyAchievements', newAchievement, setNewAchievement)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-24">
                      {programData.keyAchievements.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeListItem('keyAchievements', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                {/* Features */}
                <div>
                  <Label>Program Features</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add feature..."
                        onKeyPress={(e) => e.key === 'Enter' && addListItem('features', newFeature, setNewFeature)}
                      />
                      <Button onClick={() => addListItem('features', newFeature, setNewFeature)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-32">
                      {programData.features.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeListItem('features', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                <Separator />

                {/* Requirements */}
                <div>
                  <Label>Eligibility Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add requirement..."
                        onKeyPress={(e) => e.key === 'Enter' && addListItem('requirements', newRequirement, setNewRequirement)}
                      />
                      <Button onClick={() => addListItem('requirements', newRequirement, setNewRequirement)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-32">
                      {programData.requirements.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeListItem('requirements', index)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iconName">Icon</Label>
                    <Select 
                      value={programData.iconName} 
                      onValueChange={(value) => setProgramData({...programData, iconName: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(iconMap).map(iconName => {
                          const IconComponent = iconMap[iconName as keyof typeof iconMap];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {iconName}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color Scheme</Label>
                    <Select value={programData.color} onValueChange={handleColorChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.gradient}`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Preview</Label>
                  <Card className={`bg-gradient-to-br ${programData.gradient} text-white p-4`}>
                    <div className="flex items-center gap-3">
                      {programData.iconName && iconMap[programData.iconName as keyof typeof iconMap] && (
                        React.createElement(iconMap[programData.iconName as keyof typeof iconMap], { className: "w-8 h-8" })
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{programData.title || 'Program Title'}</h3>
                        <p className="text-white/90 text-sm">{programData.subtitle || 'Program Subtitle'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gsf-primary hover:bg-gsf-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Program
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {programs.map((program) => (
          <Card key={program.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${program.gradient} flex items-center justify-center flex-shrink-0`}>
                    {program.iconName && iconMap[program.iconName as keyof typeof iconMap] && 
                      React.createElement(iconMap[program.iconName as keyof typeof iconMap], { className: "w-6 h-6 text-white" })
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {program.title}
                      </h3>
                      <Badge variant={program.status === 'Active' ? 'default' : 'secondary'}>
                        {program.status}
                      </Badge>
                      {program.isAcceptingApplications && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Accepting Applications
                        </Badge>
                      )}
                      {!program.isActive && (
                        <Badge variant="outline" className="text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {program.subtitle && (
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {program.subtitle}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {program.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {program.participants}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {program.applicationDeadline}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(program)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(program.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No programs yet</h3>
              <p>Create your first program to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
