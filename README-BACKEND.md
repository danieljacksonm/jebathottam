# Backend Setup Guide

## Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE ministry_platform;
   ```

2. **Run Schema:**
   ```bash
   mysql -u root -p ministry_platform < database/schema.sql
   ```

   Or import the schema file using your MySQL client.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ministry_platform

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Default Admin Account

After running the schema, you can login with:
- **Email:** admin@ministry.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change this password immediately in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Followers
- `GET /api/followers` - List followers (query: status, family_id)
- `GET /api/followers/[id]` - Get follower with prayer points
- `POST /api/followers` - Create follower
- `PUT /api/followers/[id]` - Update follower
- `DELETE /api/followers/[id]` - Delete follower

### Prayer Points
- `GET /api/prayer-points` - List prayer points (query: follower_id, status)
- `POST /api/prayer-points` - Create prayer point
- `PUT /api/prayer-points/[id]` - Update prayer point status
- `DELETE /api/prayer-points/[id]` - Delete prayer point

### Families
- `GET /api/families` - List all families with members
- `POST /api/families` - Create family

### Blogs
- `GET /api/blogs` - List blogs (query: published, category)
- `GET /api/blogs/[id]` - Get blog
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Events
- `GET /api/events` - List events (query: upcoming)
- `GET /api/events/[id]` - Get event
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Gallery
- `GET /api/gallery` - List gallery images
- `GET /api/gallery/[id]` - Get gallery image
- `POST /api/gallery` - Create gallery image
- `PUT /api/gallery/[id]` - Update gallery image
- `DELETE /api/gallery/[id]` - Delete gallery image

### Team
- `GET /api/team` - List team members
- `GET /api/team/[id]` - Get team member
- `POST /api/team` - Create team member
- `PUT /api/team/[id]` - Update team member
- `DELETE /api/team/[id]` - Delete team member

### Notes/Sermons
- `GET /api/notes` - List notes (query: type)
- `GET /api/notes/[id]` - Get note
- `POST /api/notes` - Create note/sermon
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Prophecy
- `GET /api/prophecy` - List prophecies (query: status)
- `GET /api/prophecy/[id]` - Get prophecy
- `POST /api/prophecy` - Create prophecy
- `PUT /api/prophecy/[id]` - Update prophecy
- `DELETE /api/prophecy/[id]` - Delete prophecy

### Media
- `GET /api/media` - List media (query: type)
- `GET /api/media/[id]` - Get media
- `POST /api/media` - Create media
- `PUT /api/media/[id]` - Update media
- `DELETE /api/media/[id]` - Delete media

### Settings
- `GET /api/settings` - Get all settings
- `POST /api/settings` - Update settings

### Slider
- `GET /api/slider` - List slider images (query: active)
- `POST /api/slider` - Create slider image
- `PUT /api/slider/[id]` - Update slider image
- `DELETE /api/slider/[id]` - Delete slider image

### Reports
- `GET /api/reports/prayers` - Get prayer reports and statistics

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Role-Based Access

- **master_admin**: Full access to all endpoints
- **pastor**: Can manage content (blogs, events, gallery, team, notes, prophecy, media)
- **member**: Can view and manage own notes, view followers and prayer points
- **visitor**: Read-only access to public content

## Next Steps

1. Update frontend components to use the API client (`lib/api.ts`)
2. Replace static data with API calls
3. Add error handling and loading states
4. Test all endpoints
5. Set up production database
6. Change default admin password
7. Update JWT secret for production
