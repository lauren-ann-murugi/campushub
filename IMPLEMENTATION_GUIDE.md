# Email Verification Registration/Login Implementation Guide

## Overview

The CampusHub authentication system now includes a complete registration and login flow with email verification. Users must verify their email with a 6-digit code before accessing the dashboard.

## System Architecture

### Backend (Flask + SQLAlchemy)

#### 1. **Database Models** (`server/app/models/user.py`)
- **User Model**: Updated with `is_email_verified` field to track email verification status
- **VerificationCode Model**: Stores hashed verification codes with:
  - Email (indexed for fast lookups)
  - Code hash (for security)
  - Attempt counter (rate limiting - max 3 attempts)
  - Expiration time (10-minute validity)

#### 2. **Email Service** (`server/app/services/email_service.py`)
- Generates random 6-digit verification codes
- Sends emails via SMTP (falls back to console printing if SMTP not configured)
- Stores hashed codes in database
- Includes error handling and logging

#### 3. **Authentication Service** (`server/app/services/auth_service.py`)
Provides four main operations:
- **register_user()**: Creates new user and sends verification code
- **login_user()**: Authenticates credentials and sends verification code
- **verify_code()**: Validates 6-digit code with rate limiting and generates JWT token
- **resend_code()**: Resends verification code with timeout

#### 4. **API Endpoints** (`server/app/api/v1/auth.py`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login user |
| `/api/v1/auth/verify-code` | POST | Verify 6-digit code |
| `/api/v1/auth/resend-code` | POST | Resend verification code |

**Request/Response Examples:**

```bash
# Register
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "student"  # student, teacher, or administrator
}

# Response
{
  "message": "Registration successful. Please verify your email.",
  "email": "john@example.com",
  "requires_verification": true
}

# Verify Code
POST /api/v1/auth/verify-code
{
  "email": "john@example.com",
  "code": "123456"  # 6-digit code sent to email
}

# Response (on success)
{
  "message": "Email verified successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "is_email_verified": true,
    "created_at": "2024-07-25T10:30:00"
  }
}
```

### Frontend (Next.js + React)

#### 1. **Auth Service** (`client/src/services/authService.js`)
- API wrapper with automatic JWT token management
- Methods: `register()`, `login()`, `verifyCode()`, `resendCode()`
- Stores JWT token in localStorage for authenticated requests
- Error handling with custom ApiError class

#### 2. **LoginScreen Component** (`client/src/screens/LoginScreen/LoginScreen.jsx`)
Three-step authentication flow:

**Step 1: Role Selection**
- User selects role (Student, Teacher, Administrator)
- Role determines which dashboard they access after verification

**Step 2: Credentials**
- Registration: First Name, Last Name, Email, Password, Confirm Password, Terms Agreement
- Login: Email, Password
- Both modes have password visibility toggle
- Client-side validation for security

**Step 3: Email Verification**
- User enters 6-digit code sent to their email
- Auto-focus between code input fields
- 10-minute countdown timer
- Resend code available after 1 minute
- Rate limiting: Max 3 incorrect attempts

**Dashboard Redirect**
- After successful verification, users are redirected to role-based dashboard:
  - `/dashboard/student`
  - `/dashboard/teacher`
  - `/dashboard/administrator`

## Setup Instructions

### Backend Setup

1. **Create Database Tables**
   ```bash
   cd server
   python run.py
   ```
   Tables are automatically created on first run via `db.create_all()`

2. **Configure Email Service** (Optional but Recommended)
   
   Create `.env` file in `server/` directory:
   ```env
   DATABASE_URL=sqlite:///campushub.db
   SECRET_KEY=your-secret-key-here
   
   # Email Configuration (Gmail example)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password  # Use App Password for Gmail
   
   # Or any other SMTP provider
   SMTP_SERVER=smtp.office365.com  # For Outlook
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=your-password
   ```

3. **Start Backend Server**
   ```bash
   cd server
   python run.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Configure API URL**
   
   In `.env.local` (create if doesn't exist):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. **Start Frontend Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## Testing the Implementation

### Test Case 1: Basic Registration

1. Navigate to `http://localhost:3000/register`
2. Select "Student" role
3. Enter:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@test.com
   - Password: password123
   - Confirm Password: password123
   - Check terms agreement
4. Click "Create account"
5. You should see: "A 6-digit verification code has been sent to your email."
6. Check backend console for the verification code (fallback display)
7. Enter the 6-digit code in the verification screen
8. You should be redirected to `/dashboard/student`

### Test Case 2: Login with Verification

