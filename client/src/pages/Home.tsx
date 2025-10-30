import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticlesHero } from "@/components/ui/ParticlesHero";
import { AnimatedCards } from "@/components/ui/animated-cards";

import { PhilanthropicCarousel } from "@/components/ui/philanthropic-carousel";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useParallax, useParallaxBackground, useScrollReveal } from "@/hooks/useParallax";
import { ChartLine, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
// Removed firestore/fast services for local hardcoded content
// import { useFirestoreData } from "@/hooks/useFirestore";
// import { StatisticsService, ProgramService, SuccessStoryService, NewsService } from "@/lib/firestore";
// import { useQuery } from "@tanstack/react-query";
// import { FastEventService } from "@/lib/fastFirestore";

import partnersService from "@/lib/partnersService";
import bueLogo from "@/assets/WhatsApp Image 2025-08-25 at 11.38.04 PM.jpeg";
import blablaLogo from "@/assets/BlaBla Logo Black.png";
import grapheneLogo from "@/assets/graphene-logo.png";
import edenLogo from "@/assets/eden-logo.png";
import nitrousLogo from "@/assets/Nitrous-logo.png";
// Hardcoded types for local run
type Partner = { id: string; name: string; logoUrl: string; websiteUrl?: string };
type Event = {
	id: string;
	title: string;
	description: string;
	imageUrl?: string;
	location?: string;
	registrationUrl?: string;
	date: Date;
	endDate?: Date;
	createdAt?: Date;
	isPublished: boolean;
	type: string;
};

type SuccessStory = {
	personName: string;
	personTitle: string;
	companyName: string;
	imageUrl?: string;
	revenue?: string;
	quote: string;
	achievements: string[];
};

import { TeamSlider, type TeamMember } from "@/components/ui/team-slider";

export default function Home() {
	// Intersection observer for statistics section
	const { elementRef: statsRef, isIntersecting: statsVisible } = useIntersectionObserver({
		threshold: 0.3,
		rootMargin: '0px 0px -10% 0px'
	});

	// Parallax effects
	const backgroundY = useParallaxBackground({ speed: 0.3 });
	const { elementRef: heroRef, offset: heroOffset } = useParallax({ speed: 0.2, direction: 'up' });
	const { elementRef: aspirationRef, offset: aspirationOffset } = useParallax({ speed: 0.15, direction: 'down' });
	const { elementRef: fundingRef, offset: fundingOffset } = useParallax({ speed: 0.25, direction: 'up' });
	
	// Custom scroll-based animation for funding title
	const [fundingTitleOffset, setFundingTitleOffset] = useState(-300); // Start from left (-300px)
	const fundingTitleRef = useRef<HTMLDivElement>(null);
	
	// Custom scroll effect for funding title
	useEffect(() => {
		const handleFundingTitleScroll = () => {
			if (!fundingTitleRef.current) return;
			
			const scrollY = window.scrollY;
			const element = fundingTitleRef.current;
			const elementTop = element.offsetTop;
			const elementHeight = element.offsetHeight;
			const windowHeight = window.innerHeight;
			
			// Calculate when the section enters and exits the viewport
			const sectionStart = elementTop - windowHeight;
			const sectionEnd = elementTop + elementHeight;
			
			// Calculate progress (0 to 1) as section moves through viewport
			const progress = Math.max(0, Math.min(1, (scrollY - sectionStart) / (sectionEnd - sectionStart)));
			
			// Animate from left (-300px) to center (0px) based on progress
			const newOffset = -300 + (300 * progress);
			setFundingTitleOffset(newOffset);
		};

		handleFundingTitleScroll(); // Calculate initial position
		window.addEventListener('scroll', handleFundingTitleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleFundingTitleScroll);
	}, []);
	
	// Scroll reveal effects
	const { elementRef: aspirationRevealRef, isVisible: aspirationVisible } = useScrollReveal(0.2);
	const { elementRef: fundingRevealRef, isVisible: fundingVisible } = useScrollReveal(0.2);
	const { elementRef: frameworkRevealRef, isVisible: frameworkVisible } = useScrollReveal(0.2);

	// Hardcoded success stories (disabled for mentoring site)
	const successStories: SuccessStory[] = [];
	
	// Hardcoded partners (updated to two partners only)
	const partners: Partner[] = [
		{ id: 'bue', name: 'The British University in Egypt', logoUrl: bueLogo, websiteUrl: 'https://www.bue.edu.eg/' },
		{ id: 'blabla', name: 'Bla Bla Studio', logoUrl: blablaLogo, websiteUrl: 'https://www.blabla-studio.com/' },
	];

	// Hardcoded events
	const now = new Date();
	const events: Event[] = [
		{
			id: 'e1',
			title: 'Development Across Borders',
			description: 'International vs local development mindsets: frameworks, constraints, and execution differences for real estate projects.',
			imageUrl: undefined,
			location: 'Cairo, In-person',
			registrationUrl: '#',
			date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 18, 30),
			createdAt: now,
			isPublished: true,
			type: 'Workshop'
		},
		{
			id: 'e2',
			title: 'Market Research: Finding the Gap',
			description: 'How to read market research and translate it into actionable insights to identify market gaps.',
			imageUrl: undefined,
			location: 'Cairo, In-person',
			registrationUrl: '#',
			date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 18, 30),
			createdAt: now,
			isPublished: true,
			type: 'Workshop'
		}
	];

	// Convert and filter events
	const processedEvents = events.map(event => ({
		...event,
		date: event.date instanceof Date ? event.date : new Date(event.date),
		endDate: event.endDate ? (event.endDate instanceof Date ? event.endDate : new Date(event.endDate)) : undefined,
		createdAt: event.createdAt ? (event.createdAt instanceof Date ? event.createdAt : new Date(event.createdAt)) : new Date(),
	})) as Event[];

	const filteredEvents = processedEvents.filter((event) => event.isPublished);
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

	const featuredStory = successStories[0];

	return (
		<div className="min-h-screen relative overflow-x-hidden">
			{/* Parallax Background Elements */}
			<div 
				className="fixed inset-0 z-0 opacity-5 pointer-events-none"
				style={{
					transform: `translateY(${backgroundY}px)`,
					background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
				}}
			/>
			
			{/* Interactive Particles Hero Section */}
			<div 
				ref={heroRef as React.RefObject<HTMLDivElement>}
				className="relative z-10"
				style={{ transform: `translateY(${heroOffset}px)` }}
			>
								<ParticlesHero
						title="Nexus Community for Real Estate Mentorship"
						subtitle="A premier community and event in Cairo where young real estate professionals connect directly with top developers and experts through workshops and mentorship."
						primaryButtonText="Request to Join"
						secondaryButtonText="See Upcoming Sessions"
						onPrimaryClick={() => window.location.href = '/join'}
						onSecondaryClick={() => window.location.href = '/events'}
					/>
			</div>

			{/* Our Aspiration */}
			<section 
				ref={aspirationRevealRef as React.RefObject<HTMLElement>}
				className="py-20 bg-white dark:bg-slate-800 relative z-20"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div 
						ref={aspirationRef as React.RefObject<HTMLDivElement>}
						className={`max-w-4xl transition-all duration-1000 ease-out ${
							aspirationVisible 
								? 'opacity-100 translate-y-0' 
								: 'opacity-0 translate-y-10'
						}`}
						style={{ transform: `translateY(${aspirationOffset}px)` }}
					>
						<h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
							Why Nexus Community
						</h2>
						<p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
							We bring aspiring young real estate professionals together with leading developers, operators, and analysts to accelerate careers through practical mentorship, real case workshops, and direct exposure to decision-makers.
						</p>
					</div>
					<div className={`flex justify-center transition-all duration-1000 delay-300 ease-out ${
						aspirationVisible 
							? 'opacity-100 translate-y-0' 
							: 'opacity-0 translate-y-10'
					}`}> 
						<Button 
							asChild 
							size="lg" 
							className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
						>
							<Link href="/about">Know More About Us</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Team Members Slider */}
			<section className="py-12 bg-white dark:bg-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{(() => {
						const team: TeamMember[] = [
							{ name: 'Ahmad Shatta', title: 'Founder' },
							{ name: 'Moaz Abd Allah', title: 'Member' },
							{ name: 'Mahmoud Tamer', title: 'Member' },
							{ name: 'Bassel Ashour', title: 'Member' },
							{ name: 'Youssef el Sagh', title: 'Member' },
						];
						return (
							<TeamSlider
								members={team}
								title="Core Team"
								subtitle="The people behind Nexus Community"
							/>
						);
					})()}
				</div>
			</section>

			{/* Outcome-Based Funding Section */}
			<section 
				ref={fundingRevealRef as React.RefObject<HTMLElement>}
				className="py-20 bg-slate-900 dark:bg-slate-900 relative z-20 overflow-hidden"
			>
				{/* Parallax background decorations */}
				<div 
					className="absolute inset-0 opacity-10"
					style={{
						transform: `translateY(${fundingOffset * 0.5}px)`,
						background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
					}}
				/>
				
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
					<div 
						ref={fundingTitleRef}
						className="max-w-4xl mb-16 relative z-40"
					>
						<h2 
							className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight transition-all duration-300 ease-out relative z-50"
							style={{ 
								transform: `translateX(${fundingTitleOffset}px)`,
								opacity: fundingTitleOffset > -200 ? 1 : 0.5
							}}
						>
							What You’ll Gain
						</h2>
						<p 
							className={`text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl transition-all duration-1000 delay-300 ease-out relative z-40 ${
								fundingVisible 
									? 'opacity-100 translate-y-0' 
									: 'opacity-0 translate-y-10'
							}`}
						>
							At GSF, we're pioneering a new way to drive change — our <strong>outcome-based funding</strong> methodology holds impact, not effort, as the measure of success.
						</p>
					</div>

					{/* Three Information Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-20">
						<Card className={`backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl relative z-20 ${
							fundingVisible 
								? 'opacity-100 translate-y-0' 
								: 'opacity-0 translate-y-10'
						}`} 
						style={{ transitionDelay: '200ms' }}>
							<CardContent className="p-8">
								<div className="text-4xl font-bold mb-4 text-white">1</div>
								<h3 className="text-2xl font-bold text-white mb-4">Direct Access</h3>
								<p className="text-white/90 text-lg leading-relaxed">
									Learn directly from top-tier developers and experts in Cairo.
								</p>
							</CardContent>
						</Card>
						
						<Card className={`backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl relative z-20 ${
							fundingVisible 
								? 'opacity-100 translate-y-0' 
								: 'opacity-0 translate-y-10'
						}`}
						style={{ transitionDelay: '400ms' }}>
							<CardContent className="p-8">
								<div className="text-4xl font-bold mb-4 text-white">2</div>
								<h3 className="text-2xl font-bold text-white mb-4">Focused Mentorship</h3>
								<p className="text-white/90 text-lg leading-relaxed">
									Small-group mentorship and hands-on workshops tailored to real estate.
								</p>
							</CardContent>
						</Card>
						
						<Card className={`backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl relative z-20 ${
							fundingVisible 
								? 'opacity-100 translate-y-0' 
								: 'opacity-0 translate-y-10'
						}`}
						style={{ transitionDelay: '600ms' }}>
							<CardContent className="p-8">
								<div className="text-4xl font-bold mb-4 text-white">3</div>
								<h3 className="text-2xl font-bold text-white mb-4">Career Acceleration</h3>
								<p className="text-white/90 text-lg leading-relaxed">
									Build skills, networks, and visibility to move faster in your career.
								</p>
							</CardContent>
						</Card>
					</div>

					{/* CTA Button */}
					<div className={`flex justify-center transition-all duration-1000 delay-700 ease-out relative z-30 ${
						fundingVisible 
							? 'opacity-100 translate-y-0' 
							: 'opacity-0 translate-y-10'
						}`}>
						<Button 
							asChild 
							size="lg" 
							className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
						>
							<Link href="/programs">Explore How It Works</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Portfolio of Impact */}
			<section ref={statsRef} className="py-20 bg-white dark:bg-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mb-16">
						<h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
							Community Snapshot
						</h2>
						<p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
							Key metrics from our real‑estate mentoring community in Cairo.
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-gsf-primary/20 dark:hover:shadow-gsf-secondary/20 transition-all duration-500 transform hover:-translate-y-2">
							<div className="text-3xl md:text-4xl lg:text-5xl font-black text-gsf-primary dark:text-gsf-secondary mb-3 drop-shadow-lg">
								<AnimatedCounter end={25} delay={500} duration={2000} trigger={statsVisible} />
							</div>
							<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Mentored Participants</div>
						</div>
						<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-gsf-green/20 transition-all duration-500 transform hover:-translate-y-2">
							<div className="text-3xl md:text-4xl lg:text-5xl font-black text-gsf-green mb-3 drop-shadow-lg">
								<AnimatedCounter end={1700} delay={600} duration={2000} trigger={statsVisible} />+
							</div>
							<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Community Members Reached</div>
						</div>
						<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-gsf-purple/20 transition-all duration-500 transform hover:-translate-y-2">
							<div className="text-3xl md:text-4xl lg:text-5xl font-black text-gsf-purple mb-3 drop-shadow-lg">
								<AnimatedCounter end={3000} delay={700} duration={2000} trigger={statsVisible} />+
							</div>
							<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Workshop Hours Delivered</div>
						</div>
						<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-gsf-yellow/20 transition-all duration-500 transform hover:-translate-y-2">
							<div className="text-3xl md:text-4xl lg:text-5xl font-black text-gsf-yellow mb-3 drop-shadow-lg">
								<AnimatedCounter end={45} delay={800} duration={2000} trigger={statsVisible} />
							</div>
							<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Developers & Experts Engaged</div>
						</div>
					</div>

					{/* Centered last three cards */}
					<div className="flex justify-center mt-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
							<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 transform hover:-translate-y-2">
								<div className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-400 mb-3 drop-shadow-lg">
									<AnimatedCounter end={65} delay={900} duration={2000} trigger={statsVisible} />+
								</div>
								<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Mentorship hours</div>
							</div>
							<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-indigo-400/20 transition-all duration-500 transform hover:-translate-y-2">
								<div className="text-3xl md:text-4xl lg:text-5xl font-black text-indigo-400 mb-3 drop-shadow-lg">
									<AnimatedCounter end={4} delay={1000} duration={2000} trigger={statsVisible} />
								</div>
								<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">International Partners</div>
							</div>
							<div className="text-center p-8 rounded-2xl hover:shadow-2xl hover:shadow-teal-400/20 transition-all duration-500 transform hover:-translate-y-2">
								<div className="text-3xl md:text-4xl lg:text-5xl font-black text-teal-400 mb-3 drop-shadow-lg">
									<AnimatedCounter end={18} delay={1100} duration={2000} trigger={statsVisible} />
								</div>
								<div className="text-gray-800 dark:text-white/90 font-semibold text-base md:text-lg drop-shadow-sm">Local Partners</div>
							</div>
						</div>
					</div>

					<div className="flex justify-center">
						<Button 
							asChild 
							size="lg" 
							className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<Link href="/impact">Explore More</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Our Framework - removed for mentoring site */}

