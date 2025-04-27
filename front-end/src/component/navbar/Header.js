import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    // Close mobile menu when route changes
    useEffect(() => {
        setExpanded(false);
    }, [location]);

    return (
        <Navbar 
            expand="lg" 
            fixed="top"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <span className="logo-icon">📸</span>
                        <span className="logo-text">PhotoShare</span>
                    </div>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="navbar-nav">
                    <div className="toggle-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </Navbar.Toggle>
                
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/about" 
                            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                        >
                            About
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/features" 
                            className={`nav-link ${location.pathname === '/features' ? 'active' : ''}`}
                        >
                            Features
                        </Nav.Link>
                    </Nav>
                    
                    <div className="navbar-buttons">
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;