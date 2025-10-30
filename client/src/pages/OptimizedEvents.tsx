import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import hanyPhoto from "@/assets/1643569879258.jpg";
import mohammedPhoto from "@/assets/1723498981053.jpg";

export default function OptimizedEvents() {
  type LocalEvent = {
    id: string;
    title: string;
    description: string;
    date: Date;
    time?: string;
    type?: string;
    location?: string;
    venue?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    createdAt?: Date;
    imageUrl?: string;
    speaker?: string;
  };

  const events: LocalEvent[] = [
    {
      id: 'dev-across-borders',
      title: 'Development Across Borders',
      description: 'The different mindsets between international and local real estate development.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: '06:00 PM',
      type: 'Talk',
      location: 'Cairo',
      venue: 'TBA',
      isPublished: true,
      isFeatured: true,
      createdAt: new Date(),
      imageUrl: hanyPhoto,
      speaker: 'Hany Abdel Monem — Chief Development Officer at Ora Developers',
    },
    {
      id: 'market-research',
      title: 'Market Research: How to read market research and how to look for market gaps',
      description: 'A practical session on interpreting market research and identifying market gaps.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      time: '06:00 PM',
      type: 'Workshop',
      location: 'Cairo',
      venue: 'TBA',
      isPublished: true,
      isFeatured: true,
      createdAt: new Date(),
      imageUrl: mohammedPhoto,
      speaker: 'Mohammed Yehia — Head of Market Research & Insights',
    },
  ];

  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'Workshop':
        return 'bg-gsf-green/10 text-gsf-green border-gsf-green/20';
      case 'Talk':
        return 'bg-gsf-secondary/10 text-gsf-secondary border-gsf-secondary/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const EventCard = ({ event, featured = false }: { event: LocalEvent; featured?: boolean }) => (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${featured ? 'border-gsf-yellow' : ''}`}>
      {event.imageUrl && (
        <div className="relative overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'h-64' : 'h-48'}`}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {event.type && (
              <Badge className={getTypeColor(event.type)}>
                {event.type}
              </Badge>
            )}
            {event.isFeatured && (
              <Badge className="bg-gsf-yellow text-gsf-primary">
                Featured
              </Badge>
            )}
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
            <span>
              {event.date.toLocaleDateString()}
              {event.time && ` at ${event.time}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.venue || event.location}</span>
            </div>
          )}
          {event.speaker && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              <span>Speaker: {event.speaker}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${event.date > new Date() ? 'text-gsf-green' : 'text-gray-500'}`}>
              {event.date > new Date() ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
          <Button size="sm" variant="outline" asChild>
            <a href="/join">
              Register <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 bg-blue-600 dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
            Events
          </h1>
          <p className="text-xl md:text-2xl text-white/90 dark:text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join our focused sessions with top developers and experts.
          </p>
        </div>
      </section>

      {/* Main Events Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} featured={true} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}