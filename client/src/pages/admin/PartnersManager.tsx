import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, ExternalLink, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import partnersService from "@/lib/partnersService";
import type { Partner, InsertPartner } from "@shared/schema";

const initialPartnerData: Omit<InsertPartner, 'id'> = {
  name: '',
  logoUrl: '',
  websiteUrl: '',
  order: 0,
  isActive: true,
};

export default function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [partnerData, setPartnerData] = useState<Omit<InsertPartner, 'id'>>(initialPartnerData);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Load partners
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const partnersData = await partnersService.getAllPartners();
        setPartners(partnersData);
      } catch (error) {
        console.error("Error loading partners:", error);
        toast({
          title: "Error",
          description: "Failed to load partners",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPartners();
  }, [toast]);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPartner(null);
    setPartnerData(initialPartnerData);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsCreating(false);
    setPartnerData({
      name: partner.name,
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      order: partner.order,
      isActive: partner.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newPartner: Partner = {
          ...partnerData,
          id: `partner-${Date.now()}`,
        };
        await partnersService.addPartner(newPartner);
        setPartners([...partners, newPartner]);
        toast({
          title: "Success",
          description: "Partner created successfully!",
        });
      } else if (editingPartner) {
        const updatedPartner: Partner = {
          ...editingPartner,
          ...partnerData,
        };
        await partnersService.updatePartner(editingPartner.id, partnerData);
        setPartners(partners.map(p => p.id === editingPartner.id ? updatedPartner : p));
        toast({
          title: "Success", 
          description: "Partner updated successfully!",
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save partner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      try {
        await partnersService.deletePartner(id);
        setPartners(partners.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Partner deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete partner. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPartner(null);
    setPartnerData(initialPartnerData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading partners...</div>
      </div>
    );
  }

  const activePartners = partners.filter(p => p.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partners Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage partner organizations that appear on the landing page
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleCreate} className="bg-gsf-primary hover:bg-gsf-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      {(isCreating || editingPartner) && (
        <Card className="border-2 border-gsf-primary/20">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Add New Partner' : 'Edit Partner'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Partner Logo</Label>
                <ImageUpload
                  value={partnerData.logoUrl}
                  onChange={(url) => setPartnerData({...partnerData, logoUrl: url})}
                  onRemove={() => setPartnerData({...partnerData, logoUrl: ''})}
                  placeholder="Upload partner logo"
                  className="w-full"
                />
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Partner Name *</Label>
                    <Input
                      id="name"
                      value={partnerData.name}
                      onChange={(e) => setPartnerData({...partnerData, name: e.target.value})}
                      placeholder="e.g., Microsoft"
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      value={partnerData.websiteUrl}
                      onChange={(e) => setPartnerData({...partnerData, websiteUrl: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={partnerData.order}
                      onChange={(e) => setPartnerData({...partnerData, order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      checked={partnerData.isActive}
                      onCheckedChange={(checked) => setPartnerData({...partnerData, isActive: checked})}
                    />
                    <Label>Active (visible on website)</Label>
                  </div>
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
                Save Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners List */}
      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48' viewBox='0 0 80 48'%3E%3Crect width='80' height='48' fill='%23f3f4f6'/%3E%3Ctext x='40' y='28' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='10'%3ELogo%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {partner.name}
                      </h3>
                      {!partner.isActive && (
                        <Badge variant="outline" className="text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Order: {partner.order}</span>
                      {partner.websiteUrl && (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gsf-secondary hover:text-gsf-primary transition-colors"
                        >
                          Visit Website
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(partner)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(partner.id)}
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

      {partners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No partners yet</h3>
              <p>Add your first partner to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners Preview */}
      {showPreview && activePartners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Partners Preview (Auto-scrolling)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Impact Partners
              </h3>
              <div className="relative overflow-hidden">
                <div className="animate-scroll-horizontal flex items-center gap-12 whitespace-nowrap">
                  {/* First set of partners */}
                  {activePartners.map((partner) => (
                    <div
                      key={`first-${partner.id}`}
                      className="flex-shrink-0 group cursor-pointer transition-transform hover:scale-110"
                      onClick={() => partner.websiteUrl && window.open(partner.websiteUrl, '_blank')}
                    >
                      <div className="w-32 h-20 bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 group-hover:scale-105">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain transition-all duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='80' viewBox='0 0 128 80'%3E%3Crect width='128' height='80' fill='%23f3f4f6'/%3E%3Ctext x='64' y='45' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3E" + partner.name + "%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {activePartners.map((partner) => (
                    <div
                      key={`second-${partner.id}`}
                      className="flex-shrink-0 group cursor-pointer transition-transform hover:scale-110"
                      onClick={() => partner.websiteUrl && window.open(partner.websiteUrl, '_blank')}
                    >
                      <div className="w-32 h-20 bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 group-hover:scale-105">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain transition-all duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='80' viewBox='0 0 128 80'%3E%3Crect width='128' height='80' fill='%23f3f4f6'/%3E%3Ctext x='64' y='45' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3E" + partner.name + "%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}