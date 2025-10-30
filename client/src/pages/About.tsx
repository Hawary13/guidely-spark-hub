import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Target, Eye, Lightbulb, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FastEventService } from "@/lib/fastFirestore";
import type { Event } from "@shared/schema";

// Import assets properly
import grapheneLogo from "@/assets/graphene-logo.png";
import edenLogo from "@/assets/eden-logo.png";
import nitrousLogo from "@/assets/Nitrous-logo.png";
import bridgezLogo from "@/assets/bridgez-logo.png";
import imentorLogo from "@/assets/imentor-logo.png";
import blendedModelImage from "@/assets/blended_model.png";
import sdg1Image from "@/assets/SDG1.png";
import sdg2Image from "@/assets/SDG2.png";
import sdg3Image from "@/assets/SDG3.png";
import value1Image from "@/assets/Value1.png";
import value2Image from "@/assets/Value2.png";
import value3Image from "@/assets/Value3.png";
import value4Image from "@/assets/Value4.png";
import value5Image from "@/assets/Value5.png";
import africaMapImage from "@/assets/Africa_map.png";

export default function About() {

  // Load events
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => FastEventService.getAll(),
  });

  // Convert events and handle date conversion
  const processedEvents = (events as any[]).map(event => ({
    ...event,
    date: event.date ? (event.date instanceof Date ? event.date : new Date(event.date)) : new Date(),
    endDate: event.endDate ? (event.endDate instanceof Date ? event.endDate : new Date(event.endDate)) : undefined,
    createdAt: event.createdAt ? (event.createdAt instanceof Date ? event.createdAt : new Date(event.createdAt)) : new Date(),
  })) as Event[];

  const filteredEvents = processedEvents.filter((event) => event.isPublished);
  const upcomingEvents = filteredEvents.filter(event => event.date >= new Date());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop':
        return 'bg-gsf-green/10 text-gsf-green border-gsf-green/20';
      case 'Networking':
        return 'bg-gsf-purple/10 text-gsf-purple border-gsf-purple/20';
      case 'Live Event':
        return 'bg-gsf-red/10 text-gsf-red border-gsf-red/20';
      case 'Conference':
        return 'bg-gsf-secondary/10 text-gsf-secondary border-gsf-secondary/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-blue-600 dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
            About Giza Systems Foundation
          </h1>
          <p className="text-xl md:text-2xl text-white/90 dark:text-blue-100 max-w-4xl mx-auto leading-relaxed">
            For Those Committed to transforming systems, elevating communities, and driving solutions that shape resilient, future-ready societies.
          </p>
        </div>
      </section>

      {/* System Aggregators Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
                  About GSF
                </h2>
                <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
                  Giza Systems Foundation – Driving Sustainable Impact Since 2013
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Giza Systems Foundation was founded in 2013 as the CSR arm of Giza Systems.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  GSF is a nonprofit organization committed to empowering marginalized communities through education, technology, and entrepreneurship.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  By acting as a system aggregator, we connect startups, NGOs, investors, and industry experts to create scalable solutions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <Target className="h-8 w-8 text-gsf-primary dark:text-gsf-secondary mb-3" />
                  <h4 className="font-semibold text-gsf-primary dark:text-gsf-secondary mb-2">Our Mission</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Empower Egyptian youth through innovative programs and strategic partnerships.
                  </p>
                </Card>
                <Card className="p-6">
                  <Eye className="h-8 w-8 text-gsf-primary dark:text-gsf-secondary mb-3" />
                  <h4 className="font-semibold text-gsf-primary dark:text-gsf-secondary mb-2">Our Vision</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A thriving ecosystem of young Egyptian innovators and entrepreneurs.
                  </p>
                </Card>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="GSF team collaboration"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
              <div className="absolute -top-6 -right-6 bg-gsf-secondary text-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Growing Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Aspiration Section */}
      <section className="py-20 bg-white dark:bg-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
              Our Aspiration
            </h2>
            <p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
              A system-aggregator and enabler of impact-driven entrepreneurship across Africa and the Middle East—connecting communities, technology, and capital to drive sustainable impact.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/programs">Know More About Our Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Redefining Impact Delivery Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-900 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Redefining Impact Delivery
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
              At GSF, we don't believe in one-size-fits-all solutions.
            </p>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto">
              We deliver impact through a dual approach:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Philanthropic Projects Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl flex flex-col h-full">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-8">
                  <div className="bg-blue-400 text-white py-4 px-8 rounded-full inline-block mb-6">
                    <h3 className="text-2xl font-bold">Philanthropic Projects</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    Immediate, on-ground support that addresses urgent community needs
                  </p>
                </div>
                
                {/* Logos Row */}
                <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
                  <div className="w-28 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-3">
                    <img 
                      src={grapheneLogo} 
                      alt="Graphene Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-28 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-3">
                    <img 
                      src={edenLogo} 
                      alt="Eden Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-28 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-3">
                    <img 
                      src={nitrousLogo} 
                      alt="Nitrous Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entrepreneurship Programs Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl flex flex-col h-full">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-8">
                  <div className="bg-blue-400 text-white py-4 px-8 rounded-full inline-block mb-6">
                    <h3 className="text-2xl font-bold">Entrepreneurship Programs</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    long-term programs, such as acceleration and mentorship, that build sustainable solutions for the future.
                  </p>
                </div>
                
                {/* Logos Row */}
                <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
                  <div className="w-28 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-3">
                    <img 
                      src={bridgezLogo} 
                      alt="BRIDGEZ Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-28 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-3">
                    <img 
                      src={imentorLogo} 
                      alt="iMentor Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blended Model Section */}
      <section className="py-20 bg-white dark:bg-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-8 leading-tight">
              This blended model allows us to respond today while shaping a more resilient tomorrow.
            </h2>
            <div className="max-w-4xl mb-12">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                By aggregating efforts and resources, we aspire to amplify our influence and create a collaborative ecosystem where startups not only thrive individually but also contribute synergistically to societal development.
              </p>
            </div>
          </div>
          
          {/* Blended Model Image */}
          <div className="flex justify-center">
            <div className="max-w-3xl w-full">
              <img 
                src={blendedModelImage} 
                alt="Blended Model Diagram" 
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Turning Global Goals into Local Impact Section */}
      <section className="py-14 bg-gray-50 dark:bg-slate-700 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-8 leading-tight">
                Turning Global Goals into Local Impact
              </h2>
              <div className="max-w-3xl">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our initiatives are rooted in the SDGs framework that tackles today's most pressing challenges. By adopting specific Sustainable Development Goals, we ensure our programs deliver measurable impact where it matters most.
                </p>
              </div>
            </div>

            {/* Right side - SDG Images */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex flex-wrap gap-6 justify-center lg:justify-end items-center">
                <div className="w-40 h-40 flex-shrink-0">
                  <img 
                    src={sdg1Image} 
                    alt="SDG 10 - Reduced Inequalities" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-40 h-40 flex-shrink-0">
                  <img 
                    src={sdg2Image} 
                    alt="SDG 12 - Responsible Consumption and Production" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-40 h-40 flex-shrink-0">
                  <img 
                    src={sdg3Image} 
                    alt="SDG 17 - Partnerships for the Goals" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Guiding Values Section */}
      <section className="py-20 bg-white dark:bg-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-8 leading-tight">
              Our Guiding Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={value1Image} 
                  alt="Value 1" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Builds Trust & Appreciates Differences
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={value2Image} 
                  alt="Value 2" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Connects the Dots for Future Opportunities
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={value3Image} 
                  alt="Value 3" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Curious with Evident Passion for Learning
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={value4Image} 
                  alt="Value 4" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Reliable, Accountable and Goes the Extra Mile
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={value5Image} 
                  alt="Value 5" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Resilient & Change Advocate
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Areas We Serve Section */}
      <section className="py-10 bg-gray-50 dark:bg-slate-700 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
            {/* Map full-width with vertical padding so it doesn't touch the header */}
            <img src={africaMapImage} alt="Africa Map" className="absolute left-0 right-0 bottom-2 top-10 md:top-14 w-full h-full object-contain" />

            {/* Header left */}
            <div className="absolute top-0 left-0">
              <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white leading-tight">Areas We Serve</h2>
            </div>

            {/* Pins */}
            <div className="absolute top-[30%] left-[49%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <span className="absolute inset-0 rounded-full border-2 border-red-500/60 animate-ring-pulse"></span>
                <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ring-pulse [animation-delay:.6s]"></span>
                <div className="relative w-5 h-5 bg-red-600 rounded-full shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="absolute top-[58%] left-[53%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <span className="absolute inset-0 rounded-full border-2 border-red-500/60 animate-ring-pulse"></span>
                <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ring-pulse [animation-delay:.6s]"></span>
                <div className="relative w-5 h-5 bg-red-600 rounded-full shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
          </div>

            {/* Right overlay cards */}
            <div className="absolute right-0 top-10 w-72 space-y-4">
              <Card className="backdrop-blur-lg bg-white/95 dark:bg-slate-800/95 border border-white/30 shadow-2xl">
                <CardContent className="p-6">
                  <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-3 flex items-center">
                    <span className="w-3.5 h-3.5 bg-red-600 rounded-full mr-3"></span>
                    Egypt
                </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Reaching 15 governorates and remote areas.</p>
              </CardContent>
            </Card>

              <Card className="backdrop-blur-lg bg-white/95 dark:bg-slate-800/95 border border-white/30 shadow-2xl">
                <CardContent className="p-6">
                  <h4 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-3 flex items-center">
                    <span className="w-3.5 h-3.5 bg-red-600 rounded-full mr-3"></span>
                    Kenya
                </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">placeholder</p>
              </CardContent>
            </Card>
                </div>
          </div>
        </div>
      </section>

      {/* Keep Connected To Our Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
              Keep Connected To Our Events
            </h2>
            <p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
              Register for our upcoming events and be part of Egypt's thriving innovation community.
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {event.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                  </div>
                  </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {event.description}
                        </p>
                  </div>
                      <Calendar className="h-6 w-6 text-gsf-secondary ml-2 flex-shrink-0" />
                  </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                  </div>
                      )}
              </div>
              
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gsf-green">
                        {event.date > new Date() ? 'Upcoming' : 'Past Event'}
                      </span>
                      {event.registrationUrl ? (
                        <Button size="sm" asChild>
                          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                            Register <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      )}
                  </div>
                  </CardContent>
                </Card>
              ))}
                  </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Check back soon for new events and opportunities to join our community.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gsf-primary dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">
            Ready to Be Part of Our Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in building the future of Egyptian entrepreneurship and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gsf-yellow hover:bg-yellow-400 text-gsf-primary font-semibold"
            >
              <Link href="/join">Get Involved</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold"
            >
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
