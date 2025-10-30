import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink, 
  Share2, Heart, Bookmark, Image as ImageIcon, User,
  CheckCircle, Star, Award, Target
} from "lucide-react";
import { FastEventService } from "@/lib/fastFirestore";
import type { Event } from "@shared/schema";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => FastEventService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gsf-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = event.date >= new Date();
  const isPastEvent = event.date < new Date();

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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/events">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {event.imageUrl && (
          <div className="h-96 md:h-[500px] relative overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Event Status Badge */}
            <div className="absolute top-6 left-6">
              <Badge className={getTypeColor(event.type)}>
                {event.type}
              </Badge>
            </div>
            
            {/* Featured Badge */}
            {event.isFeatured && (
              <div className="absolute top-6 right-6">
                <Badge className="bg-gsf-yellow text-gsf-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Event Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date.toLocaleDateString()}</span>
                    {event.time && <span className="ml-1">at {event.time}</span>}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gsf-primary dark:text-white mb-6">
                  About This Event
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {event.description}
                </p>
                {event.fullDescription && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.fullDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Gallery */}
            {event.mediaImages && event.mediaImages.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gsf-primary dark:text-white mb-6 flex items-center">
                    <ImageIcon className="h-6 w-6 mr-2" />
                    Event Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.mediaImages.map((image, index) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `Event image ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <p className="text-white text-xs">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gsf-primary dark:text-white mb-6 flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    Speakers & Presenters
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={speaker.imageUrl} alt={speaker.name} />
                          <AvatarFallback>{speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gsf-primary dark:text-white">
                            {speaker.name}
                          </h3>
                          <p className="text-sm text-gsf-secondary">{speaker.title}</p>
                          {speaker.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              {speaker.bio}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            {speaker.linkedinUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                  LinkedIn
                                </a>
                              </Button>
                            )}
                            {speaker.twitterUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={speaker.twitterUrl} target="_blank" rel="noopener noreferrer">
                                  Twitter
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gsf-primary dark:text-white mb-6 flex items-center">
                    <Clock className="h-6 w-6 mr-2" />
                    Event Agenda
                  </h2>
                  <div className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="font-mono">
                            {item.time}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gsf-primary dark:text-white">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.speaker && (
                            <p className="text-sm text-gsf-secondary mt-2">
                              Speaker: {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {event.benefits && event.benefits.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gsf-primary dark:text-white mb-6 flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    What You'll Gain
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-gsf-green mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 dark:text-gray-300">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    {isUpcoming ? (
                      <Badge className="bg-gsf-green text-white">
                        <Calendar className="h-4 w-4 mr-1" />
                        Upcoming Event
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Past Event
                      </Badge>
                    )}
                  </div>
                  
                  {event.price && (
                    <div className="text-3xl font-bold text-gsf-primary dark:text-white mb-2">
                      {event.price}
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gsf-secondary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {event.time && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {event.time}
                          {event.endTime && ` - ${event.endTime}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gsf-secondary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.venue || event.location}
                        </p>
                        {event.address && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {event.address}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {event.capacity && (
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gsf-secondary" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Limited to {event.capacity} participants
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isUpcoming && event.applicationEnabled && (
                    <Button size="lg" className="w-full">
                      Apply to Attend
                    </Button>
                  )}
                  
                  {event.registrationUrl && (
                    <Button 
                      variant={event.applicationEnabled ? "outline" : "default"} 
                      size="lg" 
                      className="w-full" 
                      asChild
                    >
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                        Register Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}

                  {event.mapUrl && (
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                        View Location
                        <MapPin className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>

                {/* Application Deadline */}
                {event.applicationDeadline && isUpcoming && (
                  <div className="mt-4 p-3 bg-gsf-yellow/10 border border-gsf-yellow/20 rounded-lg">
                    <p className="text-sm text-gsf-primary">
                      <strong>Application Deadline:</strong><br />
                      {event.applicationDeadline.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gsf-primary dark:text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Requirements
                  </h3>
                  <div className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gsf-secondary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gsf-primary dark:text-white mb-4">
                    Event Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Event Gallery</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="w-full">
              <img
                src={selectedImage}
                alt="Event image"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}