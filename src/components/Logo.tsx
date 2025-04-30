import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import logoImage from '../assets/airbnb-logo.png';

interface LogoProps {
    onLogoClick?: () => any;
}

const Logo: React.FC<LogoProps> = ({ onLogoClick }) => {
    const handleClick = () => {
        // Call the onLogoClick function if provided
        if (onLogoClick) {
            onLogoClick();
        }
    };

    return (
        <div className="p-4">
            <Link to="/" onClick={handleClick}>
                <img
                    src={logoImage}
                    alt="Logo"
                    className="w-20 h-auto object-contain"
                />
            </Link>
        </div>
    );
};

export default Logo;