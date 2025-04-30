import Navbar from './components/Navbar';
import SearchResultsPage from './components/SearchResultsPage';
import HomePage from './components/HomePage';
import PropertyDetails from './components/PropertyDetails';
import PropertyCreatePage from './components/PropertyCreatePage';
import PropertyEditPage from './components/PropertyEditPage';
import PropertyManagementPage from './components/PropertyManagementPage';
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
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/property/create" element={<PropertyCreatePage />} />
                    <Route path="/property/edit/:id" element={<PropertyEditPage />} />
                    <Route path="/my-properties" element={<PropertyManagementPage />} />
                </Routes>
            </Router>
        </main>
    )
}

export default Layout