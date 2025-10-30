import React from "react";
import { useRoute } from "wouter";
import { ArrowLeft, Calendar, Users, Target, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const programsData = {
  bridgez: {
    id: "bridgez",
    title: "BridgEz Acceleration Program",
    subtitle: "Fueling Social Impact Startups",
    description: "A comprehensive acceleration program designed to empower social impact startups through structured mentorship, investment readiness training, and strategic networking opportunities.",
    fullDescription: "The BridgEz Acceleration Program is our flagship initiative for early-stage social impact startups. We provide entrepreneurs with the tools, knowledge, and connections they need to scale their ventures and create meaningful change in their communities.",
    duration: "6 months",
    participants: "15-20 startups per cohort",
    applicationDeadline: "Rolling admissions",
    status: "Active",
    features: [
      "Weekly mentorship sessions with industry experts",
      "Investment readiness workshops and pitch training",
      "Access to our network of investors and partners",
      "Technical support and product development guidance",
      "Legal and financial advisory services",
      "Demo day presentation to investor panel"
    ],
    requirements: [
      "Early-stage startup with social impact mission",
      "Committed founding team",
      "Scalable business model",
      "Technology-enabled solution preferred"
    ],
    gradient: "from-orange-500 to-red-500",
    color: "orange"
  },
  imentor: {
    id: "imentor",
    title: "iMentor Program",
    subtitle: "Expert Guidance for Social Entrepreneurs",
    description: "Connecting social entrepreneurs with experienced industry experts to provide tailored guidance and support for their ventures through personalized mentorship relationships.",
    fullDescription: "The iMentor Program facilitates meaningful connections between social entrepreneurs and seasoned professionals across various industries. Our carefully curated network of mentors provides personalized guidance to help entrepreneurs navigate challenges and accelerate their impact.",
    duration: "12 months",
    participants: "30+ entrepreneurs per year",
    applicationDeadline: "Quarterly intake",
    status: "Active",
    features: [
      "1-on-1 mentorship with matched industry expert",
      "Monthly goal-setting and progress review sessions",
      "Access to mentor network and peer community",
      "Specialized workshops on business development",
      "Quarterly networking events and masterclasses",
      "Ongoing support and resource sharing"
    ],
    requirements: [
      "Social entrepreneur with established venture",
      "Clear vision and goals for mentorship",
      "Commitment to regular mentorship meetings",
      "Willingness to give back to the community"
    ],
    gradient: "from-red-500 to-pink-500",
    color: "red"
  }
};

export default function ProgramDetail() {
  const [match, params] = useRoute("/programs/:id");
  const programId = params?.id;
  
  if (!programId || !programsData[programId as keyof typeof programsData]) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Program Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The program you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/programs">Back to Programs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const program = programsData[programId as keyof typeof programsData];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${program.gradient} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="outline"
              asChild
              className="mb-6 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Link href="/programs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Programs
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {program.status}
            </Badge>
            <h1 className="text-5xl font-bold mb-4">{program.title}</h1>
            <p className="text-xl mb-6 text-white/90">{program.subtitle}</p>
            <p className="text-lg text-white/80 leading-relaxed">
              {program.fullDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Program Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Duration</h3>
              <p className="text-gray-600 dark:text-gray-400">{program.duration}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Participants</h3>
              <p className="text-gray-600 dark:text-gray-400">{program.participants}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-gsf-primary mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">{program.applicationDeadline}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Program Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Features */}
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Program Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {program.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-400">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="bg-white dark:bg-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {program.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-gsf-primary mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-400">{requirement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className={`bg-gradient-to-br ${program.gradient} text-white`}>
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-xl mb-8 text-white/90">
                Join our {program.title} and take your social impact venture to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/join">
                    Apply Now
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
                    Learn More
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