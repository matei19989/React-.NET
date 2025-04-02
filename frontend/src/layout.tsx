import Navbar from './components/Navbar';
import SearchResultsPage from './components/SearchResultsPage.js';
import HomePage from './components/HomePage';
import PropertyDetails from './components/PropertyDetails'; // Import the PropertyDetails component
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './layout.css'

function Layout() {

    // @ts-ignore
    return (
        <main>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/property/:id" element={<PropertyDetails />} /> {/* Add route for property details */}
                </Routes>
            </Router>
        </main>
    )
}

export default Layout