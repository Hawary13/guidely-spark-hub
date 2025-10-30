import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { ChevronLeft, ChevronRight, Facebook, Linkedin, Twitter } from "lucide-react";

export type TeamMember = {
	name: string;
	title: string;
	photoUrl?: string;
};

interface TeamSliderProps {
	members: TeamMember[];
	title?: string;
	subtitle?: string;
}

export function TeamSlider({ members, title = "Core Team", subtitle }: TeamSliderProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);

	const scrollByAmount = (dir: "left" | "right") => {
		const el = containerRef.current;
		if (!el) return;
		const cardWidth = 380; // approx card width incl. gap
		const amount = dir === "left" ? -cardWidth : cardWidth;
		el.scrollBy({ left: amount, behavior: "smooth" });
	};

	// Auto-scroll horizontally; loop back to start when reaching end
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const interval = setInterval(() => {
			if (isPaused) return;
			const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
			if (atEnd) {
				el.scrollTo({ left: 0, behavior: "smooth" });
			} else {
				scrollByAmount("right");
			}
		}, 3500);
		return () => clearInterval(interval);
	}, [isPaused]);

	// Neutral gray SVG avatar placeholder (no real photos)
	const avatarPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
		  <defs>
		    <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
		      <stop offset='0%' stop-color='%23e5e7eb'/>
		      <stop offset='100%' stop-color='%23d1d5db'/>
		    </linearGradient>
		  </defs>
		  <rect width='256' height='256' rx='128' fill='url(%23g)'/>
		  <circle cx='128' cy='100' r='44' fill='%23cbd5e1'/>
		  <path d='M36 230c18-50 73-66 92-66s74 16 92 66' fill='%23cbd5e1'/>
		</svg>`
	)}`;

	return (
		<div className="relative">
			<div className="text-center mb-8">
				<h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">{title}</h3>
				{subtitle && (
					<p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
				)}
			</div>

			<div className="relative">
				<button
					onClick={() => scrollByAmount("left")}
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow flex items-center justify-center"
					aria-label="Previous"
				>
					<ChevronLeft className="h-5 w-5" />
				</button>

				<div
					ref={containerRef}
					className="overflow-hidden"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					<div className="flex gap-8 px-14 py-2">
						{members.map((m, idx) => (
							<Card key={idx} className="min-w-[360px] w-[360px] h-[460px] mx-auto text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-2xl">
								<CardContent className="p-8 h-full flex flex-col items-center">
									{/* Avatar with blue dual ring */}
									<div className="relative mb-6">
										<div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300"></div>
										<div className="relative w-32 h-32 rounded-full overflow-hidden ring-8 ring-white dark:ring-slate-900 shadow bg-gray-200">
											<img
												src={avatarPlaceholder}
												alt={m.name}
												className="w-full h-full object-cover"
											/>
										</div>
									</div>

									<div className="font-semibold text-xl text-gray-900 dark:text-white tracking-tight">{m.name}</div>
									<div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">{m.title}</div>
									<div className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-[22rem]">
										Join our mentoring sessions to connect with leading developers and experts.
									</div>

									{/* Social icons */}
									<div className="mt-auto pt-6 flex items-center gap-4 text-gray-400">
										<a href="#" aria-label="Facebook" className="hover:text-gsf-primary transition-colors"><Facebook className="h-4 w-4" /></a>
										<a href="#" aria-label="LinkedIn" className="hover:text-gsf-primary transition-colors"><Linkedin className="h-4 w-4" /></a>
										<a href="#" aria-label="Twitter" className="hover:text-gsf-primary transition-colors"><Twitter className="h-4 w-4" /></a>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<button
					onClick={() => scrollByAmount("right")}
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow flex items-center justify-center"
					aria-label="Next"
				>
					<ChevronRight className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
} 