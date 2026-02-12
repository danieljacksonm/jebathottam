# 🔌 API Documentation - Social Media Management System

## Overview

This document provides comprehensive API documentation for the Social Media Management System.

## 🔐 Authentication

All API endpoints require authentication using JWT tokens.

### Request Headers
```http
Authorization: Bearer <jwt_token>
Cookie: auth_token=<jwt_token>
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "media_team",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "ministry_member"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## 📱 Social Media Accounts API

### List All Accounts

```http
GET /api/social-media/accounts?platform=facebook&status=active
Authorization: Bearer <token>
```

**Query Parameters**:
- `platform` (optional): Filter by platform (facebook, instagram, twitter, etc.)
- `status` (optional): Filter by status (active, inactive, expired, error)

**Response** (200 OK):
```json
{
  "accounts": [
    {
      "id": 1,
      "platform": "facebook",
      "account_name": "My Church Facebook",
      "account_username": "@mychurch",
      "page_id": "123456789",
      "account_id": "987654321",
      "status": "active",
      "last_posted_at": "2026-02-12T10:30:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-02-12T10:30:00Z"
    }
  ]
}
```

**Required Permission**: `social_media_accounts:read`

### Connect New Account

```http
POST /api/social-media/accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "facebook",
  "account_name": "My Church Facebook",
  "account_username": "@mychurch",
  "access_token": "EAAxxxxxxxxxx",
  "refresh_token": "optional",
  "token_expires_at": "2026-12-31T23:59:59Z",
  "page_id": "123456789",
  "account_id": "987654321",
  "metadata": {
    "additional": "data"
  }
}
```

**Response** (201 Created):
```json
{
  "message": "Account connected successfully",
  "account": {
    "id": 1,
    "platform": "facebook",
    "account_name": "My Church Facebook",
    "status": "active"
  }
}
```

**Required Permission**: `social_media_accounts:create`

### Get Single Account

```http
GET /api/social-media/accounts/1
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "account": {
    "id": 1,
    "platform": "facebook",
    "account_name": "My Church Facebook",
    "account_username": "@mychurch",
    "access_token": "EAAxxxxxxxxxx",
    "page_id": "123456789",
    "status": "active"
  }
}
```

### Update Account

```http
PUT /api/social-media/accounts/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "account_name": "Updated Name",
  "status": "inactive",
  "access_token": "new_token"
}
```

**Required Permission**: `social_media_accounts:update`

### Delete Account

```http
DELETE /api/social-media/accounts/1
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Account disconnected successfully"
}
```

**Required Permission**: `social_media_accounts:delete`

## 📝 Social Media Posts API

### List All Posts

```http
GET /api/social-media/posts?status=published&limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): draft, scheduled, publishing, published, failed, archived
- `media_type` (optional): text, image, video, carousel, story, reel
- `limit` (optional, default: 50): Number of posts to return
- `offset` (optional, default: 0): Pagination offset

**Response** (200 OK):
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Sunday Service Announcement",
      "content": "Join us this Sunday for an inspiring service!",
      "media_type": "image",
      "media_urls": ["https://example.com/image.jpg"],
      "hashtags": "#church #faith #sunday",
      "status": "published",
      "scheduled_at": null,
      "published_at": "2026-02-12T10:00:00Z",
      "publish_to_website": true,
      "website_category": "Announcements",
      "creator_name": "John Doe",
      "published_count": 5,
      "total_platforms": 5,
      "created_at": "2026-02-12T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Required Permission**: `social_media_posts:read`

### Create New Post

```http
POST /api/social-media/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sunday Service Announcement",
  "content": "Join us this Sunday for an inspiring service! #church #faith",
  "media_type": "image",
  "media_urls": ["https://example.com/image.jpg"],
  "hashtags": "#church #faith #sunday",
  "status": "draft",
  "scheduled_at": "2026-02-15T10:00:00Z",
  "publish_to_website": true,
  "website_category": "Announcements",
  "platforms": [1, 2, 3]
}
```

