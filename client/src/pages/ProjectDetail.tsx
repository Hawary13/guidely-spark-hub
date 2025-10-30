import React from "react";
import { useRoute } from "wouter";
import { ArrowLeft, MapPin, Users, Clock, Leaf, Zap, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const projectsData = {
  eden: {
    id: "eden",
    title: "Eden",
    subtitle: "Sustainable Agriculture & Environmental Restoration",
    description: "Supporting rural communities through eco-friendly farming practices and environmental restoration programs.",
    fullDescription: "Eden focuses on sustainable agriculture and environmental restoration programs that support rural communities while promoting eco-friendly farming practices. Our initiative bridges the gap between traditional farming methods and modern sustainable techniques.",
    location: "Rural Egypt & MENA Region",
    beneficiaries: "2,500+ farmers",
    timeline: "Ongoing since 2023",
    status: "Active",
    icon: Leaf,
    impact: [
      "Trained 2,500+ farmers in sustainable agriculture",
      "Restored 15,000 hectares of agricultural land",
      "Implemented water-saving irrigation systems",
      "Reduced chemical pesticide use by 60%",
      "Increased crop yields by average of 35%",
      "Created 1,200+ green jobs in rural areas"
    ],
    activities: [
      "Solar-powered irrigation system installation",
      "Organic farming training workshops",
      "Soil restoration and composting programs",
      "Climate-resilient crop variety distribution",
      "Farmer cooperative development",
      "Environmental impact monitoring"
    ],
    gradient: "from-green-500 to-emerald-500",
    color: "green"
  },
  graphene: {
    id: "graphene",
    title: "Graphene",
    subtitle: "Advanced Technology & Digital Literacy",
    description: "Bridging the digital divide through advanced technology solutions and digital literacy programs.",
    fullDescription: "Graphene addresses the digital divide by providing advanced technology solutions and comprehensive digital literacy programs for underserved communities. We focus on empowering individuals with the skills needed to thrive in the digital economy.",
    location: "Urban & Rural Egypt",
    beneficiaries: "10,000+ individuals",
    timeline: "Ongoing since 2022",
    status: "Active",
    icon: Zap,
    impact: [
      "Trained 10,000+ individuals in digital skills",
      "Established 25 digital learning centers",
      "Provided 5,000+ devices to underserved communities",
      "Connected 50+ rural schools to high-speed internet",
      "Created 800+ tech-enabled job opportunities",
      "Launched 15 community-driven tech initiatives"
    ],
    activities: [
      "Digital literacy bootcamps and workshops",
      "Computer lab setup in underserved areas",
      "Mobile app development training",
      "Blockchain and cryptocurrency education",
      "E-commerce platform development",
      "Tech entrepreneurship mentorship"
    ],
    gradient: "from-blue-500 to-cyan-500",
    color: "blue"
  },
  nitrous: {
    id: "nitrous",
    title: "Nitrous",
    subtitle: "Healthcare Accessibility & Medical Support",
    description: "Providing essential healthcare services and medical support to marginalized communities.",
    fullDescription: "Nitrous is dedicated to improving healthcare accessibility through comprehensive medical support initiatives for marginalized communities. We work to ensure that quality healthcare is available to those who need it most.",
    location: "Egypt & MENA Region",
    beneficiaries: "15,000+ patients",
    timeline: "Ongoing since 2021",
    status: "Active",
    icon: Heart,
    impact: [
      "Served 15,000+ patients with medical care",
      "Established 12 mobile health clinics",
      "Provided free medications worth $2M+",
      "Trained 300+ community health workers",
      "Completed 5,000+ health screenings",
      "Reduced child mortality rate by 25% in target areas"
    ],
    activities: [
      "Mobile health clinic operations",
      "Preventive care and health education",
      "Maternal and child health programs",
      "Chronic disease management",
      "Mental health awareness campaigns",
      "Healthcare infrastructure development"
    ],
    gradient: "from-orange-500 to-amber-500",
    color: "orange"
  }
};

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  
  if (!projectId || !projectsData[projectId as keyof typeof projectsData]) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/programs">Back to Programs & Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const project = projectsData[projectId as keyof typeof projectsData];
  const IconComponent = project.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${project.gradient} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="outline"
              asChild
              className="mb-6 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Link href="/programs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Programs & Projects
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {project.status}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl mb-6 text-white/90">{project.subtitle}</p>
            <p className="text-lg text-white/80 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.location}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Beneficiaries</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.beneficiaries}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Timeline</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.timeline}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Impact */}
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Impact Achieved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.impact.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} mt-2.5 flex-shrink-0`}></div>
                    <p className="text-gray-600 dark:text-gray-400">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Key Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 text-gsf-primary mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-400">{activity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className={`bg-gradient-to-br ${project.gradient} text-white`}>
            <CardContent className="p-12">
              <IconComponent className="h-16 w-16 text-white mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Support {project.title}</h3>
              <p className="text-xl mb-8 text-white/90">
                Help us expand the reach of {project.title} and create even greater impact in our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/join">
                    Get Involved
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 