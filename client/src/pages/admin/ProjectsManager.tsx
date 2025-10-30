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
  MapPin,
  Users,
  Clock,
  Leaf,
  Zap,
  Heart,
  Star,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project, InsertProject } from "@shared/schema";

// Icon mapping for projects
const iconMap = {
  Leaf: Leaf,
  Zap: Zap,
  Heart: Heart,
  Star: Star,
  Target: Target,
  MapPin: MapPin,
  Users: Users,
  Clock: Clock,
};

const statusOptions = ['Active', 'Upcoming', 'Completed', 'Archived'] as const;
const colorOptions = [
  { value: 'green', label: 'Green', gradient: 'from-green-500 to-emerald-500' },
  { value: 'blue', label: 'Blue', gradient: 'from-blue-500 to-cyan-500' },
  { value: 'orange', label: 'Orange', gradient: 'from-orange-500 to-amber-500' },
  { value: 'red', label: 'Red', gradient: 'from-red-500 to-pink-500' },
  { value: 'purple', label: 'Purple', gradient: 'from-purple-500 to-indigo-500' },
  { value: 'teal', label: 'Teal', gradient: 'from-teal-500 to-cyan-500' },
];

const initialProjectData: Omit<InsertProject, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  fullDescription: '',
  location: '',
  beneficiaries: '',
  timeline: '',
  status: 'Active',
  impact: [],
  activities: [],
  imageUrl: '',
  logoUrl: '',
  iconName: 'Star',
  gradient: 'from-green-500 to-emerald-500',
  color: 'green',
  order: 0,
  isActive: true,
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectData, setProjectData] = useState<Omit<InsertProject, 'id'>>(initialProjectData);
  const [newImpactItem, setNewImpactItem] = useState('');
  const [newActivityItem, setNewActivityItem] = useState('');
  const { toast } = useToast();

  // Mock data for development - in production, this would come from API
  useEffect(() => {
    // Simulate API call
    const mockProjects: Project[] = [
      {
        id: 'eden',
        title: 'Eden',
        subtitle: 'Sustainable Agriculture & Environmental Restoration',
        description: 'Supporting rural communities through eco-friendly farming practices and environmental restoration programs.',
        fullDescription: 'Eden focuses on sustainable agriculture and environmental restoration programs that support rural communities while promoting eco-friendly farming practices.',
        location: 'Rural Egypt & MENA Region',
        beneficiaries: '2,500+ farmers',
        timeline: 'Ongoing since 2023',
        status: 'Active',
        impact: [
          'Trained 2,500+ farmers in sustainable agriculture',
          'Restored 15,000 hectares of agricultural land',
          'Implemented water-saving irrigation systems',
          'Reduced chemical pesticide use by 60%',
          'Increased crop yields by average of 35%',
          'Created 1,200+ green jobs in rural areas'
        ],
        activities: [
          'Solar-powered irrigation system installation',
          'Organic farming training workshops',
          'Soil restoration and composting programs',
          'Climate-resilient crop variety distribution',
          'Farmer cooperative development',
          'Environmental impact monitoring'
        ],
        imageUrl: '',
        logoUrl: '',
        iconName: 'Leaf',
        gradient: 'from-green-500 to-emerald-500',
        color: 'green',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'graphene',
        title: 'Graphene',
        subtitle: 'Advanced Technology & Digital Literacy',
        description: 'Bridging the digital divide through advanced technology solutions and digital literacy programs.',
        fullDescription: 'Graphene addresses the digital divide by providing advanced technology solutions and comprehensive digital literacy programs for underserved communities.',
        location: 'Urban & Rural Egypt',
        beneficiaries: '10,000+ individuals',
        timeline: 'Ongoing since 2022',
        status: 'Active',
        impact: [
          'Trained 10,000+ individuals in digital skills',
          'Established 25 digital learning centers',
          'Provided 5,000+ devices to underserved communities',
          'Connected 50+ rural schools to high-speed internet',
          'Created 800+ tech-enabled job opportunities',
          'Launched 15 community-driven tech initiatives'
        ],
        activities: [
          'Digital literacy bootcamps and workshops',
          'Computer lab setup in underserved areas',
          'Mobile app development training',
          'Blockchain and cryptocurrency education',
          'E-commerce platform development',
          'Tech entrepreneurship mentorship'
        ],
        imageUrl: '',
        logoUrl: '',
        iconName: 'Zap',
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'nitrous',
        title: 'Nitrous',
        subtitle: 'Healthcare Accessibility & Medical Support',
        description: 'Providing essential healthcare services and medical support to marginalized communities.',
        fullDescription: 'Nitrous is dedicated to improving healthcare accessibility through comprehensive medical support initiatives for marginalized communities.',
        location: 'Egypt & MENA Region',
        beneficiaries: '15,000+ patients',
        timeline: 'Ongoing since 2021',
        status: 'Active',
        impact: [
          'Served 15,000+ patients with medical care',
          'Established 12 mobile health clinics',
          'Provided free medications worth $2M+',
          'Trained 300+ community health workers',
          'Completed 5,000+ health screenings',
          'Reduced child mortality rate by 25% in target areas'
        ],
        activities: [
          'Mobile health clinic operations',
          'Preventive care and health education',
          'Maternal and child health programs',
          'Chronic disease management',
          'Mental health awareness campaigns',
          'Healthcare infrastructure development'
        ],
        imageUrl: '',
        logoUrl: '',
        iconName: 'Heart',
        gradient: 'from-orange-500 to-amber-500',
        color: 'orange',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setProjectData(initialProjectData);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsCreating(false);
    setProjectData({
      title: project.title,
      subtitle: project.subtitle || '',
      description: project.description,
      fullDescription: project.fullDescription,
      location: project.location,
      beneficiaries: project.beneficiaries,
      timeline: project.timeline,
      status: project.status,
      impact: project.impact,
      activities: project.activities,
      imageUrl: project.imageUrl || '',
      logoUrl: project.logoUrl || '',
      iconName: project.iconName || 'Star',
      gradient: project.gradient,
      color: project.color,
      order: project.order,
      isActive: project.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newProject: Project = {
          ...projectData,
          id: `project-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProjects([...projects, newProject]);
        toast({
          title: "Success",
          description: "Project created successfully!",
        });
      } else if (editingProject) {
        const updatedProject: Project = {
          ...editingProject,
          ...projectData,
          updatedAt: new Date(),
        };
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        toast({
          title: "Success", 
          description: "Project updated successfully!",
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setProjects(projects.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Project deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProject(null);
    setProjectData(initialProjectData);
    setNewImpactItem('');
    setNewActivityItem('');
  };

  const addImpactItem = () => {
    if (newImpactItem.trim()) {
      setProjectData({
        ...projectData,
        impact: [...projectData.impact, newImpactItem.trim()]
      });
      setNewImpactItem('');
    }
  };

  const removeImpactItem = (index: number) => {
    setProjectData({
      ...projectData,
      impact: projectData.impact.filter((_, i) => i !== index)
    });
  };

  const addActivityItem = () => {
    if (newActivityItem.trim()) {
      setProjectData({
        ...projectData,
        activities: [...projectData.activities, newActivityItem.trim()]
      });
      setNewActivityItem('');
    }
  };

  const removeActivityItem = (index: number) => {
    setProjectData({
      ...projectData,
      activities: projectData.activities.filter((_, i) => i !== index)
    });
  };

  const handleColorChange = (value: string) => {
    const colorOption = colorOptions.find(c => c.value === value);
    if (colorOption) {
      setProjectData({
        ...projectData,
        color: value,
        gradient: colorOption.gradient
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage projects that appear on the website and navbar
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-gsf-primary hover:bg-gsf-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {(isCreating || editingProject) && (
        <Card className="border-2 border-gsf-primary/20">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Project' : 'Edit Project'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="impact">Impact & Activities</TabsTrigger>
                <TabsTrigger value="design">Design & Display</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={projectData.title}
                      onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                      placeholder="e.g., Eden"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={projectData.subtitle}
                      onChange={(e) => setProjectData({...projectData, subtitle: e.target.value})}
                      placeholder="e.g., Sustainable Agriculture & Environmental Restoration"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    placeholder="Brief description for cards and navbar"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="fullDescription">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={projectData.fullDescription}
                    onChange={(e) => setProjectData({...projectData, fullDescription: e.target.value})}
                    placeholder="Detailed description for project page"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={projectData.status} onValueChange={(value) => setProjectData({...projectData, status: value as any})}>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={projectData.isActive}
                      onCheckedChange={(checked) => setProjectData({...projectData, isActive: checked})}
                    />
                    <Label>Active (visible on website)</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={projectData.location}
                      onChange={(e) => setProjectData({...projectData, location: e.target.value})}
                      placeholder="e.g., Rural Egypt & MENA Region"
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiaries">Beneficiaries *</Label>
                    <Input
                      id="beneficiaries"
                      value={projectData.beneficiaries}
                      onChange={(e) => setProjectData({...projectData, beneficiaries: e.target.value})}
                      placeholder="e.g., 2,500+ farmers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline *</Label>
                    <Input
                      id="timeline"
                      value={projectData.timeline}
                      onChange={(e) => setProjectData({...projectData, timeline: e.target.value})}
                      placeholder="e.g., Ongoing since 2023"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Project Image</Label>
                    <ImageUpload
                      value={projectData.imageUrl}
                      onChange={(url) => setProjectData({...projectData, imageUrl: url})}
                      onRemove={() => setProjectData({...projectData, imageUrl: ''})}
                      placeholder="Upload project image"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Project Logo</Label>
                    <ImageUpload
                      value={projectData.logoUrl}
                      onChange={(url) => setProjectData({...projectData, logoUrl: url})}
                      onRemove={() => setProjectData({...projectData, logoUrl: ''})}
                      placeholder="Upload project logo"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={projectData.order}
                    onChange={(e) => setProjectData({...projectData, order: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-4">
                <div>
                  <Label>Impact Achieved</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newImpactItem}
                        onChange={(e) => setNewImpactItem(e.target.value)}
                        placeholder="Add impact achievement..."
                        onKeyPress={(e) => e.key === 'Enter' && addImpactItem()}
                      />
                      <Button onClick={addImpactItem} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-32">
                      {projectData.impact.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeImpactItem(index)}
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

                <div>
                  <Label>Key Activities</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newActivityItem}
                        onChange={(e) => setNewActivityItem(e.target.value)}
                        placeholder="Add key activity..."
                        onKeyPress={(e) => e.key === 'Enter' && addActivityItem()}
                      />
                      <Button onClick={addActivityItem} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-32">
                      {projectData.activities.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                          <span className="text-sm">{item}</span>
                          <Button
                            onClick={() => removeActivityItem(index)}
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
                      value={projectData.iconName} 
                      onValueChange={(value) => setProjectData({...projectData, iconName: value})}
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
                    <Select value={projectData.color} onValueChange={handleColorChange}>
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
                  <Card className={`bg-gradient-to-br ${projectData.gradient} text-white p-4`}>
                    <div className="flex items-center gap-3">
                      {projectData.iconName && iconMap[projectData.iconName as keyof typeof iconMap] && (
                        React.createElement(iconMap[projectData.iconName as keyof typeof iconMap], { className: "w-8 h-8" })
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{projectData.title || 'Project Title'}</h3>
                        <p className="text-white/90 text-sm">{projectData.subtitle || 'Project Subtitle'}</p>
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
                Save Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center flex-shrink-0`}>
                    {project.iconName && iconMap[project.iconName as keyof typeof iconMap] && 
                      React.createElement(iconMap[project.iconName as keyof typeof iconMap], { className: "w-6 h-6 text-white" })
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                      {!project.isActive && (
                        <Badge variant="outline" className="text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {project.subtitle && (
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {project.subtitle}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.beneficiaries}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.timeline}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
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

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p>Create your first project to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 