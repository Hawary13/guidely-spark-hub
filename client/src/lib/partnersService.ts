import type { Partner } from "@shared/schema";

// Mock data service for partners - in production this would connect to your backend API
class PartnersService {
  private partners: Partner[] = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png',
      websiteUrl: 'https://www.microsoft.com',
      order: 1,
      isActive: true,
    },
    {
      id: 'google',
      name: 'Google',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
      websiteUrl: 'https://www.google.com',
      order: 2,
      isActive: true,
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png',
      websiteUrl: 'https://www.amazon.com',
      order: 3,
      isActive: true,
    },
    {
      id: 'ibm',
      name: 'IBM',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/09/IBM-Logo.png',
      websiteUrl: 'https://www.ibm.com',
      order: 4,
      isActive: true,
    },
    {
      id: 'oracle',
      name: 'Oracle',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png',
      websiteUrl: 'https://www.oracle.com',
      order: 5,
      isActive: true,
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logoUrl: 'https://logos-world.net/wp-content/uploads/2020/11/Salesforce-Logo.png',
      websiteUrl: 'https://www.salesforce.com',
      order: 6,
      isActive: true,
    }
  ];

  // Get all active partners
  async getActivePartners(): Promise<Partner[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.partners
      .filter(partner => partner.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Get partners for home page scrolling
  async getPartnersForHome(): Promise<Partner[]> {
    return this.getActivePartners();
  }

  // Get partner by ID
  async getPartnerById(id: string): Promise<Partner | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.partners.find(partner => partner.id === id) || null;
  }

  // Update partner (admin only)
  async updatePartner(id: string, updates: Partial<Partner>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.partners.findIndex(p => p.id === id);
    if (index !== -1) {
      this.partners[index] = { ...this.partners[index], ...updates };
      return true;
    }
    return false;
  }

  // Add new partner (admin only)
  async addPartner(partner: Omit<Partner, 'id'>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newPartner: Partner = {
      ...partner,
      id: `partner-${Date.now()}`,
    };
    this.partners.push(newPartner);
    return true;
  }

  // Delete partner (admin only)
  async deletePartner(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.partners.findIndex(p => p.id === id);
    if (index !== -1) {
      this.partners.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all partners (admin only)
  async getAllPartners(): Promise<Partner[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.partners.sort((a, b) => a.order - b.order);
  }
}

// Export singleton instance
export const partnersService = new PartnersService();
export default partnersService; 