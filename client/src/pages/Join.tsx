import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCheck, Handshake, GraduationCap, Heart, Send, CheckCircle } from "lucide-react";
import { useFirestoreMutation } from "@/hooks/useFirestore";
import { FormSubmissionService } from "@/lib/firestore";
import type { InsertFormSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  type: z.enum(['application', 'mentor', 'partner', 'volunteer']),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  organization: z.string().optional(),
  experience: z.string().min(10, "Please provide more details about your experience"),
  motivation: z.string().min(10, "Please explain your motivation"),
  availability: z.string().optional(),
  skills: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function Join() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      type: "application",
      name: "",
      email: "",
      phone: "",
      organization: "",
      experience: "",
      motivation: "",
      availability: "",
      skills: "",
      linkedinUrl: "",
    },
  });

  const submitMutation = useFirestoreMutation<string, InsertFormSubmission>(
    FormSubmissionService.create,
    {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "Thank you for your interest. We'll be in touch soon.",
        });
      },
      onError: (error) => {
        toast({
          title: "Submission Failed",
          description: "Please try again or contact us directly.",
          variant: "destructive",
        });
        console.error("Form submission error:", error);
      },
    }
  );

  const onSubmit = (data: ApplicationForm) => {
    const submissionData: InsertFormSubmission = {
      id: Date.now().toString(),
      type: data.type,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        experience: data.experience,
        motivation: data.motivation,
        availability: data.availability,
        skills: data.skills,
        linkedinUrl: data.linkedinUrl,
      },
      status: "new",
    };

    submitMutation.mutate(submissionData);
  };

  const joinOptions = [
    {
      id: "application",
      title: "Participants",
      description: "Join our programs and transform your innovative ideas into successful ventures.",
      icon: GraduationCap,
      color: "gsf-yellow",
      features: [
        "Access to all GSF programs",
        "Mentorship from industry experts",
        "Funding opportunities",
        "Networking with peers",
        "Skills development workshops"
      ]
    },
    {
      id: "mentor",
      title: "Mentors",
      description: "Share your expertise and guide the next generation of Egyptian entrepreneurs.",
      icon: UserCheck,
      color: "gsf-green",
      features: [
        "Flexible mentoring schedule",
        "Impact measurement tools",
        "Mentor community access",
        "Professional development",
        "Recognition and awards"
      ]
    },
    {
      id: "partner",
      title: "Partners",
      description: "Collaborate with us to create meaningful impact in the Egyptian startup ecosystem.",
      icon: Handshake,
      color: "gsf-purple",
      features: [
        "Strategic partnership opportunities",
        "Brand visibility and recognition",
        "Access to innovation pipeline",
        "Corporate social responsibility",
        "Talent acquisition opportunities"
      ]
    },
    {
      id: "volunteer",
      title: "Volunteers",
      description: "Contribute your time and skills to support our mission and community programs.",
      icon: Heart,
      color: "gsf-teal",
      features: [
        "Flexible volunteer opportunities",
        "Skills-based volunteering",
        "Community service hours",
        "Professional networking",
        "Make a real difference"
      ]
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <section className="py-20 bg-gradient-to-br from-gsf-primary to-gsf-secondary dark:from-slate-900 dark:to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <CheckCircle className="h-24 w-24 text-gsf-yellow mx-auto mb-8" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                Thank You!
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Your application has been submitted successfully. We'll review it and get back to you within 48 hours.
              </p>
              <Button
                size="lg"
                className="bg-gsf-yellow hover:bg-yellow-400 text-gsf-primary font-semibold"
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                  setSelectedType("");
                }}
              >
                Submit Another Application
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 bg-blue-600 dark:bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
            Join Our Community
          </h1>
          <p className="text-xl md:text-2xl text-white/90 dark:text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Whether you're an aspiring entrepreneur, experienced mentor, strategic partner, or passionate volunteer, there's a place for you in the GSF community.
          </p>
        </div>
      </section>

      {/* Join Options */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {joinOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedType === option.id;
              
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    isSelected ? "ring-2 ring-gsf-secondary shadow-xl scale-105" : ""
                  }`}
                  onClick={() => {
                    setSelectedType(option.id);
                    form.setValue("type", option.id as any);
                  }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-${option.color}/10 dark:bg-${option.color}/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`h-8 w-8 text-${option.color}`} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-4">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {option.description}
                    </p>
                    <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-gsf-green mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      {selectedType && (
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-gsf-primary dark:text-white mb-4">
                Apply to Join as {joinOptions.find(o => o.id === selectedType)?.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you within 48 hours.
              </p>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gsf-primary dark:text-white">
                  Application Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+20 XXX XXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization/Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Your current organization" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relevant Experience *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your relevant experience, background, and expertise..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why do you want to join GSF? *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your motivation and what you hope to achieve..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(selectedType === "mentor" || selectedType === "volunteer") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="When are you available? How much time can you commit?"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key Skills</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What skills and expertise can you offer?"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="text-center">
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gsf-secondary hover:bg-gsf-primary text-white font-semibold px-12"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit Application <Send className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gsf-primary dark:text-white mb-4">
              Have Questions?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get in touch with our team for more information about joining GSF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-gsf-secondary/10 dark:bg-gsf-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gsf-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Send us your questions and we'll respond within 24 hours.
              </p>
              <a href="mailto:info@gsf.org.eg" className="text-gsf-secondary hover:underline">
                info@gsf.org.eg
              </a>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-gsf-green/10 dark:bg-gsf-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-gsf-green" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-2">
                Join Our Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Follow us on social media for updates and community insights.
              </p>
              <Button variant="outline" size="sm">
                Follow Us
              </Button>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-gsf-purple/10 dark:bg-gsf-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-gsf-purple" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gsf-primary dark:text-white mb-2">
                Schedule a Call
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Book a consultation to discuss partnership opportunities.
              </p>
              <Button variant="outline" size="sm">
                Book Meeting
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
