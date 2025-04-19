# Countries Explorer

A React application that allows users to explore countries around the world using data from the REST Countries API. This project was developed as part of the Advanced Frontend Development course assignment.

## Live Demo

[View the live application](https://countries-explorer-app.netlify.app/)

## Features

- **User Authentication**: Secure login and signup functionality using Firebase Authentication
- **Countries Listing**: View a list of all countries with essential information
- **Country Details**: Detailed view of each country including:
  - Flag
  - Name (common and official)
  - Population
  - Region and Subregion
  - Capital
  - Languages
  - Currencies
  - Border Countries
- **Search Functionality**: Search for countries by name
- **Filter by Region**: Filter countries by continent/region
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Built with Bootstrap for a clean, modern interface

## Technologies Used

- **Frontend**: React (Functional Components)
- **Language**: JavaScript
- **CSS Framework**: Bootstrap & React-Bootstrap
- **Authentication**: Firebase Authentication
- **API**: REST Countries API
- **Testing**: Vitest, React Testing Library
- **Hosting**: Netlify
- **Build Tool**: Vite

## API Integration

The application integrates with the [REST Countries API](https://restcountries.com/) using the following endpoints:

1. `GET /all` - Fetch all countries
2. `GET /name/{name}` - Search countries by name
3. `GET /region/{region}` - Filter countries by region
4. `GET /alpha/{code}` - Get detailed information about a specific country

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/countries-explorer.git
   cd countries-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
countries-explorer/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── __tests__/
│   │   ├── CountryList.jsx
│   │   ├── CountryDetail.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── js/
│   │   └── firebase.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── countryService.js
│   ├── styles/
│   ├── test/
│   │   └── setup.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

## Deployment

The application is deployed on Netlify. To deploy your own version:

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to Netlify:
   - Create an account on [Netlify](https://www.netlify.com/)
   - Connect your GitHub repository
   - Configure the build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add your environment variables in the Netlify dashboard

## Testing

The application includes comprehensive tests for components and functionality:

- Unit tests for individual components
- Integration tests for API services
- Tests for authentication flow

Run tests with:
```
npm run test
```

## Challenges and Solutions

### Challenge 1: API Rate Limiting

**Problem**: The REST Countries API has rate limiting that could affect the application during high traffic.

**Solution**: Implemented caching of API responses and optimized API calls to minimize requests.

### Challenge 2: Authentication State Management

**Problem**: Managing user authentication state across the application.

**Solution**: Used React Context API to create an AuthContext that provides authentication state and methods to all components.

## Future Improvements

- Add a favorites feature to allow users to save their favorite countries
- Implement dark mode
- Add more detailed information about countries
- Improve performance with virtualized lists for large datasets
- Add more comprehensive test coverage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [REST Countries API](https://restcountries.com/) for providing the country data
- [Bootstrap](https://getbootstrap.com/) for the UI components
- [Firebase](https://firebase.google.com/) for authentication services
- [Vite](https://vitejs.dev/) for the build tooling
