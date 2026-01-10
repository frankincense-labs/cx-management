# CX Management Platform - Testing Guide

Welcome! This guide will help you explore and test the Customer Experience Management Platform for FinTech Startups.

## 🚀 Getting Started

### Sign-Up Options

The platform supports two user types, each with different access levels:

#### 1. **Customer Account** (Default)
- **How to sign up as a customer:**
  - Click "Sign up" on the login page
  - Fill in your details (Full Name, Email, Password)
  - **Leave the "Admin Code" field blank** OR use Google Sign-in
  - Click "Sign Up"

- **What customers can do:**
  - Submit feedback with ratings and categories
  - Create support tickets with priority levels
  - View all their submitted feedback
  - Track their support tickets and see status updates
  - View their complete interaction history
  - Attach files (screenshots, PDFs) to feedback and tickets
  - See admin replies on their tickets

#### 2. **Admin Account** (For Platform Management)
- **How to sign up as an admin:**
  - Click "Sign up" on the login page
  - Fill in your details (Full Name, Email, Password)
  - **Enter the admin code: `ADMIN2026`** in the "Admin Code (Optional)" field
  - **Important:** Admin accounts must use email/password sign-up (not Google Sign-in)
  - Click "Sign Up"

- **What admins can do:**
  - View all customer feedback across the platform
  - Filter feedback by category and date range
  - Review and manage all support tickets
  - Update ticket status (Open → In Progress → Resolved)
  - Reply to customer tickets
  - View individual customer interaction history
  - See platform-wide statistics and analytics
  - Filter tickets by status and date range

## 🧪 Testing Recommendations

### For Customer Experience:
1. **Sign up as a customer** (leave admin code blank)
2. Submit a feedback entry:
   - Try different categories (Bug Report, Feature Request, etc.)
   - Add a rating (1-5 stars)
   - Attach a file (screenshot or document)
3. Create a support ticket:
   - Choose a priority level (Low, Medium, High)
   - Add a detailed description
   - Attach files if needed
4. Check "My Feedback" and "My Tickets" pages
5. View your interaction history

### For Admin Experience:
1. **Sign up as an admin** (use code: `ADMIN2026`)
2. Navigate to "Review Feedback":
   - Try filtering by category
   - Use date range filters
   - Review customer submissions
3. Go to "Manage Tickets":
   - View all tickets
   - Click on a ticket to view details
   - Update a ticket status (e.g., Open → In Progress)
   - Add a reply to a ticket
4. Check the Admin Dashboard for platform statistics
5. View "All Interactions" to see complete customer activity

## 🔑 Test Credentials

You can create multiple test accounts:
- **Customer accounts:** Use any email (or Google Sign-in)
- **Admin accounts:** Use any email + admin code `ADMIN2026`

## 📝 Key Features to Test

### Customer Features:
- ✅ Feedback submission with file attachments
- ✅ Ticket creation with priority levels
- ✅ Real-time status updates
- ✅ Viewing admin replies on tickets
- ✅ Interaction history tracking

### Admin Features:
- ✅ Viewing all customer feedback
- ✅ Filtering and searching feedback
- ✅ Managing ticket statuses
- ✅ Replying to customer tickets
- ✅ Viewing customer interaction history
- ✅ Platform analytics and statistics

## 💡 Tips

- **Remember Me:** Check this box to save your email for faster login
- **File Attachments:** Maximum file size is 5MB per file
- **Real-time Updates:** Changes appear automatically without page refresh
- **Status Updates:** Admins can update ticket status, and customers see updates immediately

## 🐛 Reporting Issues

If you encounter any issues or have feedback:
1. Note the page/feature where it occurred
2. Describe what you were trying to do
3. Include any error messages you saw
4. Share your feedback on the overall user experience

---

**Note:** This is a prototype platform designed for FinTech startups to manage customer experience. All data is stored securely in Firebase, and the platform is optimized for both customer engagement and administrative oversight.

Enjoy testing! 🎉

