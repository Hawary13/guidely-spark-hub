import type { TeamMember } from "@shared/schema";

// Mock data service for team members - in production this would connect to your backend API
class TeamService {
  private teamMembers: TeamMember[] = [
    {
      id: 'ahmed-hassan',
      name: 'Ahmed Hassan',
      position: 'Executive Director',
      bio: 'Leading Egypt\'s innovation ecosystem with over 15 years of experience in technology and entrepreneurship.',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/ahmed-hassan',
      order: 1,
      isActive: true,
    },
    {
      id: 'fatima-elmasry',
      name: 'Fatima El-Masry',
      position: 'Program Director',
      bio: 'Designing and implementing innovative programs that transform young entrepreneurs into successful business leaders.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/fatima-elmasry',
      order: 2,
      isActive: true,
    },
    {
      id: 'omar-abdel-rahman',
      name: 'Omar Abdel-Rahman',
      position: 'Innovation Lead',
      bio: 'Fostering technological innovation and connecting startups with cutting-edge resources and mentorship.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/omar-abdel-rahman',
      order: 3,
      isActive: true,
    },
    {
      id: 'sarah-mohamed',
      name: 'Sarah Mohamed',
      position: 'Community Manager',
      bio: 'Building and nurturing our vibrant community of entrepreneurs, mentors, and partners across Egypt.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/sarah-mohamed',
      order: 4,
      isActive: true,
    },
    {
      id: 'karim-ali',
      name: 'Karim Ali',
      position: 'Technology Lead',
      bio: 'Overseeing our technical initiatives and ensuring our platform delivers the best experience for our users.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/karim-ali',
      order: 5,
      isActive: true,
    },
    {
      id: 'nour-ibrahim',
      name: 'Nour Ibrahim',
      position: 'Operations Manager',
      bio: 'Ensuring smooth operations and efficient execution of all our programs and initiatives.',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
      linkedinUrl: 'https://linkedin.com/in/nour-ibrahim',
      order: 6,
      isActive: true,
    }
  ];

  // Get all active team members
  async getActiveTeamMembers(): Promise<TeamMember[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.teamMembers
      .filter(member => member.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Get team members for About page (limit to first 6 active)
  async getTeamForAboutPage(): Promise<TeamMember[]> {
    const team = await this.getActiveTeamMembers();
    return team.slice(0, 6);
  }

  // Get team member by ID
  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.teamMembers.find(member => member.id === id) || null;
  }

  // Update team member (admin only)
  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.teamMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.teamMembers[index] = { ...this.teamMembers[index], ...updates };
      return true;
    }
    return false;
  }

  // Add new team member (admin only)
  async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now()}`,
    };
    this.teamMembers.push(newMember);
    return true;
  }

  // Delete team member (admin only)
  async deleteTeamMember(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.teamMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.teamMembers.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all team members (admin only)
  async getAllTeamMembers(): Promise<TeamMember[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.teamMembers.sort((a, b) => a.order - b.order);
  }
}

// Export singleton instance
export const teamService = new TeamService();
export default teamService; 