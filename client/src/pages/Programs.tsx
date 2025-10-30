import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Rocket, Users, Calendar, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FastProgramService } from "@/lib/fastFirestore";
import type { Program } from "@shared/schema";

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fallback programs data for fast loading
  const fallbackPrograms: Program[] = [
    {
      id: 'program1',
      title: 'Tech Innovation Hub',
      description: 'A comprehensive program designed to foster technological innovation among Egyptian youth, providing mentorship, resources, and funding opportunities.',
      overview: 'Join our flagship program that bridges the gap between innovative ideas and market-ready solutions. Through structured mentorship, technical workshops, and funding support, participants develop cutting-edge technology solutions.',
      objectives: ['Foster innovation', 'Develop technical skills', 'Create startup opportunities', 'Build sustainable tech businesses'],
      process: ['Application & Selection', 'Bootcamp Training', 'Mentorship Pairing', 'Project Development', 'Demo Day & Funding'],
      keyAchievements: ['50+ projects launched', '30+ startups formed', '200+ jobs created', '$2M+ in funding raised'],
      status: 'Active' as const,
      duration: '12 months',
      participants: '100 participants annually',
      applicationDeadline: new Date('2024-12-01'),
      isAcceptingApplications: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-01'),
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'program2',
      title: 'Green Future Initiative',
      description: 'Environmental sustainability program empowering young leaders to develop eco-friendly solutions and sustainable business models.',
      overview: 'Drive environmental change through innovative solutions. This program combines environmental science with entrepreneurship to create sustainable businesses that address climate challenges.',
      objectives: ['Environmental awareness', 'Sustainable innovation', 'Green entrepreneurship', 'Climate solution development'],
      process: ['Environmental Assessment', 'Solution Design', 'Business Model Creation', 'Pilot Testing', 'Market Launch'],
      keyAchievements: ['25+ eco projects', '15+ green startups', '100+ environmental advocates', '50% reduction in participant carbon footprint'],
      status: 'Active' as const,
      duration: '9 months',
      participants: '80 participants per cohort',
      applicationDeadline: new Date('2024-11-30'),
      isAcceptingApplications: true,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-05-15'),
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'program3',
      title: 'Digital Skills Academy',
      description: 'Comprehensive digital literacy program preparing youth for the digital economy with hands-on training in emerging technologies.',
      overview: 'Bridge the digital divide by providing comprehensive training in digital skills, from basic computer literacy to advanced programming and digital marketing.',
      objectives: ['Digital literacy enhancement', 'Technical skill development', 'Career readiness', 'Economic empowerment'],
      process: ['Skills Assessment', 'Customized Learning Path', 'Hands-on Projects', 'Industry Mentorship', 'Job Placement Support'],
      keyAchievements: ['500+ graduates', '85% job placement rate', '300+ certification earned', '50+ industry partnerships'],
      status: 'Upcoming' as const,
      duration: '6 months',
      participants: '200 participants per batch',
      applicationDeadline: new Date('2025-01-15'),
      isAcceptingApplications: false,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-06-15'),
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center'
    }
  ];

  const { data: programs = fallbackPrograms, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      try {
        const result = await FastProgramService.getAll();
        // If Firebase returns empty array or fails, keep fallback data
        return result && result.length > 0 ? result : fallbackPrograms;
      } catch (error) {
        console.log('Failed to load programs:', error);
        // Return fallback data on error
        return fallbackPrograms;
      }
    },
    retry: false, // Don't retry to avoid overwriting fallback data
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching that might clear fallback data
  });

  const filteredPrograms = programs.filter((program: any) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || program.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-gsf-green/10 text-gsf-green border-gsf-green/20';
      case 'Upcoming':
        return 'bg-gsf-yellow/10 text-gsf-yellow border-gsf-yellow/20';
      case 'Archived':
        return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
      default:
        return 'bg-gsf-secondary/10 text-gsf-secondary border-gsf-secondary/20';
    }
  };

  // Remove loading screen for instant display with fallback data

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gsf-primary to-gsf-secondary dark:from-slate-900 dark:to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Our Programs
          </h1>
          <p className="text-xl md:text-2xl text-white/90 dark:text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Comprehensive pathways designed to nurture entrepreneurship, foster innovation, and build lasting connections in the Egyptian startup ecosystem.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-gray-50 dark:bg-slate-800 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-700 rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16">
              <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No programs found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search criteria or check back later for new programs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program: any) => (
                <Card
                  key={program.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-3 hover:rotate-1 cursor-pointer border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/15 group-hover:to-purple-500/15 transition-all duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  {program.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={program.imageUrl}
                        alt={program.title}
                        className="w-full h-48 object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 relative z-10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                      {program.isAcceptingApplications && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gsf-red text-white">
                            Accepting Applications
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-2">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {program.description}
                        </p>
                      </div>
                      <Rocket className="h-6 w-6 text-gsf-secondary ml-2 flex-shrink-0" />
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{program.participants}</span>
                      </div>
                      {program.applicationDeadline && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>
                            Deadline: {program.applicationDeadline.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/programs/${program.id}`}>
                          Learn More
                        </Link>
                      </Button>
                      {program.isAcceptingApplications && (
                        <Button size="sm" asChild>
                          <Link href="/join">
                            Apply Now
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
              Program Benefits
            </h2>
            <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
              What You'll Gain
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our programs provide comprehensive support designed to accelerate your entrepreneurial journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gsf-secondary" />
              </div>
              <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-2">
                Expert Mentorship
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get guidance from industry experts and successful entrepreneurs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gsf-green/10 dark:bg-gsf-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-gsf-green" />
              </div>
              <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-2">
                Funding Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Access to funding opportunities and investor networks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gsf-purple/10 dark:bg-gsf-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gsf-purple" />
              </div>
              <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-2">
                Networking
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Build valuable connections with peers and industry leaders
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gsf-yellow/10 dark:bg-gsf-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gsf-yellow" />
              </div>
              <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-2">
                Market Access
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get help entering local and international markets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gsf-primary dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">
            Ready to Join a Program?
          </h2>
          <p className="text-xl text-white/90 dark:text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards transforming your innovative idea into a successful venture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gsf-yellow hover:bg-yellow-400 text-gsf-primary font-semibold"
            >
              <Link href="/join">Apply Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold"
            >
              <Link href="/about">Learn More About GSF</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
