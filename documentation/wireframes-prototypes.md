# Wireframes & Prototype Specifications

## Overview

This document provides detailed specifications for creating wireframes and interactive prototypes in Figma. These specifications serve as the blueprint for designing the user interface and can be directly translated into Figma designs.

The design follows Material Design principles using Material UI components, ensuring a modern, accessible, and professional appearance that users will find familiar and intuitive.

---

## Design System Foundation

### Color Scheme

The color palette uses Material UI's default theme with some customizations:

- **Primary Blue (#1976d2):** Used for primary actions, links, and important interactive elements
- **Secondary Orange (#ff9800):** Indicates in-progress status and warning states
- **Success Green (#4caf50):** Shows resolved status and successful actions
- **Error Red (#f44336):** Highlights errors and critical actions requiring attention
- **Background Gray (#f5f5f5):** Provides subtle contrast for page backgrounds
- **Surface White (#ffffff):** Used for cards, containers, and content areas
- **Text Primary (#212121):** Main text color for readability
- **Text Secondary (#757575):** Secondary text for less prominent information

### Typography

The design uses Roboto as the primary typeface, which is Material Design's standard font:

- **Page Titles:** Roboto Bold, 28px-32px
- **Section Headings:** Roboto Bold, 20px-24px
- **Card Titles:** Roboto Medium, 18px
- **Body Text:** Roboto Regular, 14px-16px
- **Labels & Captions:** Roboto Medium, 12px-14px
- **Button Text:** Roboto Medium, 14px

### Component Library Elements

The design will utilize Material UI components:

- **Buttons:** Contained (primary actions), Outlined (secondary actions), Text (tertiary actions)
- **Cards:** Elevated cards with subtle shadows for content sections
- **Text Fields:** Standard Material inputs with floating labels
- **AppBar:** Top navigation bar with consistent height
- **Badges:** Small status indicators with color coding
- **Chips:** For tags, categories, and filters
- **Tables:** For data display in admin views (with Material UI table components)
- **Dialogs/Modals:** For confirmations and detailed views
- **Snackbars:** For success and error messages
- **Progress Indicators:** Loading spinners and progress bars

---

## Page Layout Specifications

### Authentication Pages

#### Login Page Layout

The login page should be centered both horizontally and vertically on the screen. The layout includes:

- **Header Section:** Logo or brand name at the top, centered
- **Card Container:** A white card (elevated) containing the login form
- **Form Elements:**
  - Page title "Sign In" 
  - Email input field with floating label
  - Password input field with floating label
  - Optional "Remember me" checkbox
  - Primary "Sign In" button (full width, contained style)
  - Link to registration page below the form
- **Spacing:** Generous padding around the card (at least 24px on all sides)
- **Background:** Light gray (#f5f5f5) to make the white card stand out

#### Registration Page Layout

Similar structure to login page but with additional fields:

- **Form Fields:**
  - Email address input
  - Password input with helper text showing minimum requirements
  - Confirm password input
  - Primary "Register" button
  - Link back to login page
- **Validation:** Error states should be clearly visible with red text and outlined error states on inputs

---

### Customer Dashboard

#### Main Dashboard Layout

The customer dashboard uses a clean, card-based layout:

- **Top Navigation Bar (AppBar):**
  - Logo on the left
  - Page title "Customer Portal" in the center or left
  - User menu on the right (showing user email/name and logout option)
  
- **Welcome Section:**
  - Personalized greeting "Welcome back, [Name]"
  - Brief description or helpful tips

- **Quick Action Cards:**
  - Two large, prominent cards side by side
  - "Submit Feedback" card with icon and description
  - "Create Support Ticket" card with icon and description
  - Cards should be clickable and have hover effects

- **Statistics Section:**
  - Summary cards showing key metrics:
    - Total feedback submitted
    - Number of open tickets
    - Number of resolved tickets
  - Cards arranged horizontally with equal spacing

- **Recent Activity Feed:**
  - List of recent interactions (feedback submissions, ticket updates)
  - Each item shows type, brief description, and timestamp
  - Clickable items that navigate to detail views

- **Navigation Links:**
  - Horizontal tabs or vertical menu for: My Feedback, My Tickets, History

---

### Feedback Pages

#### Submit Feedback Form

The feedback submission page should be clean and focused:

- **Page Header:** "Submit Feedback" as the main title
- **Form Card:**
  - **Rating Section:**
    - Question: "How would you rate your experience?"
    - Interactive star rating (5 stars, clickable)
    - Visual feedback when hovering and selecting
  - **Comment Field:**
    - Large text area (minimum 4-5 lines visible)
    - Character counter if needed
    - Placeholder text with guidance
  - **Optional Category Dropdown:**
    - Labeled as "Category (Optional)"
    - Material UI select component
  - **Action Buttons:**
    - Primary "Submit Feedback" button
    - Secondary "Cancel" button (outlined style)
    - Buttons aligned to the right

#### My Feedback List View

This page displays the customer's submitted feedback:

- **Page Header:** "My Feedback" with optional "Submit New" button
- **Filter Bar:**
  - Dropdown for filtering (All, By Rating, By Status)
  - Dropdown for sorting (Newest, Oldest, Rating)
  - Horizontal layout with spacing
- **Feedback Cards:**
  - Each feedback item in its own card
  - Card shows:
    - Star rating display (visual stars, not just numbers)
    - Comment preview (truncated if long, with "read more")
    - Submission date formatted nicely
    - Status badge (Submitted/Reviewed)
    - "View Details" link or button
  - Cards stacked vertically with spacing between
- **Pagination:**
  - Bottom of page shows page numbers
  - Previous/Next buttons
  - Current page highlighted

---

### Support Ticket Pages

#### Create Ticket Form

Similar structure to feedback form but with different fields:

- **Form Fields:**
  - Subject line input (single line, required)
  - Description text area (larger, required)
  - Priority selector (radio buttons or chips): Low, Medium, High
  - Optional but clearly labeled
- **Action Buttons:** Submit and Cancel, same styling as feedback form

#### My Tickets List View

- **Layout similar to feedback list:**
  - Filter and sort options at top
  - Ticket cards showing:
    - Ticket ID (prominent, like "Ticket #1234")
    - Subject line
    - Status badge with color coding
    - Creation date
    - "View Details" action
  - Color-coded status badges:
    - Open: Blue background
    - In Progress: Orange background  
    - Resolved: Green background

#### Ticket Detail View

This is a comprehensive view showing all ticket information:

- **Header Section:**
  - Ticket ID prominently displayed
  - Status badge (large, colored)
  - Creation and last updated timestamps
- **Ticket Information Card:**
  - Subject line
  - Full description
  - Customer information (for admin view)
- **Status Timeline (Optional):**
  - Visual representation of status changes
  - Shows: Created → In Progress → Resolved
- **Communication Thread:**
  - Original ticket description at top
  - Each admin reply in chronological order
  - Each message shows:
    - Author name/role
    - Timestamp
    - Message content
  - Visual distinction between customer messages and admin messages
- **Admin Actions (Admin View Only):**
  - Status update dropdown/buttons
  - Reply text area
  - "Send Reply" button

---

### Admin Dashboard

#### Admin Dashboard Layout

Similar structure to customer dashboard but with different content:

- **Statistics Cards:**
  - Total feedback count
  - Open tickets count
  - Resolved tickets count
  - Maybe average rating or other metrics
  - Cards arranged in a grid (3-4 columns)
- **Quick Actions:**
  - Buttons or cards for: Review Feedback, Manage Tickets, View All Interactions
- **Activity Feed:**
  - Recent activity across all customers
  - New feedback notifications
  - Ticket status updates

---

### Admin Management Pages

#### All Feedback Review Page

- **Table or Card View:**
  - Each row/card shows:
    - Customer email/identifier
    - Rating (visual stars)
    - Comment preview
    - Submission date
    - Status badge
    - Action buttons (View Details, Mark as Reviewed)
- **Top Filter Bar:**
  - Search input
  - Filter dropdowns (Date, Rating, Customer, Status)
  - Sort options
- **Bulk Actions (Optional):**
  - Select multiple items
  - Bulk mark as reviewed

#### All Tickets Management Page

- **Similar to feedback page but ticket-focused:**
  - Ticket ID, Customer, Subject, Status, Date
  - Status filter tabs at top (Open, In Progress, Resolved) with counts
  - Each ticket row/card clickable to view details
- **Priority Indicators:**
  - Visual indicators for high priority tickets
  - Maybe color coding or icons

#### Ticket Detail View (Admin)

- **Same structure as customer view but with admin controls:**
  - Status update dropdown prominently placed
  - Reply section always visible (not hidden)
  - Ability to see full customer history (optional link)

---

### Interaction History Pages

#### Customer History View

- **Unified Timeline:**
  - Combined view of feedback and tickets
  - Grouped by date (if multiple items same day)
  - Visual icons to distinguish feedback (📝) from tickets (🎫)
- **Tabs or Filters:**
  - "All" tab showing everything
  - "Feedback" tab
  - "Tickets" tab
- **Each Item:**
  - Type indicator
  - Brief description
  - Date
  - Clickable to view full details

#### Admin History View

- **Similar structure but shows all customers:**
  - Additional filter: "By Customer" dropdown
  - Date range picker
  - More comprehensive filtering options

---

## Component Specifications

### Status Badges

Status badges should be small, rounded chips with appropriate colors:

- **Open:** Blue background (#2196f3), white text, "Open" label
- **In Progress:** Orange background (#ff9800), white text, "In Progress" label
- **Resolved:** Green background (#4caf50), white text, "Resolved" label
- **Submitted:** Gray background (#9e9e9e), white text, "Submitted" label
- **Reviewed:** Green background (#4caf50), white text, "Reviewed" label

Badges should be approximately 24-28px in height with padding for text.

### Rating Display

Ratings can be displayed in multiple ways:

- **Star Icons:** Filled stars (gold/yellow) for rating value, empty stars for remaining
- **Numeric Display:** "Rating: 4/5" with optional color coding
- **Combined:** Stars with numeric value below

Color coding suggestion:
- 5 stars: Green
- 4 stars: Light green
- 3 stars: Yellow/Orange
- 2 stars: Orange
- 1 star: Red

### Navigation Structure

**Customer Navigation:**
- Dashboard (home icon)
- Submit Feedback
- My Feedback
- Create Ticket
- My Tickets
- History

**Admin Navigation:**
- Dashboard (home icon)
- Review Feedback
- Manage Tickets
- All Interactions

Navigation can be horizontal tabs (desktop) or a collapsible drawer menu (mobile/tablet).

---

## Responsive Design Breakpoints

### Desktop (≥1024px width)
- Full navigation bar visible
- Side-by-side layouts for cards
- Full table views with all columns
- Generous spacing and padding

### Tablet (768px - 1023px)
- Navigation may collapse to hamburger menu
- Cards stack vertically or 2 per row
- Tables may become card-based lists
- Maintains most functionality

### Mobile (<768px)
- Hamburger menu for navigation
- Single column layouts throughout
- Cards stack vertically
- Tables become card-based lists
- Touch-friendly button sizes (minimum 44px height)
- Bottom navigation bar optional for quick access

---

## Interactive Prototype Requirements

### Figma Prototype Setup

When creating the Figma prototype, ensure:

1. **Component Library:** Create reusable components for buttons, cards, inputs, badges
2. **Design System:** Set up color styles, text styles, and effects (shadows)
3. **Frames:** Create frames for each page/screen
4. **Interactions:** Add click interactions to:
   - Navigation links
   - Buttons
   - Cards that navigate to detail views
   - Form submissions
   - Status updates
5. **States:** Create component variants for:
   - Button states (default, hover, pressed, disabled)
   - Input states (default, focused, error, filled)
   - Card hover states

### Key Interactions to Prototype

- **Navigation:** Clicking menu items changes pages
- **Form Submission:** Clicking submit buttons shows loading state then success message
- **Status Updates:** Clicking status dropdowns shows options and updates display
- **Filtering:** Changing filters updates the displayed list
- **Detail Views:** Clicking list items opens detail views
- **Modal Dialogs:** Confirmations and detailed views in modals

### Animation Guidelines

Keep animations subtle and purposeful:

- **Page Transitions:** Fade or slide (200-300ms duration)
- **Button Hover:** Slight elevation increase or color change
- **Loading States:** Spinner or progress indicator
- **Success Messages:** Slide in from top or bottom, auto-dismiss after 3-4 seconds

---

## Implementation Notes for Figma

### Creating the Prototype

1. Start with the design system: colors, typography, spacing
2. Build component library: buttons, inputs, cards, badges
3. Create page layouts using the components
4. Add interactions between frames
5. Test the prototype flow to ensure all paths work

### Export Considerations

- Export assets at 2x resolution for crisp display
- Consider creating a style guide page showing all components
- Document any design decisions or variations

### Handoff to Development

The Figma file should include:
- Clear component naming
- Spacing measurements
- Color codes (hex values)
- Font specifications
- Any design tokens or variables

---

## Additional Design Considerations

### Accessibility

- Ensure sufficient color contrast (WCAG AA minimum)
- Provide text alternatives for icons
- Ensure interactive elements are keyboard navigable
- Use semantic HTML structure when implementing

### Loading States

Design loading indicators for:
- Initial page loads
- Form submissions
- Data fetching
- Status updates

### Empty States

Design screens for when there's no data:
- "No feedback submitted yet"
- "No tickets created"
- "No results found" for filtered views

### Error States

Design error displays for:
- Form validation errors
- Network errors
- Permission errors
- "Not found" pages

---

**Document Prepared:** January 2026  
**Version:** 1.0  
**Status:** Ready for Figma Implementation

**Note:** This document provides specifications for creating wireframes and prototypes in Figma. The actual Figma files should be created separately using these specifications as a guide. The wireframes can be created as low-fidelity sketches first, then refined into high-fidelity prototypes with full interactivity.

