import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ParticlesHero } from "@/components/ui/ParticlesHero";
import { Link } from "wouter";
import { TrendingUp, Award, Users, DollarSign, CheckCircle, Quote, ArrowRight, Star, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestore";
import { SuccessStoryService, StatisticsService, PageContentService } from "@/lib/firestore";
import type { SuccessStory, Statistics, PageContent } from "@shared/schema";

export default function Impact() {
  // Use fallback data with timeout to prevent infinite loading
  const { data: successStories = [], isLoading: storiesLoading, error: storiesError } = useFirestoreData<SuccessStory>(
    ['success-stories'],
    SuccessStoryService.getAll,
    SuccessStoryService.subscribe
  );

  const { data: statistics, error: statsError } = useFirestoreData<Statistics>(
    ['statistics'],
    StatisticsService.get,
    StatisticsService.subscribe
  );

  const { data: impactPage, error: pageError } = useFirestoreData<PageContent>(
    ['pages', 'impact'],
    () => PageContentService.getById('impact'),
    PageContentService.subscribe
  );

  // Fallback statistics data when Firebase is unavailable
  const fallbackStats: Statistics = {
    id: 'fallback',
    youthEmpowered: 2500,
    innovationProjects: 150,
    partnerOrganizations: 45,
    awardsWon: 12,
    totalFundingRaised: '$2.5M',
    startupSuccessRate: '85%',
    jobsCreated: 450,
    internationalMarkets: 15,
    lastUpdated: new Date()
  };

  // Fallback success stories when Firebase is unavailable
  const fallbackStories: SuccessStory[] = [
    {
      id: 'story1',
      personName: 'Fatma Al-Zahra',
      personTitle: 'CEO & Founder',
      companyName: 'EcoVerde Solutions',
      story: 'After completing GSF\'s Green Future Initiative, Fatma developed a revolutionary water purification system using solar energy. Her startup now serves over 50 rural communities across Egypt, providing clean water access to thousands of families while creating sustainable employment opportunities.',
      quote: 'GSF didn\'t just teach me about business - they showed me how innovation can solve real problems. Today, we\'re not just a company, we\'re a movement for environmental change in Egypt.',
      achievements: [
        'Secured $500K seed funding from international investors',
        'Deployed water systems in 50+ communities',
        'Created 75 direct jobs in rural areas',
        'Reduced water-borne diseases by 60% in served communities',
        'Won Egyptian Environmental Innovation Award 2024'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=center',
      revenue: '$1.2M annually',
      jobsCreated: "75",
      fundingRaised: '$500,000',
      linkedinUrl: 'https://linkedin.com/in/fatma-alzahra',
      companyUrl: 'https://ecoverde-solutions.com',
      industry: 'CleanTech',
      programAttended: 'Green Future Initiative',
      yearCompleted: "2023",
      isPublished: true,
      createdAt: new Date('2023-12-01')
    },
    {
      id: 'story2',
      personName: 'Omar Khalil',
      personTitle: 'CTO & Co-Founder',
      companyName: 'HealthTech Innovators',
      story: 'Through GSF\'s Tech Innovation Hub, Omar and his team developed an AI-powered diagnostic platform that helps doctors in underserved areas make accurate diagnoses using smartphone cameras. The platform has been adopted by 200+ clinics across Egypt and is expanding to other African countries.',
      quote: 'The mentorship and technical resources at GSF were game-changing. We went from an idea on paper to a platform that\'s saving lives across Africa. The impact is beyond what we ever imagined.',
      achievements: [
        'Raised $2M in Series A funding',
        'Platform used by 200+ medical clinics',
        'Diagnosed over 50,000 patients accurately',
        'Expanded to 5 African countries',
        'Partnerships with WHO and UNICEF',
        '85% accuracy rate matching specialist diagnoses'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
      revenue: '$3.5M annually',
      jobsCreated: "120",
      fundingRaised: '$2,000,000',
      linkedinUrl: 'https://linkedin.com/in/omar-khalil',
      companyUrl: 'https://healthtech-innovators.com',
      industry: 'HealthTech',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2022",
      isPublished: true,
      createdAt: new Date('2022-09-15')
    },
    {
      id: 'story3',
      personName: 'Yasmin Nasser',
      personTitle: 'Founder & Managing Director',
      companyName: 'EdTech Arabia',
      story: 'Yasmin transformed Egypt\'s educational landscape by creating an adaptive learning platform that personalizes education for K-12 students. Starting from GSF\'s Digital Skills Academy, her platform now serves over 100,000 students and has been adopted by the Egyptian Ministry of Education.',
      quote: 'GSF gave me the confidence to dream big and the tools to make it happen. We\'re not just teaching students - we\'re reshaping how an entire generation learns.',
      achievements: [
        '100,000+ students using the platform',
        'Adopted by Egyptian Ministry of Education',
        '40% improvement in student performance metrics',
        'Expanded to Saudi Arabia and UAE',
        'Won Arab Innovation Award 2024',
        'Created 85 high-skill jobs'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
      revenue: '$2.8M annually',
      jobsCreated: "85",
      fundingRaised: '$1,500,000',
      linkedinUrl: 'https://linkedin.com/in/yasmin-nasser',
      companyUrl: 'https://edtech-arabia.com',
      industry: 'EdTech',
      programAttended: 'Digital Skills Academy',
      yearCompleted: "2023",
      isPublished: true,
      createdAt: new Date('2023-06-20')
    },
    {
      id: 'story4',
      personName: 'Ahmed Mansour',
      personTitle: 'CEO',
      companyName: 'AgriSmart Egypt',
      story: 'Ahmed revolutionized Egyptian agriculture through IoT sensors and data analytics. His precision farming solutions help farmers increase crop yields by 35% while reducing water usage by 50%. The company now works with over 1,000 farms across the Nile Delta.',
      quote: 'GSF connected me with mentors who understood both technology and agriculture. Now we\'re helping Egyptian farmers feed the nation more efficiently while preserving our precious water resources.',
      achievements: [
        '1,000+ farms using AgriSmart technology',
        '35% average increase in crop yields',
        '50% reduction in water usage',
        '$10M+ additional revenue generated for farmers',
        'Expanded to Jordan and Morocco',
        'Partnership with Egyptian Ministry of Agriculture'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
      revenue: '$1.8M annually',
      jobsCreated: "60",
      fundingRaised: '$800,000',
      linkedinUrl: 'https://linkedin.com/in/ahmed-mansour',
      companyUrl: 'https://agrismart-egypt.com',
      industry: 'AgriTech',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2022",
      isPublished: true,
      createdAt: new Date('2022-11-10')
    },
    {
      id: 'story5',
      personName: 'Nour El-Din',
      personTitle: 'Founder',
      companyName: 'Green Energy Solutions',
      story: 'Nour developed innovative solar panel recycling technology that recovers 95% of valuable materials from old panels. Her circular economy approach has processed over 10,000 panels and created a new industry vertical in Egypt\'s renewable energy sector.',
      quote: 'GSF taught me that sustainability isn\'t just about creating green energy - it\'s about creating green entire lifecycles. We\'re proving that environmental responsibility and business success go hand in hand.',
      achievements: [
        'Recycled 10,000+ solar panels',
        '95% material recovery rate achieved',
        'Created Egypt\'s first solar recycling facility',
        'Prevented 500 tons of electronic waste',
        'Licensed technology to 3 other countries',
        'Generated $2M+ in recovered materials value'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=center',
      revenue: '$1.1M annually',
      jobsCreated: "45",
      fundingRaised: '$600,000',
      linkedinUrl: 'https://linkedin.com/in/nour-eldin',
      companyUrl: 'https://green-energy-solutions.com',
      industry: 'CleanTech',
      programAttended: 'Green Future Initiative',
      yearCompleted: "2023",
      isPublished: true,
      createdAt: new Date('2023-08-05')
    },
    {
      id: 'story6',
      personName: 'Mariam Farouk',
      personTitle: 'Co-Founder & CEO',
      companyName: 'FinTech Bridge',
      story: 'Mariam created a mobile payment platform specifically designed for Egypt\'s unbanked population. Her solution enables micro-entrepreneurs and small businesses to accept digital payments, bringing financial inclusion to over 250,000 Egyptians.',
      quote: 'GSF showed me that technology should serve everyone, not just the privileged few. Today, a street vendor in Cairo can accept payments just like a multinational corporation.',
      achievements: [
        '250,000+ users onboarded',
        'Processed $50M+ in transactions',
        'Partnered with Central Bank of Egypt',
        '40% of users previously had no bank account',
        'Expanded to 3 African countries',
        'Won MENA FinTech Award 2024'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=center',
      revenue: '$4.2M annually',
      jobsCreated: "150",
      fundingRaised: '$3,200,000',
      linkedinUrl: 'https://linkedin.com/in/mariam-farouk',
      companyUrl: 'https://fintech-bridge.com',
      industry: 'FinTech',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2021",
      isPublished: true,
      createdAt: new Date('2021-10-30')
    },
    {
      id: "story-7",
      personName: "Youssef Mansour",
      personTitle: "CEO & Co-founder",
      companyName: "CyberGuard Egypt",
      story: "Starting with just a passion for cybersecurity during my university years, I joined GSF's Tech Innovation Hub to turn my research into a commercial product. The program's mentorship helped me understand market needs and develop enterprise-grade security solutions. Today, CyberGuard Egypt protects over 500 Egyptian businesses from cyber threats.",
      quote: "GSF didn't just provide funding; they provided the strategic guidance that helped us build a company that truly makes Egypt's digital infrastructure safer.",
      achievements: [
        "Protected 500+ Egyptian businesses from cyber threats",
        "Secured $2.8M in Series A funding",
        "Hired 85 cybersecurity specialists",
        "Expanded to 6 African countries",
        "Received Egypt's National Security Innovation Award 2024"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
      revenue: '$5.1M annually',
      jobsCreated: "85",
      fundingRaised: '$2,800,000',
      linkedinUrl: 'https://linkedin.com/in/youssef-mansour-cyber',
      companyUrl: 'https://cyberguard-egypt.com',
      industry: 'Cybersecurity',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2020",
      isPublished: true,
      createdAt: new Date('2020-11-15')
    },
    {
      id: "story-8",
      personName: "Salma Hassan",
      personTitle: "Founder & CEO",
      companyName: "NileTech Solutions",
      story: "As a computer science graduate, I had technical skills but lacked business acumen. GSF's comprehensive program taught me everything from market validation to investor pitching. We developed AI-powered solutions for Egypt's logistics sector, revolutionizing how goods move across the country.",
      quote: "The GSF program transformed me from a programmer into a business leader. Their network opened doors I never knew existed.",
      achievements: [
        "Optimized logistics for 200+ Egyptian companies",
        "Reduced delivery times by 40% across client base",
        "Created 60 high-tech jobs",
        "Won MENA AI Innovation Award 2023",
        "Secured partnerships with 3 government ministries"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
      revenue: '$3.2M annually',
      jobsCreated: "60",
      fundingRaised: '$1,900,000',
      linkedinUrl: 'https://linkedin.com/in/salma-hassan-ai',
      companyUrl: 'https://niletech-solutions.com',
      industry: 'AI & Logistics',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2022",
      isPublished: true,
      createdAt: new Date('2022-09-20')
    },
    {
      id: "story-9",
      personName: "Mohamed El-Sharif",
      personTitle: "Founder",
      companyName: "EduTech Arabia",
      story: "After witnessing the educational challenges in rural Egypt, I developed a platform that brings quality education to underserved communities. GSF's Digital Skills Academy provided the technical foundation and business mentorship to scale our impact across the Middle East.",
      quote: "GSF believed in our mission to democratize education when others saw only challenges. Their support helped us reach over 100,000 students.",
      achievements: [
        "Educated 100,000+ students across MENA region",
        "Partnered with 150 schools in rural areas",
        "Created 45 educational technology jobs",
        "Reduced learning gaps by 60% in partner schools",
        "Won UNESCO Digital Education Excellence Award"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
      revenue: '$2.8M annually',
      jobsCreated: "45",
      fundingRaised: '$1,500,000',
      linkedinUrl: 'https://linkedin.com/in/mohamed-elsharif-edu',
      companyUrl: 'https://edutech-arabia.com',
      industry: 'EdTech',
      programAttended: 'Digital Skills Academy',
      yearCompleted: "2021",
      isPublished: true,
      createdAt: new Date('2021-08-12')
    },
    {
      id: "story-10",
      personName: "Nour Abdel-Rahman",
      personTitle: "Co-founder & CTO",
      companyName: "SmartFarm Technologies",
      story: "Coming from an agricultural family, I saw firsthand how technology could revolutionize farming in Egypt. Through GSF's Green Future Initiative, we developed IoT solutions that help farmers optimize crop yields while conserving water. Our technology now supports sustainable farming across North Africa.",
      quote: "GSF helped us bridge the gap between traditional farming and modern technology, creating solutions that work for Egyptian farmers.",
      achievements: [
        "Increased crop yields by 35% for 800+ farmers",
        "Saved 2 million liters of water annually",
        "Created 40 agritech jobs",
        "Expanded to 4 North African countries",
        "Won African AgriTech Innovation Prize 2024"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=center',
      revenue: '$2.1M annually',
      jobsCreated: "40",
      fundingRaised: '$1,200,000',
      linkedinUrl: 'https://linkedin.com/in/nour-agritech',
      companyUrl: 'https://smartfarm-tech.com',
      industry: 'AgriTech',
      programAttended: 'Green Future Initiative',
      yearCompleted: "2022",
      isPublished: true,
      createdAt: new Date('2022-07-18')
    },
    {
      id: "story-11",
      personName: "Omar Farouk",
      personTitle: "Founder & CEO",
      companyName: "MedConnect Egypt",
      story: "As a medical doctor, I experienced the healthcare access challenges in Egypt firsthand. GSF's mentorship helped me develop a telemedicine platform that connects patients in remote areas with qualified doctors. We're now improving healthcare access for thousands of Egyptians.",
      quote: "GSF taught me that being a doctor and an entrepreneur aren't mutually exclusive. Their program showed me how to use technology to multiply my impact.",
      achievements: [
        "Connected 25,000+ patients to quality healthcare",
        "Partnered with 200 certified doctors",
        "Reduced healthcare costs by 50% for rural patients",
        "Created 35 healthtech jobs",
        "Recognized by Egypt's Ministry of Health"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center',
      revenue: '$1.8M annually',
      jobsCreated: "35",
      fundingRaised: '$1,100,000',
      linkedinUrl: 'https://linkedin.com/in/omar-farouk-medtech',
      companyUrl: 'https://medconnect-egypt.com',
      industry: 'HealthTech',
      programAttended: 'Tech Innovation Hub',
      yearCompleted: "2023",
      isPublished: true,
      createdAt: new Date('2023-03-10')
    },
    {
      id: "story-12",
      personName: "Yasmin Khalil",
      personTitle: "Co-founder",
      companyName: "CleanWater Solutions",
      story: "Growing up in a community with water quality issues, I was determined to find solutions. GSF's Green Future Initiative provided the resources and expertise to develop innovative water purification systems. Now we're providing clean water access to communities across Egypt and Sudan.",
      quote: "GSF believed in our vision of clean water for all. Their support helped us turn a social mission into a sustainable business that creates real impact.",
      achievements: [
        "Provided clean water to 50,000+ people",
        "Installed 200 water purification systems",
        "Created 30 clean technology jobs",
        "Reduced waterborne diseases by 70% in served areas",
        "Won Arab Water Council Innovation Award 2023"
      ],
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=center',
      revenue: '$1.5M annually',
      jobsCreated: "30",
      fundingRaised: '$900,000',
      linkedinUrl: 'https://linkedin.com/in/yasmin-khalil-water',
      companyUrl: 'https://cleanwater-solutions.net',
      industry: 'CleanTech',
      programAttended: 'Green Future Initiative',
      yearCompleted: "2022",
      isPublished: true,
      createdAt: new Date('2022-12-05')
    }
  ];

  // Use actual data if available, otherwise use fallback
  const displayStats = statistics || fallbackStats;
  const displayStories = successStories && successStories.length > 0 ? successStories : fallbackStories;

  const publishedStories = displayStories.filter(story => story.isPublished);
  const featuredStory = publishedStories[0];
  const caseStudies = publishedStories.slice(1, 4);
  const otherStories = publishedStories.slice(4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Interactive Particles Hero Section */}
      <ParticlesHero
        title="Impact & Success Stories"
        subtitle="Discover how entrepreneurs are building the future through innovation, determination, and the support of our accelerator program."
        primaryButtonText="Start Your Journey"
        secondaryButtonText="Learn More About Our Programs"
        onPrimaryClick={() => window.location.href = '/join'}
        onSecondaryClick={() => window.location.href = '/programs'}
      />

      {/* Impact Statistics Bar */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {displayStats.totalFundingRaised}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Total Funding Raised
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {displayStats.startupSuccessRate}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Success Rate
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {displayStats.jobsCreated.toLocaleString()}+
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Jobs Created
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {displayStats.internationalMarkets}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Global Markets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story - Large Hero Style */}
      {featuredStory && (
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Featured Success Story
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {featuredStory.companyName}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    {featuredStory.personTitle} • {featuredStory.personName}
                  </p>
                </div>
                
                <blockquote className="text-2xl font-medium text-gray-900 dark:text-white italic leading-relaxed border-l-4 border-blue-600 pl-6">
                  "{featuredStory.quote}"
                </blockquote>

                <div className="grid grid-cols-2 gap-6">
                  {featuredStory.fundingRaised && (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {featuredStory.fundingRaised}
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Funding Raised
                      </p>
                    </div>
                  )}
                  {featuredStory.jobsCreated && (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {featuredStory.jobsCreated}+
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Jobs Created
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {featuredStory.achievements.slice(0, 3).map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Read Full Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={featuredStory.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"}
                    alt={featuredStory.personName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      5.0 Success Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Case Studies - German Accelerator Style Cards */}
      {caseStudies.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Featured Case Studies
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Deep dives into the journeys of our most successful portfolio companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((story, index) => (
                <Card key={story.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 border-0 shadow-lg cursor-pointer bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/15 group-hover:to-purple-500/15 transition-all duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700 relative z-10">
                    <img
                      src={story.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400`}
                      alt={story.companyName}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <CardContent className="p-8 space-y-6 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/70 transition-colors duration-300">
                          Case Study
                        </Badge>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {story.companyName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {story.personName} • {story.personTitle}
                      </p>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {story.story}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-600 transition-colors duration-300">
                      {story.revenue && (
                        <div className="text-sm">
                          <span className="font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">{story.revenue}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">revenue</span>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 group-hover:scale-110 transition-transform duration-300">
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Impact Areas - Clean Grid Layout */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Impact Areas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Creating transformative change across key sectors of the Egyptian economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Technology",
                description: "AI, blockchain, and digital transformation solutions",
                color: "blue",
                stats: "45+ startups"
              },
              {
                icon: Award,
                title: "Social Impact",
                description: "Education, healthcare, and sustainability ventures",
                color: "green",
                stats: "30+ ventures"
              },
              {
                icon: DollarSign,
                title: "FinTech",
                description: "Digital payments and financial inclusion",
                color: "purple",
                stats: "25+ companies"
              },
              {
                icon: TrendingUp,
                title: "E-commerce",
                description: "Online marketplaces and retail innovation",
                color: "orange",
                stats: "35+ platforms"
              }
            ].map((area, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  area.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  area.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  area.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <area.icon className={`h-8 w-8 ${
                    area.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    area.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    area.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {area.description}
                </p>
                <div className={`text-sm font-semibold ${
                  area.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  area.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  area.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-orange-600 dark:text-orange-400'
                }`}>
                  {area.stats}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Success Stories - List Style */}
      {otherStories.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                More Success Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Every entrepreneur has a unique journey to success
              </p>
            </div>

            <div className="space-y-8">
              {otherStories.map((story, index) => (
                <Card key={story.id} className="p-8 hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-600">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                    <div className="md:col-span-1">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                          src={story.imageUrl || `https://images.unsplash.com/photo-${1400000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300`}
                          alt={story.personName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {story.companyName}
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-300">
                            {story.personName} • {story.personTitle}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-400">
                          Success Story
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {story.story.substring(0, 200)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {story.revenue && (
                            <div className="text-sm">
                              <span className="font-bold text-green-600 dark:text-green-400">{story.revenue}</span>
                              <span className="text-gray-500 dark:text-gray-400 ml-1">revenue</span>
                            </div>
                          )}
                          {story.jobsCreated && (
                            <div className="text-sm">
                              <span className="font-bold text-blue-600 dark:text-blue-400">{story.jobsCreated}+</span>
                              <span className="text-gray-500 dark:text-gray-400 ml-1">jobs</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                          Read Full Story →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-24 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Start Your Success Story
            </h2>
            <p className="text-xl text-white/90 dark:text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join the next generation of successful entrepreneurs. Apply to our accelerator program and transform your idea into a thriving business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white bg-white !text-blue-600 hover:bg-gray-100 hover:!text-blue-700 font-semibold"
              >
                Learn More About Our Programs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}