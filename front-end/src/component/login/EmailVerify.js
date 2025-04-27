import React, { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Header from '../navbar/Header';
import Footer from '../Footer';
import './EmailVerify.css';

const Verified = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const { email, password } = location.state || {};
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');

        const auth = localStorage.getItem("user")
        if (auth) {
            navigate("/dashboard")
        }

        // Check verification status immediately
        if (email && password) {
            checkVerificationStatus();
        }

        // Optional: Auto-redirect to dashboard after successful verification
        if (status === 'success') {
            message.success("Email verified successfully!")
        }
    }, [location, navigate, email, password]);

    const checkVerificationStatus = async () => {
        setVerifyLoading(true);
        try {
            const response = await fetch('http://localhost:5000/check-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.name && data._id) {
                message.success("Verified successfully")
                localStorage.setItem("user", JSON.stringify(data))
                navigate('/dashboard'); // Redirect if already verified
            } else {
                message.warning(data.message)
            }
        } catch (error) {
            message.error('Error checking verification status. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        
        if (countdown > 0) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            message.info(data.message);
            setResendStatus(data.message || 'Verification email resent.');
            
            // Start countdown for resend button
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            setResendStatus('Failed to resend the verification email. Please try again.');
            message.error('Failed to resend verification email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="email-verify-page">
            <Header />
            
            <div className="verify-content">
                <div className="animated-background"></div>
                
                <div className="verify-container">
                    <div className="mail-icon">
                        <MailOutlined />
                    </div>
                    
                    <h1 className="verify-title">Verify Your Email</h1>
                    
                    <div className="verify-message">
                        <p className="email-address">{email}</p>
                        <p className="verify-instructions">
                            We've sent a verification link to your email. 
                            Please check your inbox and click the link to verify your account.
                        </p>
                    </div>
                    
                    <div className="verify-actions">
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />}
                            className="verify-button"
                            onClick={checkVerificationStatus}
                            loading={verifyLoading}
                            size="large"
                        >
                            I've Verified My Email
                        </Button>
                        
                        <Button 
                            type="default"
                            icon={<ReloadOutlined spin={isLoading} />}
                            onClick={handleResend}
                            disabled={isLoading || countdown > 0}
                            className="resend-button"
                            size="large"
                        >
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                        </Button>
                    </div>
                    
                    {resendStatus && <p className="status-message">{resendStatus}</p>}
                    
                    <div className="verify-help">
                        <p>
                            Didn't receive the email? Check your spam folder or
                            <Link to="/login" className="verify-link"> try another email address</Link>.
                        </p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Verified;