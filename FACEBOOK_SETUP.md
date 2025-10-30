# Facebook API Setup Guide

To display real Facebook posts from the Giza Systems Foundation page, you need to configure Facebook Graph API access.

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" and "Pages" products
4. Note down your App ID and App Secret

## Step 2: Get Page Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Generate a User Access Token with permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_read_user_content`
4. Get the Page ID for "GizaSystemsFoundation"
5. Exchange the User Access Token for a Page Access Token
6. Convert to Long-lived Page Access Token

## Step 3: Environment Variables

Add these to your `.env` file:

```env
# Facebook API Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ID=GizaSystemsFoundation
FACEBOOK_ACCESS_TOKEN=your_long_lived_page_access_token
```

## Step 4: Testing

1. Restart your server
2. Visit `/api/facebook/posts` to test the API
3. The frontend will automatically fetch real posts

## API Endpoints

- `GET /api/facebook/posts?limit=6` - Get latest posts
- `GET /api/facebook/page-info` - Get page information

## Fallback Behavior

If the Facebook API is not configured or fails:
- The app will display realistic mock posts
- An error message will indicate the API status
- Users can still navigate to the Facebook page directly

## Required Permissions

- `pages_show_list` - To list pages
- `pages_read_engagement` - To read post engagement metrics
- `pages_read_user_content` - To read post content

## Security Notes

- Never commit access tokens to version control
- Use environment variables for all sensitive data
- Page Access Tokens should be long-lived (60 days)
- Consider implementing token refresh logic for production 