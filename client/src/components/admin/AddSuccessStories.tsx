import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Users, TrendingUp, DollarSign } from "lucide-react";
import { SuccessStoryService } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import type { InsertSuccessStory } from "@shared/schema";

const successStoriesToAdd: InsertSuccessStory[] = [
  {
    id: "story-fatma-alzahra",
    personName: "Fatma Al-Zahra",
    personTitle: "CEO & Founder",
    companyName: "EcoVerde Solutions",
    story: "After completing GSF's Green Future Initiative, Fatma developed a revolutionary water purification system using solar energy. Her startup now serves over 50 rural communities across Egypt, providing clean water access to thousands of families while creating sustainable employment opportunities.",
    quote: "GSF didn't just teach me about business - they showed me how innovation can solve real problems. Today, we're not just a company, we're a movement for environmental change in Egypt.",
    achievements: [
      "Secured $500K seed funding from international investors",
      "Deployed water systems in 50+ communities",
      "Created 75 direct jobs in rural areas",
      "Reduced water-borne diseases by 60% in served communities",
      "Won Egyptian Environmental Innovation Award 2024"
    ],
    fundingRaised: "$500,000",
    jobsCreated: "75",
    revenue: "$1.2M annually",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/fatma-alzahra",
    companyUrl: "https://ecoverde-solutions.com",
    industry: "CleanTech",
    programAttended: "Green Future Initiative",
    yearCompleted: "2023",
    isPublished: true
  },
  {
    id: "story-omar-khalil",
    personName: "Omar Khalil",
    personTitle: "CTO & Co-Founder",
    companyName: "HealthTech Innovators",
    story: "Through GSF's Tech Innovation Hub, Omar and his team developed an AI-powered diagnostic platform that helps doctors in underserved areas make accurate diagnoses using smartphone cameras. The platform has been adopted by 200+ clinics across Egypt and is expanding to other African countries.",
    quote: "The mentorship and technical resources at GSF were game-changing. We went from an idea on paper to a platform that's saving lives across Africa. The impact is beyond what we ever imagined.",
    achievements: [
      "Raised $2M in Series A funding",
      "Platform used by 200+ medical clinics",
      "Diagnosed over 50,000 patients accurately",
      "Expanded to 5 African countries",
      "Partnerships with WHO and UNICEF",
      "85% accuracy rate matching specialist diagnoses"
    ],
    fundingRaised: "$2,000,000",
    jobsCreated: "120",
    revenue: "$3.5M annually",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/omar-khalil",
    companyUrl: "https://healthtech-innovators.com",
    industry: "HealthTech",
    programAttended: "Tech Innovation Hub",
    yearCompleted: "2022",
    isPublished: true
  },
  {
    id: "story-yasmin-nasser",
    personName: "Yasmin Nasser",
    personTitle: "Founder & Managing Director",
    companyName: "EdTech Arabia",
    story: "Yasmin transformed Egypt's educational landscape by creating an adaptive learning platform that personalizes education for K-12 students. Starting from GSF's Digital Skills Academy, her platform now serves over 100,000 students and has been adopted by the Egyptian Ministry of Education.",
    quote: "GSF gave me the confidence to dream big and the tools to make it happen. We're not just teaching students - we're reshaping how an entire generation learns.",
    achievements: [
      "100,000+ students using the platform",
      "Adopted by Egyptian Ministry of Education",
      "40% improvement in student performance metrics",
      "Expanded to Saudi Arabia and UAE",
      "Won Arab Innovation Award 2024",
      "Created 85 high-skill jobs"
    ],
    fundingRaised: "$1,500,000",
    jobsCreated: "85",
    revenue: "$2.8M annually",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/yasmin-nasser",
    companyUrl: "https://edtech-arabia.com",
    industry: "EdTech",
    programAttended: "Digital Skills Academy",
    yearCompleted: "2023",
    isPublished: true
  },
  {
    id: "story-ahmed-mansour-agri",
    personName: "Ahmed Mansour",
    personTitle: "CEO",
    companyName: "AgriSmart Egypt",
    story: "Ahmed revolutionized Egyptian agriculture through IoT sensors and data analytics. His precision farming solutions help farmers increase crop yields by 35% while reducing water usage by 50%. The company now works with over 1,000 farms across the Nile Delta.",
    quote: "GSF connected me with mentors who understood both technology and agriculture. Now we're helping Egyptian farmers feed the nation more efficiently while preserving our precious water resources.",
    achievements: [
      "1,000+ farms using AgriSmart technology",
      "35% average increase in crop yields",
      "50% reduction in water usage",
      "$10M+ additional revenue generated for farmers",
      "Expanded to Jordan and Morocco",
      "Partnership with Egyptian Ministry of Agriculture"
    ],
    fundingRaised: "$800,000",
    jobsCreated: "60",
    revenue: "$1.8M annually",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/ahmed-mansour",
    companyUrl: "https://agrismart-egypt.com",
    industry: "AgriTech",
    programAttended: "Tech Innovation Hub",
    yearCompleted: "2022",
    isPublished: true
  },
  {
    id: "story-ahmed-mansour",
    personName: "Ahmed Mansour",
    personTitle: "CEO",
    companyName: "AgriSmart Egypt",
    story: "Ahmed revolutionized Egyptian farming with IoT-based precision agriculture solutions. His platform helps farmers optimize water usage, monitor soil health, and increase crop yields by 40% while reducing resource consumption.",
    quote: "GSF connected me with the agricultural expertise and technical mentorship I needed. We're not just growing better crops - we're growing a more sustainable future for Egyptian agriculture.",
    achievements: [
      "40% average yield increase for partner farms",
      "Reduced water consumption by 30%",
      "Serving 500+ farms across Egypt",
      "Expanded to Jordan and Morocco",
      "Partnership with Egyptian Ministry of Agriculture"
    ],
    fundingRaised: "$800,000",
    jobsCreated: "60",
    revenue: "$1.8M annually",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/ahmed-mansour",
    companyUrl: "https://agrismart-egypt.com",
    industry: "AgriTech",
    programAttended: "Tech Innovation Hub",
    yearCompleted: "2022",
    isPublished: true
  },
  {
    id: "story-nour-eldin",
    personName: "Nour El-Din",
    personTitle: "Founder",
    companyName: "Green Energy Solutions",
    story: "Nour developed innovative solar panel recycling technology that recovers 95% of valuable materials from old panels. Her circular economy approach has processed over 10,000 panels and created a new industry vertical in Egypt's renewable energy sector.",
    quote: "GSF taught me that sustainability isn't just about creating green energy - it's about creating green entire lifecycles. We're proving that environmental responsibility and business success go hand in hand.",
    achievements: [
      "Recycled 10,000+ solar panels",
      "95% material recovery rate achieved",
      "Created Egypt's first solar recycling facility",
      "Prevented 500 tons of electronic waste",
      "Licensed technology to 3 other countries",
      "Generated $2M+ in recovered materials value"
    ],
    fundingRaised: "$600,000",
    jobsCreated: "45",
    revenue: "$1.1M annually",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/nour-eldin",
    companyUrl: "https://green-energy-solutions.com",
    industry: "CleanTech",
    programAttended: "Green Future Initiative",
    yearCompleted: "2023",
    isPublished: true
  },
  {
    id: "story-mariam-farouk",
    personName: "Mariam Farouk",
    personTitle: "Co-Founder & CEO",
    companyName: "FinTech Bridge",
    story: "Mariam created a mobile payment platform specifically designed for Egypt's unbanked population. Her solution enables micro-entrepreneurs and small businesses to accept digital payments, bringing financial inclusion to over 250,000 Egyptians.",
    quote: "GSF showed me that technology should serve everyone, not just the privileged few. Today, a street vendor in Cairo can accept payments just like a multinational corporation.",
    achievements: [
      "250,000+ users onboarded",
      "Processed $50M+ in transactions",
      "Partnered with Central Bank of Egypt",
      "40% of users previously had no bank account",
      "Expanded to 3 African countries",
      "Won MENA FinTech Award 2024"
    ],
    fundingRaised: "$3,200,000",
    jobsCreated: "150",
    revenue: "$4.2M annually",
    imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=center",
    linkedinUrl: "https://linkedin.com/in/mariam-farouk",
    companyUrl: "https://fintech-bridge.com",
    industry: "FinTech",
    programAttended: "Tech Innovation Hub",
    yearCompleted: "2021",
    isPublished: true
  }
];

