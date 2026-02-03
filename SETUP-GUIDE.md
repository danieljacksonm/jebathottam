# Complete Backend Setup & Integration Guide

## ✅ What's Been Created

### Backend Infrastructure
1. **Database Connection** (`lib/db.ts`)
   - MySQL connection pool
   - Query helpers
   - Transaction support

2. **Authentication System** (`lib/auth.ts`)
   - JWT token generation/verification
   - Password hashing (bcrypt)
   - Role-based access control
   - Request authentication middleware

3. **Database Schema** (`database/schema.sql`)
   - Complete schema for all tables
   - Foreign key relationships
   - Indexes for performance
   - Default admin user

4. **API Routes** (All in `app/api/`)
   - ✅ Authentication (login, register, me, logout)
   - ✅ Followers (CRUD + prayer points)
   - ✅ Prayer Points (CRUD + status updates)
   - ✅ Families (list, create)
   - ✅ Blogs (CRUD)
   - ✅ Events (CRUD)
   - ✅ Gallery (CRUD)
   - ✅ Team (CRUD)
   - ✅ Notes/Sermons (CRUD)
   - ✅ Prophecy (CRUD)
   - ✅ Media (CRUD)
   - ✅ Settings (get, update)
   - ✅ Slider (CRUD)
   - ✅ Reports (prayer statistics)
   - ✅ Dashboard (statistics)

5. **Frontend API Client** (`lib/api.ts`)
   - Complete API wrapper functions
   - Automatic token handling
   - Error handling

6. **Auth Context** (`lib/api-client.tsx`)
   - React context for authentication
   - User state management
   - Login/logout functions

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Database
```sql
CREATE DATABASE ministry_platform;
```

### Step 3: Configure Environment
Create `.env.local`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ministry_platform
JWT_SECRET=your-super-secret-jwt-key-change-this
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 4: Run Database Schema
```bash
mysql -u root -p ministry_platform < database/schema.sql
```

### Step 5: Generate Admin Password Hash (Optional)
```bash
node scripts/setup-admin.js your_password
```
Update the schema.sql with the generated hash, or update directly in database.

### Step 6: Start Development Server
```bash
npm run dev
```

## 📝 How to Connect Frontend to Backend

### Example: Updating Followers Page

Replace static data with API calls:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { followersApi, prayerPointsApi, familiesApi, reportsApi } from '@/lib/api';

export default function AdminFollowers() {
  const [followers, setFollowers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [followersRes, familiesRes] = await Promise.all([
        followersApi.list(),
        familiesApi.list(),
      ]);
      setFollowers(followersRes.data);
      setFamilies(familiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollower = async (formData) => {
    try {
      await followersApi.create(formData);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error adding follower:', error);
    }
  };

  const handleAddPrayerPoint = async (followerId, prayerData) => {
    try {
      await prayerPointsApi.create({
        follower_id: followerId,
        ...prayerData,
      });
      await loadData();
    } catch (error) {
      console.error('Error adding prayer point:', error);
    }
  };

  const handleUpdatePrayerStatus = async (prayerId, status) => {
    try {
      await prayerPointsApi.update(prayerId, { status });
      await loadData();
    } catch (error) {
      console.error('Error updating prayer status:', error);
    }
  };

  // ... rest of component
}
```

## 🔄 Next Steps to Complete Integration

1. **Update Login Page** (`app/login/page.tsx`)
   - Use `authApi.login()` from `lib/api.ts`
   - Store token in localStorage
   - Redirect on success

2. **Update All Admin Pages**
   - Replace static data with API calls
   - Add loading states
   - Add error handling
   - Implement CRUD operations

3. **Update Public Pages**
   - Connect blogs, events, gallery, team to APIs
   - Add loading states
   - Handle empty states

4. **Add Error Handling**
   - Create error boundary components
   - Show user-friendly error messages
   - Handle network errors gracefully

5. **Add Loading States**
   - Show spinners during API calls
   - Disable buttons during submission
   - Optimistic UI updates where appropriate

## 📋 API Response Format

All APIs return data in this format:
```json
{
  "data": [...],  // or single object for GET by ID
  "message": "Success message" // for POST/PUT/DELETE
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## 🔐 Authentication

- Tokens are stored in localStorage and sent as Bearer token
- Cookies are also set for server-side requests
- Protected routes check for valid token
- Role-based access is enforced on backend

## 🎯 Testing the Backend

1. Test login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ministry.com","password":"admin123"}'
```

2. Test followers (with token):
```bash
curl -X GET http://localhost:3000/api/followers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 All Available API Functions

See `lib/api.ts` for complete list of available functions:
- `authApi.*` - Authentication
- `followersApi.*` - Followers management
- `prayerPointsApi.*` - Prayer points
- `familiesApi.*` - Families
- `blogsApi.*` - Blogs
- `eventsApi.*` - Events
- `galleryApi.*` - Gallery
- `teamApi.*` - Team members
- `notesApi.*` - Notes and sermons
- `prophecyApi.*` - Prophecies
- `mediaApi.*` - Media library
- `settingsApi.*` - Settings
- `sliderApi.*` - Slider images
- `reportsApi.*` - Reports
- `dashboardApi.*` - Dashboard stats

## ⚠️ Important Notes

1. **Change default admin password** before production
2. **Update JWT_SECRET** to a strong random string
3. **Use environment variables** for all sensitive data
4. **Enable HTTPS** in production
5. **Set up database backups**
6. **Implement rate limiting** for production
7. **Add input validation** on both frontend and backend
8. **Sanitize user inputs** to prevent SQL injection