**Response** (201 Created):
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "Sunday Service Announcement",
    "status": "draft",
    "created_at": "2026-02-12T09:00:00Z"
  }
}
```

**Required Permission**: `social_media_posts:create`

### Get Single Post

```http
GET /api/social-media/posts/1
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "post": {
    "id": 1,
    "title": "Sunday Service Announcement",
    "content": "Join us this Sunday!",
    "status": "published",
    "creator_name": "John Doe"
  },
  "platforms": [
    {
      "id": 1,
      "post_id": 1,
      "account_id": 1,
      "platform": "facebook",
      "account_name": "My Church Facebook",
      "status": "published",
      "platform_post_url": "https://facebook.com/...",
      "published_at": "2026-02-12T10:00:00Z"
    }
  ],
  "analytics": [
    {
      "platform": "facebook",
      "likes": 150,
      "comments": 25,
      "shares": 10,
      "views": 1000,
      "engagement_rate": 18.5
    }
  ]
}
```

### Update Post

```http
PUT /api/social-media/posts/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "scheduled",
  "scheduled_at": "2026-02-15T10:00:00Z",
  "platforms": [1, 2, 4]
}
```

**Required Permission**: `social_media_posts:update`

### Delete Post

```http
DELETE /api/social-media/posts/1
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Post deleted successfully"
}
```

**Note**: If post is already published, it will be archived instead of deleted.

**Required Permission**: `social_media_posts:delete`

### Publish Post

**The Core Feature** - Publishes post to all selected platforms simultaneously.

```http
POST /api/social-media/posts/1/publish
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Post published to 5 out of 5 platforms",
  "results": [
    {
      "platform": "facebook",
      "account": "My Church Facebook",
      "status": "success",
      "url": "https://facebook.com/..."
    },
    {
      "platform": "instagram",
      "account": "My Church Instagram",
      "status": "success",
      "url": "https://instagram.com/..."
    },
    {
      "platform": "twitter",
      "account": "My Church Twitter",
      "status": "failed",
      "error": "Token expired"
    }
  ],
  "summary": {
    "total": 5,
    "success": 4,
    "failed": 1
  }
}
```

**Required Permission**: `social_media_posts:update`

## 📊 Analytics API

### Get Analytics Data

```http
GET /api/social-media/analytics?post_id=1&platform=facebook&date_from=2026-02-01&date_to=2026-02-12
Authorization: Bearer <token>
```

**Query Parameters**:
- `post_id` (optional): Filter by specific post
- `platform` (optional): Filter by platform
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)

**Response** (200 OK):
```json
{
  "analytics": [
    {
      "id": 1,
      "post_id": 1,
      "account_id": 1,
      "platform": "facebook",
      "post_title": "Sunday Service",
      "likes": 150,
      "comments": 25,
      "shares": 10,
      "views": 1000,
      "clicks": 50,
      "reach": 2500,
      "impressions": 3000,
      "engagement_rate": 18.5,
      "synced_at": "2026-02-12T12:00:00Z"
    }
  ],
  "summary": {
    "total_posts": 10,
    "total_accounts": 5,
    "total_likes": 1500,
    "total_comments": 250,
    "total_shares": 100,
    "total_views": 10000,
    "total_reach": 25000,
    "total_impressions": 30000,
    "avg_engagement_rate": 15.5
  },
  "platformBreakdown": [
    {
      "platform": "facebook",
      "post_count": 10,
      "total_likes": 600,
      "total_comments": 100,
      "total_shares": 40,
      "total_views": 4000,
      "avg_engagement_rate": 18.5
    }
  ]
}
```

**Required Permission**: `social_media_analytics:read`

### Update Analytics

Used to sync analytics data from platforms.

```http
POST /api/social-media/analytics
Authorization: Bearer <token>
Content-Type: application/json

{
  "post_id": 1,
  "account_id": 1,
  "platform": "facebook",
  "likes": 150,
  "comments": 25,
  "shares": 10,
  "views": 1000,
  "clicks": 50,
  "reach": 2500,
  "impressions": 3000
}
```

**Response** (200 OK):
```json
{
  "message": "Analytics updated successfully"
}
```

## 🔒 Permissions System

### Check Permission

Internal API for checking permissions:

```typescript
import { hasPermission } from '@/lib/permissions';

const canCreate = await hasPermission(user, 'social_media_posts', 'create');
```

### Available Resources

- `users`
- `blogs`
- `events`
- `gallery`
- `team`
- `followers`
- `notes`
- `prophecy`
- `media`
- `settings`
- `social_media_accounts`
- `social_media_posts`
- `social_media_analytics`

### Available Permissions

- `create` - Can create new records
- `read` - Can view records
- `update` - Can modify records
- `delete` - Can delete records

## 📋 Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## 🔄 Rate Limiting

Currently not implemented. Recommended limits:
- Authentication: 10 requests/minute
- Social Media Posts: 100 requests/minute
- Analytics: 50 requests/minute

## 📱 Platform-Specific Notes

### Facebook
- Requires Page Access Token
- Supports images, videos, and text posts
- Max characters: No limit (but keep it reasonable)

### Instagram
- Requires Instagram Business Account
- Supports images, videos, carousels, stories, reels
- Max characters: 2,200

### Twitter/X
- Requires API v2 credentials
- Max characters: 280 (basic), 4,000 (premium)
- Supports images, videos, polls

### LinkedIn
- Requires LinkedIn Page or Personal credentials
- Supports images, videos, documents
- Max characters: 3,000

### YouTube
- Requires YouTube Data API v3
- Video uploads only
- Max video size: varies by account type

### TikTok
- Requires TikTok Business API access
- Video content only (15s-10min)

### Telegram
- Requires Bot Token
- Supports all media types
- No character limit

### WhatsApp
- Requires WhatsApp Business API
- Template-based messaging
- Media support varies

## 🧪 Testing

### Example cURL Request

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"media@ministry.com","password":"mediateam123"}'

# Create Post
curl -X POST http://localhost:3000/api/social-media/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post",
    "platforms": [1, 2],
    "status": "draft"
  }'

# Publish Post
curl -X POST http://localhost:3000/api/social-media/posts/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 SDK Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('/api/social-media/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Post content here',
    platforms: [1, 2, 3]
  })
});

const data = await response.json();
```

### React Hook Example

```typescript
const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async (postData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/social-media/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};
```

## 🔗 Webhooks (Future Feature)

Planned webhook endpoints for real-time updates:
- `post.published` - When a post is successfully published
- `post.failed` - When publishing fails
- `analytics.updated` - When analytics are synced
- `account.expired` - When token expires

---

**API Version**: 1.0.0
**Last Updated**: February 2026
**Base URL**: `https://your-domain.com` or `http://localhost:3000` (development)
