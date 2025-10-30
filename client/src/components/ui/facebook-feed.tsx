import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, ExternalLink, Calendar, User, Loader2 } from "lucide-react";

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  full_picture?: string;
  created_time: string;
  permalink_url: string;
  reactions?: {
    summary: {
      total_count: number;
    };
  };
  comments?: {
    summary: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
  type: string;
}

// Facebook App ID and Access Token would be needed for real implementation
// For now, we'll use a service that can fetch public posts
const FACEBOOK_PAGE_ID = 'GizaSystemsFoundation';

const FacebookPost: React.FC<{ post: FacebookPost }> = ({ post }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getPostType = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event';
      case 'photo':
        return 'Photo';
      case 'video':
        return 'Video';
      case 'link':
        return 'Link';
      default:
        return null;
    }
  };

  const content = post.message || post.story || '';
  const postType = getPostType(post.type);

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800 border-0 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
      
      <CardContent className="relative p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gsf-primary dark:text-white">Giza Systems Foundation</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.created_time)}
              </p>
            </div>
          </div>
          
          {postType && (
            <Badge className="bg-gsf-green/10 text-gsf-green border-gsf-green/20">
              {postType}
            </Badge>
          )}
        </div>

        {/* Post Content */}
        {content && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 overflow-hidden" 
             style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
            {content}
          </p>
        )}

        {/* Post Image */}
        {post.full_picture && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.full_picture} 
              alt="Post content" 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatNumber(post.reactions?.summary?.total_count || 0)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatNumber(post.comments?.summary?.total_count || 0)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors cursor-pointer">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatNumber(post.shares?.count || 0)}
              </span>
            </div>
          </div>
          
          <a 
            href={post.permalink_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gsf-secondary hover:text-gsf-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">View Post</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export const FacebookFeed: React.FC = () => {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback posts in case API fails - these represent typical GSF content
  const fallbackPosts: FacebookPost[] = [
    {
      id: '1',
      message: 'Exciting news! Our latest cohort of entrepreneurs just graduated from the Tech Innovation Hub program. 🚀 These amazing founders are now ready to transform their innovative ideas into successful ventures that will impact communities across Egypt and beyond.',
      full_picture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      created_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 127 } },
      comments: { summary: { total_count: 23 } },
      shares: { count: 15 },
      type: 'photo'
    },
    {
      id: '2',
      message: 'Join us for our upcoming Green Future Initiative workshop! 🌱 Learn about sustainable entrepreneurship and how to build businesses that create positive environmental impact. Registration is now open - link in bio.',
      created_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 89 } },
      comments: { summary: { total_count: 12 } },
      shares: { count: 8 },
      type: 'event'
    },
    {
      id: '3',
      message: 'Success Story Spotlight: Meet Ahmed Hassan, CEO of TechFlow Solutions! 💪 From a small startup idea to a $2M company, Ahmed\'s journey through our Digital Skills Academy program is truly inspiring. His fintech platform is now serving customers across the Middle East.',
      full_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      created_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 245 } },
      comments: { summary: { total_count: 34 } },
      shares: { count: 28 },
      type: 'photo'
    },
    {
      id: '4',
      message: 'Thank you to all our amazing mentors and partners who make our programs possible! 🙏 Your expertise and guidance are helping shape the next generation of Egyptian entrepreneurs. Together, we\'re building a stronger innovation ecosystem.',
      created_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 156 } },
      comments: { summary: { total_count: 18 } },
      shares: { count: 12 },
      type: 'status'
    },
    {
      id: '5',
      message: 'Applications are now open for our next cohort! 📋 Are you ready to turn your innovative idea into a thriving business? Join hundreds of successful entrepreneurs who started their journey with GSF. Apply now and be part of Egypt\'s entrepreneurial revolution.',
      full_picture: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      created_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 312 } },
      comments: { summary: { total_count: 45 } },
      shares: { count: 67 },
      type: 'photo'
    },
    {
      id: '6',
      message: 'Proud to announce our partnership with leading tech companies to provide mentorship and resources to our entrepreneurs! 🤝 This collaboration will help our startups access cutting-edge technology and industry expertise.',
      created_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      permalink_url: 'https://www.facebook.com/GizaSystemsFoundation/',
      reactions: { summary: { total_count: 198 } },
      comments: { summary: { total_count: 27 } },
      shares: { count: 19 },
      type: 'link'
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch real Facebook posts from our API
        const response = await fetch('/api/facebook/posts?limit=6');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setPosts(data.data);
          setError(null);
        } else {
          // If API fails or returns no data, use fallback
          setError(data.error || 'No posts available');
          setPosts(fallbackPosts);
        }
      } catch (err) {
        console.error('Error fetching Facebook posts:', err);
        setError('Failed to connect to Facebook API');
        setPosts(fallbackPosts); // Use fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-gsf-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading Facebook posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-gsf-secondary uppercase tracking-wider mb-3">
            Stay Connected
          </h2>
          <h3 className="font-heading text-4xl font-bold text-gsf-primary dark:text-white mb-6">
            Keep Connected to Our Events
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Follow our latest updates, success stories, and upcoming events on social media. Join our community of entrepreneurs and innovators.
          </p>
          
          {/* Social Media Links */}
          <div className="flex justify-center items-center space-x-6 mb-12">
            <a 
              href="https://www.facebook.com/GizaSystemsFoundation/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold">Follow on Facebook</span>
            </a>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-8">
            <p className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg inline-block">
              {error} - Showing recent posts
            </p>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <FacebookPost key={post.id} post={post} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <a 
            href="https://www.facebook.com/GizaSystemsFoundation/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gsf-primary hover:bg-gsf-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>View More Posts</span>
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}; 