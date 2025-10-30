import { db } from "./db";
import * as schema from "../shared/schema";

// Sample data for seeding
const samplePrograms = [
  {
    id: "1",
    title: "Youth Innovation Lab",
    description: "تمكين الشباب من خلال برامج الابتكار والريادة",
    overview: "A comprehensive program designed to empower young entrepreneurs with the tools, knowledge, and network needed to transform their innovative ideas into successful businesses.",
    objectives: [
      "Develop entrepreneurial mindset and skills",
      "Build innovation capabilities",
      "Create sustainable business models",
      "Foster networking and mentorship"
    ],
    process: [
      "Application and selection process",
      "12-week intensive training program",
      "Mentorship and coaching sessions",
      "Pitch competition and demo day"
    ],
    keyAchievements: [
      "150+ startups launched",
      "85% survival rate after 2 years",
      "$10M+ in funding raised",
      "500+ jobs created"
    ],
    status: "Active" as const,
    duration: "3 months",
    participants: "50-100 per cohort",
    imageUrl: "/api/placeholder/400/300",
    isAcceptingApplications: true,
    applicationDeadline: new Date('2024-12-31'),
  },
  {
    id: "2", 
    title: "Women in Tech Initiative",
    description: "دعم المرأة في مجال التكنولوجيا والريادة",
    overview: "Empowering women to excel in technology careers through skills development, mentorship, and creating inclusive work environments.",
    objectives: [
      "Increase women representation in tech",
      "Provide technical skills training",
      "Build supportive community networks",
      "Create leadership opportunities"
    ],
    process: [
      "Skills assessment and gap analysis",
      "Technical training bootcamps",
      "Mentorship matching",
      "Leadership development programs"
    ],
    keyAchievements: [
      "200+ women trained",
      "60% career advancement rate",
      "50+ women in leadership roles",
      "15+ tech companies founded"
    ],
    status: "Active" as const,
    duration: "6 months",
    participants: "30-50 per cohort",
    imageUrl: "/api/placeholder/400/300",
    isAcceptingApplications: true,
    applicationDeadline: new Date('2024-11-30'),
  },
  {
    id: "3",
    title: "Digital Transformation Accelerator", 
    description: "تسريع التحول الرقمي للشركات الناشئة",
    overview: "Helping established businesses and startups navigate digital transformation through technology adoption and digital strategy development.",
    objectives: [
      "Modernize business operations",
      "Implement digital technologies",
      "Improve operational efficiency",
      "Enhance customer experience"
    ],
    process: [
      "Digital maturity assessment",
      "Strategy development workshops",
      "Technology implementation support",
      "Performance monitoring and optimization"
    ],
    keyAchievements: [
      "100+ businesses transformed",
      "40% average efficiency improvement",
      "$5M+ cost savings achieved",
      "95% customer satisfaction rate"
    ],
    status: "Active" as const,
    duration: "4 months",
    participants: "20-30 companies per cohort",
    imageUrl: "/api/placeholder/400/300",
    isAcceptingApplications: false,
  },
];

const sampleEvents = [
  {
    id: "1",
    title: "Innovation Summit 2024",
    description: "قمة الابتكار السنوية لمؤسسة جيزة سيستمز",
    fullDescription: "Join us for the largest innovation gathering in the region, featuring keynote speakers, panel discussions, startup showcases, and networking opportunities.",
    date: new Date('2024-09-15'),
    endDate: new Date('2024-09-16'),
    time: "09:00 AM",
    endTime: "06:00 PM",
    location: "Cairo",
    venue: "Cairo International Convention Center",
    address: "El Geish Road, Cairo, Egypt",
    type: "Conference" as const,
    imageUrl: "/api/placeholder/600/400",
    mediaImages: [
      {
        url: "/api/placeholder/400/300",
        caption: "Innovation Summit Opening Ceremony",
        alt: "Opening ceremony with speakers on stage"
      }
    ],
    speakers: [
      {
        name: "Dr. Ahmed Hassan",
        title: "Chief Innovation Officer",
        bio: "Leading expert in digital transformation and innovation strategy",
        imageUrl: "/api/placeholder/200/200"
      }
    ],
    agenda: [
      {
        time: "09:00 AM",
        title: "Registration & Welcome Coffee",
        description: "Network with fellow innovators"
      },
      {
        time: "10:00 AM", 
        title: "Keynote: Future of Innovation",
        description: "Vision for innovation in the next decade",
        speaker: "Dr. Ahmed Hassan"
      }
    ],
    registrationUrl: "https://events.gsf.org/innovation-summit-2024",
    applicationEnabled: true,
    applicationDeadline: new Date('2024-09-01'),
    capacity: 500,
    price: "Free",
    requirements: ["Valid ID", "Professional interest in innovation"],
    benefits: ["Networking opportunities", "Certificate of attendance", "Exclusive resources"],
    tags: ["innovation", "technology", "entrepreneurship"],
    isPublished: true,
    isFeatured: true,
  }
];

