import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import './Footer.css'; // Make sure to create this CSS file

const Footer = () => {
    const [apiStatus, setApiStatus] = useState('loading');
    
    useEffect(() => {
        const checkApiHealth = async () => {
            try {
                // Replace with your actual API health endpoint
                const response = await fetch('/api/health', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    console.log('API is online');
                    setApiStatus('online');
                } else {
                    setApiStatus('offline');
                }
            } catch (error) {
                setApiStatus('offline');
            }
        };
        
        checkApiHealth();
        const interval = setInterval(checkApiHealth, 60000); // Check every minute (60000ms)
        
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="colorful-footer py-4 mt-auto overflow-hidden">
            {/* <div className="animated-background"></div> */}
            <div className="container position-relative">
                <div className="row align-items-center justify-content-between">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="brand-container fade-in">
                            <h5 className="footer-brand bounce-in">PhotoShare</h5>
                            <p className="text-light slide-in">AI-powered photo sharing platform</p>
                        </div>
                    </div>
                    
                    {/* <div className="col-md-4 mb-4 mb-md-0">
                        <Nav className="footer-nav justify-content-center">
                            <Nav.Link as={Link} to="/" className="nav-item px-2 slide-up">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about" className="nav-item px-2 slide-up" style={{animationDelay: '0.1s'}}>About</Nav.Link>
                            <Nav.Link as={Link} to="/login" className="nav-item px-2 slide-up" style={{animationDelay: '0.2s'}}>Login</Nav.Link>
                        </Nav>
                    </div> */}
                    
                    <div className="col-md-4 d-flex justify-content-md-end">
                        <div className="api-status-container fade-in">
                            <div className="api-status d-flex align-items-center">
                                <span className="me-2 text-light">API Status:</span>
                                <div className={`status-badge ${apiStatus}`}>
                                    {apiStatus === 'online' ? 'Online ✓' : 
                                     apiStatus === 'offline' ? 'Offline ✗' : 
                                     'Checking ⟳'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-4 pt-3 border-top border-light border-opacity-25">
                    <p className="text-light mb-0 pulse">© {new Date().getFullYear()} PhotoShare • A Final Year Project</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;