import { z } from "zod";

// User schema for admin authentication
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  displayName: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'editor', 'viewer']).default('editor'),
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  lastLogin: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Page content schema
export const pageContentSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.record(z.any()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  isPublished: z.boolean().default(true),
  lastModified: z.date().default(() => new Date()),
});

// Hero section schema
export const heroSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  primaryButtonText: z.string(),
  primaryButtonLink: z.string(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  lastModified: z.date().default(() => new Date()),
});

// About section schema
export const aboutSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  mission: z.string(),
  vision: z.string(),
  values: z.array(z.string()),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  lastModified: z.date().default(() => new Date()),
});

// Mission & Vision schema
export const missionVisionSchema = z.object({
  id: z.string(),
  missionTitle: z.string(),
  missionStatement: z.string(),
  visionTitle: z.string(),
  visionStatement: z.string(),
  coreValues: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })),
  isActive: z.boolean().default(true),
  lastModified: z.date().default(() => new Date()),
});

// Program schema - Enhanced for admin control
export const programSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  fullDescription: z.string(),
  overview: z.string(),
  objectives: z.array(z.string()),
  process: z.array(z.string()),
  keyAchievements: z.array(z.string()),
  features: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  status: z.enum(['Active', 'Upcoming', 'Archived']),
  duration: z.string(),
  participants: z.string(),
  applicationDeadline: z.string(),
  imageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  iconName: z.string().optional(),
  gradient: z.string().default('from-blue-500 to-cyan-500'),
  color: z.string().default('blue'),
  isAcceptingApplications: z.boolean().default(false),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Project schema - New for admin control
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  fullDescription: z.string(),
  location: z.string(),
  beneficiaries: z.string(),
  timeline: z.string(),
  status: z.enum(['Active', 'Upcoming', 'Completed', 'Archived']),
  impact: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  iconName: z.string().optional(),
  gradient: z.string().default('from-green-500 to-emerald-500'),
  color: z.string().default('green'),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Event schema
export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  fullDescription: z.string().optional(),
  date: z.date(),
  endDate: z.date().optional(),
  time: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  mapUrl: z.string().optional(),
  type: z.enum(['Workshop', 'Networking', 'Live Event', 'Conference']),
  imageUrl: z.string().optional(),
  mediaImages: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
  })).default([]),
  speakers: z.array(z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string().optional(),
    imageUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    twitterUrl: z.string().optional(),
  })).default([]),
  agenda: z.array(z.object({
    time: z.string(),
    title: z.string(),
    description: z.string().optional(),
    speaker: z.string().optional(),
  })).default([]),
  registrationUrl: z.string().optional(),
  applicationEnabled: z.boolean().default(false),
  applicationDeadline: z.date().optional(),
  capacity: z.number().optional(),
  price: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

// Team member schema
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Partner schema
export const partnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string(),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

// UN SDG schema
export const unSdgSchema = z.object({
  id: z.string(),
  sdgNumber: z.number().min(1).max(17),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  colorFrom: z.string().min(1, "Color from is required"),
  colorTo: z.string().min(1, "Color to is required"),
  isActive: z.boolean().default(true),
  lastModified: z.date().default(() => new Date()),
});

// Form submission schema
export const formSubmissionSchema = z.object({
  id: z.string(),
  type: z.enum(['application', 'contact', 'mentor', 'partner', 'volunteer']),
  data: z.record(z.any()),
  submittedAt: z.date().default(() => new Date()),
  status: z.enum(['new', 'reviewed', 'contacted', 'archived']).default('new'),
  notes: z.string().optional(),
});

// Statistics schema
export const statisticsSchema = z.object({
  id: z.string(),
  youthEmpowered: z.number().default(5000),
  innovationProjects: z.number().default(200),
  partnerOrganizations: z.number().default(50),
  awardsWon: z.number().default(15),
  totalFundingRaised: z.string().default('$25M+'),
  startupSuccessRate: z.string().default('85%'),
  jobsCreated: z.number().default(2000),
  internationalMarkets: z.number().default(15),
  lastUpdated: z.date().default(() => new Date()),
});

// News article schema
export const newsSchema = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
  publishDate: z.date(),
  author: z.string(),
  isPublished: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
});

// Success story schema
export const successStorySchema = z.object({
  id: z.string(),
  personName: z.string(),
  personTitle: z.string(),
  companyName: z.string(),
  story: z.string(),
  quote: z.string(),
  achievements: z.array(z.string()),
  imageUrl: z.string().optional(),
  revenue: z.string().optional(),
  jobsCreated: z.string().optional(),
  fundingRaised: z.string().optional(),
  linkedinUrl: z.string().optional(),
  industry: z.string().optional(),
  programAttended: z.string().optional(),
  yearCompleted: z.string().optional(),
  companyUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
});

// Types
export type User = z.infer<typeof userSchema>;
export type PageContent = z.infer<typeof pageContentSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type MissionVision = z.infer<typeof missionVisionSchema>;
export type Program = z.infer<typeof programSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Event = z.infer<typeof eventSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type UnSdg = z.infer<typeof unSdgSchema>;
export type FormSubmission = z.infer<typeof formSubmissionSchema>;
export type Statistics = z.infer<typeof statisticsSchema>;
export type News = z.infer<typeof newsSchema>;
export type SuccessStory = z.infer<typeof successStorySchema>;

// Insert schemas (omitting auto-generated fields)
export const insertUserSchema = userSchema.omit({ createdAt: true, updatedAt: true, lastLogin: true });
export const insertPageContentSchema = pageContentSchema.omit({ lastModified: true });
export const insertHeroSectionSchema = heroSectionSchema.omit({ lastModified: true });
export const insertAboutSectionSchema = aboutSectionSchema.omit({ lastModified: true });
export const insertMissionVisionSchema = missionVisionSchema.omit({ lastModified: true });
export const insertProgramSchema = programSchema.omit({ createdAt: true, updatedAt: true });
export const insertProjectSchema = projectSchema.omit({ createdAt: true, updatedAt: true });
export const insertEventSchema = eventSchema.omit({ createdAt: true });
export const insertTeamMemberSchema = teamMemberSchema;
export const insertPartnerSchema = partnerSchema;
export const insertUnSdgSchema = unSdgSchema.omit({ lastModified: true });
export const insertFormSubmissionSchema = formSubmissionSchema.omit({ submittedAt: true });
export const insertStatisticsSchema = statisticsSchema.omit({ lastUpdated: true });
export const insertNewsSchema = newsSchema.omit({ createdAt: true });
export const insertSuccessStorySchema = successStorySchema.omit({ createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type InsertHeroSection = z.infer<typeof insertHeroSectionSchema>;
export type InsertAboutSection = z.infer<typeof insertAboutSectionSchema>;
export type InsertMissionVision = z.infer<typeof insertMissionVisionSchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type InsertUnSdg = z.infer<typeof insertUnSdgSchema>;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type InsertStatistics = z.infer<typeof insertStatisticsSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
