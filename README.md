# InvoicePro - Invoice Management Dashboard

A modern, responsive invoice management dashboard built with React and Material UI v5.

## Features

- ?? **Dashboard Overview**: Summary cards, revenue charts, and recent invoices table
- ?? **Invoice Management**: Create, edit, delete, and filter invoices with status tracking
- ?? **Client Management**: Manage client database with detailed client information
- ?? **Reports & Analytics**: Visual charts and export functionality (CSV)
- ?? **Settings**: Company details, tax rates, currency, and theme preferences
- ?? **Dark Mode**: Toggle between light and dark themes
- ?? **Local Storage**: Persistent data storage
- ?? **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Material UI v5** - Component library
- **React Router DOM** - Routing
- **Recharts** - Chart library
- **Formik + Yup** - Form handling and validation
- **Context API** - State management
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
??? components/
?   ??? layout/
?   ?   ??? Layout.jsx          # Main layout wrapper
?   ?   ??? TopAppBar.jsx       # Top navigation bar
?   ?   ??? Sidebar.jsx         # Sidebar navigation
?   ??? StatusChip.jsx          # Status indicator component
?   ??? InvoiceCard.jsx         # Invoice card component
?   ??? Notification.jsx        # Notification context
??? context/
?   ??? AppContext.jsx          # Global state management
??? pages/
?   ??? Dashboard.jsx          # Dashboard page
?   ??? Invoices.jsx           # Invoices list page
?   ??? InvoiceForm.jsx        # Create/Edit invoice page
?   ??? Clients.jsx            # Clients management page
?   ??? Reports.jsx            # Reports & analytics page
?   ??? Settings.jsx           # Settings page
??? theme.js                   # MUI theme configuration
??? App.jsx                    # Main app component
??? main.jsx                   # Entry point
```

## Usage

### Dashboard
View overview statistics, revenue trends, and recent invoices.

### Invoices
- View all invoices in a sortable table
- Filter by status (Paid, Pending, Overdue)
- Search by invoice number or client name
- Create new invoices using the FAB button
- Edit or delete existing invoices

### Create/Edit Invoice
- Select client from dropdown
- Add invoice items with quantity and price
- Automatic calculation of subtotal, tax, and total
- Save as draft or send invoice

### Clients
- View all clients in a table
- Add new clients via modal dialog
- View client details and statistics
- Edit or delete clients

### Reports
- View revenue summaries
- Monthly revenue trends
- Payment status distribution
- Export data to CSV

### Settings
- Configure company information
- Set tax rate and currency
- Adjust payment terms
- Toggle dark/light mode

## Features in Detail

### Light/Dark Mode
Toggle between light and dark themes using the theme switcher in the AppBar. Your preference is saved to localStorage.

### Data Persistence
All invoices, clients, and company settings are automatically saved to localStorage and persist across page refreshes.

### Responsive Design
The sidebar automatically collapses to icons-only on smaller screens. The mobile view includes a hamburger menu for navigation.

### Status Management
Invoices can have three statuses:
- **Paid**: Green chip with checkmark icon
- **Pending**: Orange chip with clock icon
- **Overdue**: Red chip with error icon

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.