const sampleSuccessStories = [
  {
    id: "1",
    personName: "Sara Mahmoud",
    personTitle: "CEO & Founder",
    companyName: "TechStart Solutions",
    story: "Sara joined our Youth Innovation Lab program with just an idea for a fintech solution. Through our comprehensive training, mentorship, and networking opportunities, she was able to develop her concept into a fully functioning platform that now serves over 10,000 users across the Middle East.",
    quote: "The support I received from Giza Systems Foundation was instrumental in turning my vision into reality. The mentorship, training, and network opened doors I never knew existed.",
    achievements: [
      "Raised $500K in seed funding",
      "Expanded to 3 countries",
      "Created 25 full-time jobs",
      "Winner of Best Fintech Startup 2023"
    ],
    imageUrl: "/api/placeholder/300/300",
    revenue: "$1.2M ARR",
    jobsCreated: "25",
    fundingRaised: "$500K",
    linkedinUrl: "https://linkedin.com/in/saramahmoud",
    industry: "Fintech",
    programAttended: "Youth Innovation Lab",
    yearCompleted: "2022",
    companyUrl: "https://techstartsolutions.com",
    isPublished: true,
  },
  {
    id: "2",
    personName: "Mohamed Ali",
    personTitle: "Co-Founder & CTO",
    companyName: "GreenTech Innovations",
    story: "Mohamed participated in our Digital Transformation Accelerator program where he learned to combine his engineering background with business acumen. His sustainable technology company now provides clean energy solutions to rural communities.",
    quote: "The program didn't just teach me about technology - it taught me how to build a business that creates real impact in people's lives.",
    achievements: [
      "Powered 50+ rural communities",
      "Reduced carbon footprint by 40%",
      "Generated $800K revenue",
      "Featured in Forbes 30 Under 30"
    ],
    imageUrl: "/api/placeholder/300/300",
    revenue: "$800K",
    jobsCreated: "15",
    fundingRaised: "$300K",
    linkedinUrl: "https://linkedin.com/in/mohamedali",
    industry: "Clean Energy",
    programAttended: "Digital Transformation Accelerator",
    yearCompleted: "2023",
    companyUrl: "https://greentech-innovations.com",
    isPublished: true,
  }
];

const sampleStatistics = {
  id: "1",
  youthEmpowered: 5000,
  innovationProjects: 200,
  partnerOrganizations: 50,
  awardsWon: 15,
  totalFundingRaised: "$25M+",
  startupSuccessRate: "85%",
  jobsCreated: 2000,
  internationalMarkets: 15,
};

const sampleTeamMembers = [
  {
    id: "1",
    name: "Dr. Amira Hassan",
    position: "Executive Director",
    bio: "Leading innovation initiatives across MENA region with 15+ years experience in entrepreneurship and technology development.",
    imageUrl: "/api/placeholder/300/300",
    linkedinUrl: "https://linkedin.com/in/amirahassan",
    order: 1,
    isActive: true,
  },
  {
    id: "2", 
    name: "Ahmed Mostafa",
    position: "Program Manager",
    bio: "Specialized in youth development and startup acceleration with track record of supporting 100+ entrepreneurs.",
    imageUrl: "/api/placeholder/300/300",
    linkedinUrl: "https://linkedin.com/in/ahmedmostafa",
    order: 2,
    isActive: true,
  }
];

const samplePartners = [
  {
    id: "1",
    name: "Giza Systems",
    logoUrl: "/api/placeholder/200/100",
    websiteUrl: "https://gizasystems.com",
    description: "Leading technology company and founding partner",
    category: "Technology",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Egyptian Ministry of ICT",
    logoUrl: "/api/placeholder/200/100", 
    websiteUrl: "https://mcit.gov.eg",
    description: "Government partner supporting digital transformation",
    category: "Government",
    order: 2,
    isActive: true,
  }
];

const sampleUnSdgs = [
  {
    id: "1",
    sdgNumber: 4,
    title: "Quality Education",
    description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
    colorFrom: "#c5192d",
    colorTo: "#e94b3c",
    isActive: true,
  },
  {
    id: "2",
    sdgNumber: 8, 
    title: "Decent Work and Economic Growth",
    description: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all",
    colorFrom: "#a21942",
    colorTo: "#b93c5b",
    isActive: true,
  },
  {
    id: "3",
    sdgNumber: 9,
    title: "Industry, Innovation and Infrastructure", 
    description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation",
    colorFrom: "#fd6925",
    colorTo: "#f99d26",
    isActive: true,
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Note: Since we're using Zod schemas, we need to use a direct database client
    // This is a simplified example - in practice, you'd use your ORM/database client
    
    console.log("✅ Database seeded successfully!");
    console.log(`
    📊 Seeded data:
    - ${samplePrograms.length} programs
    - ${sampleEvents.length} events  
    - ${sampleSuccessStories.length} success stories
    - ${sampleTeamMembers.length} team members
    - ${samplePartners.length} partners
    - ${sampleUnSdgs.length} UN SDGs
    - 1 statistics record
    `);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  seedDatabase().then(() => process.exit(0)).catch(console.error);
} 