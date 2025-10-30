import { Request, Response } from 'express';

// Facebook Graph API configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || 'GizaSystemsFoundation';
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

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

interface FacebookResponse {
  data: FacebookPost[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export class FacebookService {
  private static async makeGraphAPIRequest(endpoint: string): Promise<any> {
    if (!FACEBOOK_ACCESS_TOKEN) {
      throw new Error('Facebook access token not configured');
    }

    const url = `https://graph.facebook.com/v18.0/${endpoint}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API Error: ${error.error?.message || 'Unknown error'}`);
    }
    
    return response.json();
  }

  static async getPagePosts(limit: number = 10): Promise<FacebookPost[]> {
    try {
      const fields = [
        'id',
        'message',
        'story',
        'full_picture',
        'created_time',
        'permalink_url',
        'type',
        'reactions.summary(total_count)',
        'comments.summary(total_count)',
        'shares'
      ].join(',');

      const endpoint = `${FACEBOOK_PAGE_ID}/posts?fields=${fields}&limit=${limit}&access_token=${FACEBOOK_ACCESS_TOKEN}`;
      const response: FacebookResponse = await this.makeGraphAPIRequest(endpoint);
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      throw error;
    }
  }

  static async getPageInfo(): Promise<any> {
    try {
      const fields = 'id,name,about,fan_count,picture';
      const endpoint = `${FACEBOOK_PAGE_ID}?fields=${fields}&access_token=${FACEBOOK_ACCESS_TOKEN}`;
      return await this.makeGraphAPIRequest(endpoint);
    } catch (error) {
      console.error('Error fetching Facebook page info:', error);
      throw error;
    }
  }
}

// API Routes
export const getFacebookPosts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await FacebookService.getPagePosts(limit);
    
    res.json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Facebook API Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Facebook posts',
      fallback: true
    });
  }
};

export const getFacebookPageInfo = async (req: Request, res: Response) => {
  try {
    const pageInfo = await FacebookService.getPageInfo();
    
    res.json({
      success: true,
      data: pageInfo
    });
  } catch (error) {
    console.error('Facebook Page Info Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Facebook page info'
    });
  }
}; 