{/* Success Story Feature - removed for mentoring site */}

			{/* Partners Section */}
			<section className="py-20 bg-white dark:bg-slate-800 overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mb-16">
						<h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
							Partners Driving Change With US
						</h2>
						<p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
							With our local and global partners, the change we create becomes possible and scalable.
						</p>
					</div>

					{/* Partners (two logos, centered, no animation) */}
					{partners.length > 0 && (
						<div className="relative">
							<div className="flex justify-center items-center gap-16">
								{partners.map((partner) => (
									<a 
										key={partner.id}
										href={partner.websiteUrl || '#'} 
										target="_blank" 
										rel="noopener noreferrer" 
										className="group"
									>
										<div className="w-64 h-40 bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-6 group-hover:scale-105">
											<img 
												src={partner.logoUrl} 
												alt={partner.name} 
												className="max-w-full max-h-full object-contain transition-all duration-300"
												onError={(e) => {
													e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='160' viewBox='0 0 256 160'%3E%3Crect width='256' height='160' fill='%23f3f4f6'/%3E%3Ctext x='128' y='85' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3E" + partner.name + "%3C/text%3E%3C/svg%3E";
												}}
											/>
										</div>
									</a>
								))}
							</div>
						</div>
					)}

					{/* CTA Button */}
					<div className="flex justify-center mt-12">
						<Button
							asChild
							size="lg"
							className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<Link href="/partners">Explore More about our Partners</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Keep Connected To Our Events Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mb-16">
						<h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
							Upcoming Mentoring Sessions
						</h2>
						<p className="text-xl md:text-2xl text-black dark:text-gray-300 leading-relaxed mb-10 max-w-3xl">
							Be part of Cairo’s most relevant mentorship meetups for young real estate professionals.
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

			{/* Past Events Section */}
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
		</div>
	);
}
