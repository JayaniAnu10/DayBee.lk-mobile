# Smart Part-Time Mobile App

A full-featured React Native Expo mobile application for the Smart Part-Time job platform. This app mirrors all functionality from the web application and connects to the deployed backend at `http://daybee.jayanidahanayake.me`.

## 🎯 Features

### All User Roles Supported:
- **Job Seekers**: Find jobs, apply, view history, manage profile, receive notifications
- **Employers**: Post jobs, manage applicants, view company profile
- **Admins**: Dashboard analytics, user management, job moderation, complaints/reports

### Complete Feature Parity with Web App:
- ✅ Authentication (Login / Sign Up / Logout / Token Refresh)
- ✅ Multi-step Registration (Job Seeker & Employer)
- ✅ Job Search with Advanced Filters (category, type, location)
- ✅ Job Details & Application with Schedule Selection
- ✅ Recommended Jobs (AI-powered)
- ✅ Nearby Jobs Search
- ✅ Job History & Application Status Tracking
- ✅ Notifications with Mark All Read
- ✅ Profile Management (edit, photo upload)
- ✅ Ratings & Reviews
- ✅ Employer: Post Jobs, View Applicants, Approve/Reject
- ✅ AI Chatbot (session-based)
- ✅ Admin Dashboard with Analytics
- ✅ Admin User Management (suspend/activate/delete)
- ✅ Admin Job Moderation (approve/reject/delete)
- ✅ Admin Complaints/Reports Management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli` or `npx expo`
- **Expo Go** app on your phone (iOS App Store / Google Play)

### Installation Steps

1. **Open the project in VS Code**:
   ```bash
   cd SmartPartTimeApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify the .env file** (already configured):
   ```
   EXPO_PUBLIC_API_URL=http://daybee.jayanidahanayake.me/api
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Run on your device**:
   - Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

---

## 📱 Running on Emulator/Simulator

### Android Emulator:
```bash
# Start Android emulator first, then:
npx expo start --android
```

### iOS Simulator (macOS only):
```bash
npx expo start --ios
```

---

## 📁 Project Structure

```
SmartPartTimeApp/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Splash/redirect screen
│   ├── auth.tsx                  # Login/Signup
│   ├── getstarted.tsx            # Role selection
│   ├── job-applicants.tsx        # Employer: view applicants
│   ├── jobseeker/                # Job seeker registration
│   │   └── register/
│   │       ├── step1.tsx
│   │       └── step2.tsx
│   ├── employer/                 # Employer registration
│   │   └── register/
│   │       ├── step1.tsx
│   │       └── step2.tsx
│   └── (tabs)/                   # Main app tabs
│       ├── _layout.tsx           # Dynamic tab layout by role
│       ├── jobseeker/
│       │   ├── dashboard.tsx     # Home dashboard
│       │   ├── find-jobs.tsx     # Job search
│       │   ├── notifications.tsx # Notifications
│       │   ├── history.tsx       # Job history
│       │   └── profile.tsx       # Profile management
│       ├── employer/
│       │   ├── dashboard.tsx     # Employer dashboard
│       │   ├── post-job.tsx      # Post new job
│       │   └── profile.tsx       # Company profile
│       ├── admin/
│       │   ├── dashboard.tsx     # Admin overview
│       │   ├── users.tsx         # User management
│       │   ├── jobs.tsx          # Job moderation
│       │   ├── complaints.tsx    # Reports/complaints
│       │   └── analytics.tsx     # Analytics
│       └── shared/
│           ├── find-jobs.tsx     # Browse jobs (employer view)
│           ├── job-detail.tsx    # Job detail + apply
│           ├── nearby.tsx        # Nearby jobs
│           └── chat.tsx          # AI chatbot
├── src/
│   ├── constants/
│   │   └── theme.ts              # Colors, spacing, typography
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── services/
│   │   └── apiClient.ts          # Axios API client + interceptors
│   ├── store/
│   │   ├── authStore.ts          # Auth state (Zustand + SecureStore)
│   │   └── registrationStore.ts  # Registration form state
│   └── components/
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Card.tsx
│       │   ├── Badge.tsx
│       │   ├── StarRating.tsx
│       │   └── States.tsx        # Loading, Empty, Error states
│       └── common/
│           ├── Header.tsx
│           └── JobCard.tsx
├── assets/                       # App icons and splash
├── .env                          # Environment variables
├── app.json                      # Expo configuration
├── babel.config.js
├── package.json
└── tsconfig.json
```

---

## 🔌 API Integration

The app connects to: `http://daybee.jayanidahanayake.me/api`

### Authentication Flow:
1. `POST /auth/login` → receives JWT access token
2. `GET /auth/me` → fetches user info
3. Token stored in SecureStore
4. Auto-refresh via `POST /auth/refresh` on 401 errors

### Key Endpoints Used:
| Feature | Endpoint |
|---------|----------|
| Login | `POST /auth/login` |
| Job Search | `GET /jobs/search` |
| Apply to Job | `POST /applications` |
| Job Seeker Register | `POST /jobseeker/register` |
| Employer Register | `POST /employer/register` |
| Notifications | `GET /notifications/user/{id}` |
| Job History | `GET /jobseeker/history/{id}` |
| Post Job | `POST /jobs/create/{employerId}` |
| AI Chat | `POST /api/chat` |
| Admin Users | `GET /admin/users` |
| Analytics | `GET /admin/analytics/overview` |

---

## 🎨 Design System

Matching the web app's brand identity:
- **Primary Color**: `#fbbd23` (Golden Yellow)
- **Secondary Color**: `#0f1f3d` (Dark Navy Blue)
- **Background**: `#f5f3ee` (Warm Off-white)
- **Font**: System (SF Pro on iOS, Roboto on Android)

---

## ⚠️ Troubleshooting

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Dependency issues:**
```bash
rm -rf node_modules && npm install
```

**Network errors on device:**
- Ensure your device is on the same WiFi as your development machine
- The backend at `http://daybee.jayanidahanayake.me` is public, so network should work on any connection

**iOS build issues:**
```bash
npx pod-install  # if using bare workflow
```
