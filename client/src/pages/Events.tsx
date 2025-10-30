import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FastEventService } from "@/lib/fastFirestore";
import type { Event } from "@shared/schema";
import { Link } from "wouter";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => FastEventService.getAll(),
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    return matchesSearch && matchesType && event.isPublished;
  });

  const upcomingEvents = filteredEvents.filter(event => event.date >= new Date());
  const pastEvents = filteredEvents.filter(event => event.date < new Date());

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gsf-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gsf-primary to-gsf-secondary dark:from-slate-900 dark:to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Events & Media
          </h1>
          <p className="text-xl md:text-2xl text-white/90 dark:text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join our community events, workshops, and networking sessions. Stay updated with the latest news and opportunities in the Egyptian startup ecosystem.
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="Workshop">Workshops</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Live Event">Live Events</SelectItem>
                  <SelectItem value="Conference">Conferences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
                Upcoming Events
              </h2>
              <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
                Don't Miss Out
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Register for our upcoming events and be part of Egypt's thriving innovation community.
              </p>
            </div>

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
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
                Past Events
              </h2>
              <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
                Event Highlights
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our previous events and see the impact we've made together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.slice(0, 6).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {event.imageUrl && (
                    <div className="relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90 text-gray-600">
                          Past Event
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-gsf-primary dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Types Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
              Event Types
            </h2>
            <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
              What We Offer
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From hands-on workshops to networking events, we provide diverse opportunities for learning and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gsf-green/10 dark:bg-gsf-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gsf-green" />
              </div>
              <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                Workshops
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Hands-on learning sessions covering essential entrepreneurship and business skills.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gsf-purple/10 dark:bg-gsf-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gsf-purple" />
              </div>
              <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                Networking
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with fellow entrepreneurs, mentors, and industry experts in casual settings.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gsf-red/10 dark:bg-gsf-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-gsf-red" />
              </div>
              <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                Live Events
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive sessions including pitch nights, demo days, and startup showcases.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gsf-secondary" />
              </div>
              <h4 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                Conferences
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Large-scale events bringing together thought leaders and innovation experts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gsf-primary dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">
            Stay In The Loop
          </h2>
          <p className="text-xl text-white/90 dark:text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get notified about upcoming events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
            <Button
              size="lg"
              className="bg-gsf-yellow hover:bg-yellow-400 text-gsf-primary font-semibold"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
