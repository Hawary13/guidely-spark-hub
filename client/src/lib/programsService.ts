import type { Program, Project } from "@shared/schema";

// Mock data service - in production this would connect to your backend API
class ProgramsProjectsService {
  private programs: Program[] = [
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

  private projects: Project[] = [
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

  // Get all active programs
  async getActivePrograms(): Promise<Program[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.programs
      .filter(program => program.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Get all active projects
  async getActiveProjects(): Promise<Project[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.projects
      .filter(project => project.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Get program by ID
  async getProgramById(id: string): Promise<Program | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.programs.find(program => program.id === id) || null;
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.projects.find(project => project.id === id) || null;
  }

  // Get programs for navbar (limit to first 4 active)
  async getProgramsForNavbar(): Promise<Program[]> {
    const programs = await this.getActivePrograms();
    return programs.slice(0, 4);
  }

  // Get projects for navbar (limit to first 4 active)
  async getProjectsForNavbar(): Promise<Project[]> {
    const projects = await this.getActiveProjects();
    return projects.slice(0, 4);
  }

  // Get programs for home page carousel
  async getProgramsForHome(): Promise<Program[]> {
    const programs = await this.getActivePrograms();
    return programs.slice(0, 2); // Only show first 2 programs on home page
  }

  // Get projects for home page carousel
  async getProjectsForHome(): Promise<Project[]> {
    const projects = await this.getActiveProjects();
    return projects.slice(0, 3); // Show first 3 projects on home page
  }

  // Update program (admin only)
  async updateProgram(id: string, updates: Partial<Program>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.programs.findIndex(p => p.id === id);
    if (index !== -1) {
      this.programs[index] = { ...this.programs[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  // Update project (admin only)
  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  // Add new program (admin only)
  async addProgram(program: Omit<Program, 'createdAt' | 'updatedAt'>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newProgram: Program = {
      ...program,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.programs.push(newProgram);
    return true;
  }

  // Add new project (admin only)
  async addProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newProject: Project = {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(newProject);
    return true;
  }

  // Delete program (admin only)
  async deleteProgram(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.programs.findIndex(p => p.id === id);
    if (index !== -1) {
      this.programs.splice(index, 1);
      return true;
    }
    return false;
  }

  // Delete project (admin only)
  async deleteProject(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const programsProjectsService = new ProgramsProjectsService();
export default programsProjectsService; 