1. Navigate to `http://localhost:3000/login`
2. Select "Teacher" role
3. Click "Login" tab (should be visible after entering credentials)
4. Enter:
   - Email: john.doe@test.com
   - Password: password123
5. Click "Sign in"
6. Verification code sent, enter it
7. Redirected to `/dashboard/teacher`

### Test Case 3: Verification Code Errors

1. Start registration/login again
2. When prompted for code, enter wrong code 3 times
3. After 3rd attempt: "Too many failed attempts. Please login again."
4. Start over from step 1
5. Click "Resend code" (available after 1 minute or immediately in test)

### Test Case 4: Role Mismatch

1. Register as "Student" with email: `test@example.com`
2. Try to login with same email but select "Teacher" role
3. You should get error: "User is registered as student, not teacher"

## Key Features

### Security
- ✅ Passwords hashed with bcrypt
- ✅ Verification codes hashed in database
- ✅ Rate limiting (3 attempts per code)
- ✅ Codes expire after 10 minutes
- ✅ JWT tokens for authenticated requests
- ✅ CORS configured for frontend origin

### User Experience
- ✅ Clear step-by-step flow with progress indicators
- ✅ Real-time validation and error messages
- ✅ Password visibility toggle
- ✅ Auto-focus between verification code digits
- ✅ Code paste support
- ✅ Countdown timer for code expiration
- ✅ Resend code functionality
- ✅ Role-based dashboard redirect

### Reliability
- ✅ Fallback console output if email fails
- ✅ Database-backed verification codes (survives server restarts)
- ✅ Proper error handling on both frontend and backend
- ✅ Transaction management for atomic operations

## Troubleshooting

### "Cannot send email" issues

If emails aren't sending and you see console output instead:
1. Check if SMTP credentials are configured in `.env`
2. For Gmail: Use App Password (not regular password)
3. Enable "Less secure app access" if using older Gmail account
4. Check SMTP server and port are correct

### "Code expired" errors

- Codes are valid for 10 minutes
- If user takes too long, they can click "Resend code"
- Timer shows remaining time until expiration

### Database errors

If you get "User already exists" error:
1. This is expected if you try to register with same email twice
2. Try with a different email address
3. Or delete the SQLite database file (`server/instance/campushub.db`) to reset

### Frontend shows "Invalid email or password"

- Verify you're using the correct email and password
- Check backend logs for the exact error
- Ensure backend is running on correct port (5000)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                          │
│  LoginScreen Component                                          │
│  ├─ Step 1: Role Selection                                     │
│  ├─ Step 2: Registration/Login Credentials                     │
│  └─ Step 3: 6-Digit Email Verification                         │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ API Calls
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│               Backend (Flask)                                   │
│                                                                 │
│  Auth Endpoints (/api/v1/auth)                                  │
│  ├─ /register → AuthService.register_user()                    │
│  ├─ /login → AuthService.login_user()                          │
│  ├─ /verify-code → AuthService.verify_code()                   │
│  └─ /resend-code → AuthService.resend_code()                   │
│                     ↓                                           │
│  Email Service                                                  │
│  ├─ Generate 6-digit code                                      │
│  ├─ Hash code                                                   │
│  └─ Send email (or console fallback)                            │
│                     ↓                                           │
│  Database (SQLite)                                              │
│  ├─ User table (name, email, password_hash, role, ...)         │
│  └─ VerificationCode table (email, code_hash, expires_at, ...) │
└─────────────────────────────────────────────────────────────────┘
```

## API Integration with Dashboard

After successful email verification, the user receives a JWT token that should be:
1. Stored in localStorage
2. Included in Authorization header for protected endpoints: `Authorization: Bearer <token>`

Example protected endpoint call:
```javascript
const response = await fetch('/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${authService.getToken()}`
  }
});
```

## Future Enhancements

- [ ] Email templates with HTML formatting
- [ ] Two-factor authentication (TOTP)
- [ ] Social login (Google, Microsoft)
- [ ] Password reset functionality
- [ ] Account suspension after failed attempts
- [ ] Email verification resend limits
- [ ] Mobile app integration

## Files Modified/Created

**Backend:**
- ✅ `server/app/models/user.py` - Added `is_email_verified` field
- ✅ `server/app/services/auth_service.py` - Complete implementation
- ✅ `server/app/services/email_service.py` - Already configured
- ✅ `server/app/api/v1/auth.py` - Updated endpoints

**Frontend:**
- ✅ `client/src/screens/LoginScreen/LoginScreen.jsx` - New implementation
- ✅ `client/src/services/authService.js` - Updated methods

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review backend logs: Check console output when running `python run.py`
3. Check frontend logs: Browser DevTools Console (F12)
4. Check API responses in Network tab for error details
