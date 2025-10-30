import React from 'react';
import { Card, CardContent } from './card';
import { TrendingUp, Heart, ArrowRight } from 'lucide-react';

const programsData = [
  {
    id: 'bridgez',
    title: 'BridgEz Acceleration Program',
    description: 'Fueling the growth of social impact startups through structured mentorship, investment readiness training, and strategic networking opportunities.',
    icon: TrendingUp,
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'imentor',
    title: 'iMentor Program',
    description: 'Connecting social entrepreneurs with experienced industry experts to provide tailored guidance and support for their ventures.',
    icon: Heart,
    color: 'red',
    gradient: 'from-red-500 to-pink-500',
  },
];

export function AnimatedCards() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {programsData.map((program, index) => {
          const IconComponent = program.icon;
          
          return (
            <div
              key={program.id}
              className="group animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'both'
              }}
            >
              <Card className="h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated background blur */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${program.gradient} rounded-lg blur opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
                
                <CardContent className="p-8 h-full flex flex-col relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.gradient} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-bold text-gsf-primary dark:text-white mb-4 group-hover:text-gsf-secondary transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-base">
                      {program.description}
                    </p>
                  </div>
                  
                  {/* Action */}
                  <div className="flex items-center text-gsf-secondary group-hover:text-gsf-primary transition-colors duration-300 mt-auto">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
} 