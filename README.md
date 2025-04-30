# Airbnb Clone

This project is a React-based Airbnb clone, built with TypeScript, Tailwind CSS, and Vite. It provides a responsive user interface for searching and browsing vacation rentals.

## Features

- Responsive design that works on mobile and desktop
- Property search with destination, dates, and guest selection
- Currency switching
- Property listing grid with details
- Navigation and user profile menu

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/airbnb-clone.git
cd airbnb-clone
```

2. Install dependencies:
```bash
npm install
```
or
```bash
yarn
```

## Running the Application

To start the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

This will start the Vite development server, typically at http://localhost:5173.

## Building for Production

To create a production build:

```bash
npm run build
```
or
```bash
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── assets/        # Images and static assets
├── components/    # React components
│   ├── CondensedView.tsx     # Compact search bar
│   ├── CurrencySwitcher.tsx  # Currency selection dropdown
│   ├── DatePicker.tsx        # Date input component
│   ├── DestinationInput.tsx  # Location input component
│   ├── GuestSelector.tsx     # Guest count selector
│   ├── HomePage.tsx          # Main landing page
│   ├── Logo.tsx              # Website logo component
│   ├── NavBar.tsx            # Main navigation bar
│   ├── Profile.tsx           # User profile menu
│   ├── PropertyCard.tsx      # Individual property listing
│   ├── PropertyGrid.tsx      # Grid of property listings
│   ├── SearchBar.tsx         # Main search component
│   ├── SearchResultsPage.tsx # Search results page
│   └── useDropdown.tsx       # Custom dropdown hook
├── index.css      # Global styles
├── main.tsx       # Application entry point
└── vite.config.js # Vite configuration
```

## Technology Stack

- **React**: Frontend UI library
- **TypeScript**: Static typing for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Frontend build tool
- **React Router**: Navigation and routing
- **Lucide Icons**: SVG icon library

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying the Tailwind configuration or by adding custom CSS in the `index.css` file.

### Mock Data

The application currently uses mock data for property listings. In a real-world scenario, you would connect to an API to fetch property data. The mock data is defined in `PropertyGrid.tsx`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Airbnb
- Icons from Lucide React