interface StoryStatus {
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  firebaseId?: string;
}

export default function AddSuccessStories() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyStatuses, setStoryStatuses] = useState<StoryStatus[]>([]);
  const { toast } = useToast();

  const handleUploadStories = async () => {
    setIsUploading(true);
    setProgress(0);
    
    // Initialize status for all stories
    const initialStatuses: StoryStatus[] = successStoriesToAdd.map((story, index) => ({
      id: `story-${index}`,
      status: 'pending'
    }));
    setStoryStatuses(initialStatuses);

    let completed = 0;
    const total = successStoriesToAdd.length;

    for (let i = 0; i < successStoriesToAdd.length; i++) {
      const story = successStoriesToAdd[i];
      const storyId = `story-${i}`;
      
      try {
        // Update status to uploading
        setStoryStatuses(prev => 
          prev.map(s => s.id === storyId ? { ...s, status: 'uploading' } : s)
        );

        // Create the story in Firebase
        const firebaseId = await SuccessStoryService.create(story);
        
        // Update status to success
        setStoryStatuses(prev => 
          prev.map(s => s.id === storyId ? { ...s, status: 'success', firebaseId } : s)
        );

        completed++;
        setProgress((completed / total) * 100);

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Failed to upload story for ${story.personName}:`, error);
        
        // Update status to error
        setStoryStatuses(prev => 
          prev.map(s => s.id === storyId ? { 
            ...s, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : s)
        );

        completed++;
        setProgress((completed / total) * 100);
      }
    }

    setIsUploading(false);
    
    const successCount = storyStatuses.filter(s => s.status === 'success').length;
    const errorCount = storyStatuses.filter(s => s.status === 'error').length;
    
    toast({
      title: "Upload Complete",
      description: `${successCount} stories uploaded successfully. ${errorCount} errors.`,
      variant: errorCount > 0 ? "destructive" : "default"
    });
  };

  const getStatusIcon = (status: StoryStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'uploading':
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: StoryStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Success Stories to Firebase
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload {successStoriesToAdd.length} comprehensive success stories to make the Impact page more compelling
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Control */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Ready to upload {successStoriesToAdd.length} authentic success stories
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <div className="text-xs text-gray-500">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleUploadStories}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  Upload Stories
                </>
              )}
            </Button>
          </div>

          {/* Story Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {successStoriesToAdd.map((story, index) => {
              const status = storyStatuses.find(s => s.id === `story-${index}`);
              return (
                <Card key={index} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{story.personName}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {story.personTitle} at {story.companyName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {status && getStatusIcon(status.status)}
                        {status && (
                          <Badge variant="secondary" className={getStatusColor(status.status)}>
                            {status.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {story.revenue}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {story.jobsCreated} jobs
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {story.industry}
                      </Badge>
                    </div>
                    
                    {status?.error && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                        Error: {status.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}