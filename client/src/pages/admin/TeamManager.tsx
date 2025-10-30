import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Save, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import teamService from "@/lib/teamService";
import type { TeamMember, InsertTeamMember } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const initialMemberData: Omit<InsertTeamMember, 'id'> = {
  name: '',
  position: '',
  bio: '',
  imageUrl: '',
  linkedinUrl: '',
  order: 0,
  isActive: true,
};

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [memberData, setMemberData] = useState<Omit<InsertTeamMember, 'id'>>(initialMemberData);
  const { toast } = useToast();

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await teamService.getAllTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error("Error loading team members:", error);
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, [toast]);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingMember(null);
    setMemberData(initialMemberData);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsCreating(false);
    setMemberData({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      order: member.order,
      isActive: member.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newMember: TeamMember = {
          ...memberData,
          id: `team-${Date.now()}`,
        };
        await teamService.addTeamMember(newMember);
        setTeamMembers([...teamMembers, newMember]);
        toast({
          title: "Success",
          description: "Team member created successfully!",
        });
      } else if (editingMember) {
        const updatedMember: TeamMember = {
          ...editingMember,
          ...memberData,
        };
        await teamService.updateTeamMember(editingMember.id, memberData);
        setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? updatedMember : m));
        toast({
          title: "Success", 
          description: "Team member updated successfully!",
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamService.deleteTeamMember(id);
        setTeamMembers(teamMembers.filter(m => m.id !== id));
        toast({
          title: "Success",
          description: "Team member deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete team member. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingMember(null);
    setMemberData(initialMemberData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage team members that appear on the About Us page
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-gsf-primary hover:bg-gsf-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {(isCreating || editingMember) && (
        <Card className="border-2 border-gsf-primary/20">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Add New Team Member' : 'Edit Team Member'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <ImageUpload
                  value={memberData.imageUrl}
                  onChange={(url) => setMemberData({...memberData, imageUrl: url})}
                  onRemove={() => setMemberData({...memberData, imageUrl: ''})}
                  placeholder="Upload profile picture"
                  className="w-full"
                />
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={memberData.name}
                      onChange={(e) => setMemberData({...memberData, name: e.target.value})}
                      placeholder="e.g., Ahmed Hassan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      value={memberData.position}
                      onChange={(e) => setMemberData({...memberData, position: e.target.value})}
                      placeholder="e.g., Executive Director"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={memberData.bio}
                    onChange={(e) => setMemberData({...memberData, bio: e.target.value})}
                    placeholder="Brief biography and background..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={memberData.linkedinUrl}
                      onChange={(e) => setMemberData({...memberData, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={memberData.order}
                      onChange={(e) => setMemberData({...memberData, order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={memberData.isActive}
                    onCheckedChange={(checked) => setMemberData({...memberData, isActive: checked})}
                  />
                  <Label>Active (visible on website)</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gsf-primary hover:bg-gsf-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={member.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      {!member.isActive && (
                        <Badge variant="outline" className="text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-gsf-secondary font-medium mb-2">
                      {member.position}
                    </p>
                    {member.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Order: {member.order}</span>
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gsf-secondary hover:text-gsf-primary transition-colors"
                        >
                          LinkedIn
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(member)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(member.id)}
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

      {teamMembers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No team members yet</h3>
              <p>Add your first team member to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}