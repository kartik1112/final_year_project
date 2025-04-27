import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, message, Spin } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import './style.css';
import Footer from "../Footer";
import Header from "../navbar/Header";

const Login_Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            let result = await fetch('http://localhost:5000/register', {
                method: 'post',
                body: JSON.stringify({ name, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (result.ok) {
                navigate(`/emailverified`, {
                    state: {
                        email: email, 
                        password: password 
                    }
                });
            } else {
                result = await result.json();
                message.error(result.message);
            }
        } catch (error) {
            message.error("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            let result = await fetch('http://localhost:5000/login', {
                method: "post",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (result.ok) {
                result = await result.json();
                localStorage.setItem("user", JSON.stringify(result));
                navigate("/dashboard");
            } else {
                result = await result.json();
                message.error(result.message);
            }
        } catch (error) {
            message.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Simplified toggle functions using React state
    const toggleSignup = () => {
        setIsSignUp(true);
    };
    
    const toggleSignin = () => {
        setIsSignUp(false);
    };

    return (
        <div className="auth-page">
            <Header />
            
            <div className="auth-content">
                <div className="animated-background"></div>
                
                <div className={`auth-container ${isSignUp ? 'active' : ''}`}>
                    {/* Register Form */}
                    <div className="form-container register-container">
                        <form onSubmit={handleRegister}>
                            <h1 className="auth-title">Create Account</h1>
                            <p className="auth-subtitle">Start your journey with PhotoShare</p>
                            
                            <div className="form-group">
                                <UserOutlined className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <MailOutlined className="input-icon" />
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <LockOutlined className="input-icon" />
                                <Input.Password 
                                    placeholder="Password (min. 8 characters)" 
                                    minLength="8"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="custom-password-input"
                                />
                            </div>
                            
                            <button type="submit" className="auth-button" disabled={isLoading}>
                                {isLoading ? <Spin size="small" /> : "Create Account"}
                            </button>
                            
                            {/* <div className="auth-separator">
                                <span>or sign up with</span>
                            </div>
                            
                            <div className="social-login">
                                <button type="button" className="social-button google">
                                    <img src="/images/google.svg" alt="Google" />
                                </button>
                                <button type="button" className="social-button facebook">
                                    <img src="/images/facebook.svg" alt="Facebook" />
                                </button>
                            </div> */}
                        </form>
                    </div>
                    
                    {/* Login Form */}
                    <div className="form-container login-container">
                        <form onSubmit={handleLogin}>
                            <h1 className="auth-title">Welcome Back</h1>
                            <p className="auth-subtitle">Log in to access your account</p>
                            
                            <div className="form-group">
                                <MailOutlined className="input-icon" />
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <LockOutlined className="input-icon" />
                                <Input.Password 
                                    placeholder="Password" 
                                    minLength="8"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="custom-password-input"
                                />
                            </div>
                            
                            <div className="form-options">
                                <Link to="/forgetpassword" className="forgot-password">
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <button type="submit" className="auth-button" disabled={isLoading}>
                                {isLoading ? <Spin size="small" /> : "Sign In"}
                            </button>
                            
                            {/* Uncomment if you want social login for sign-in too */}
                            {/* <div className="auth-separator">
                                <span>or sign in with</span>
                            </div>
                            
                            <div className="social-login">
                                <button type="button" className="social-button google">
                                    <img src="/images/google.svg" alt="Google" />
                                </button>
                                <button type="button" className="social-button facebook">
                                    <img src="/images/facebook.svg" alt="Facebook" />
                                </button>
                            </div> */}
                        </form>
                    </div>
                    
                    {/* Overlay Container */}
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1 className="overlay-title">Welcome Back!</h1>
                                <p className="overlay-text">
                                    Already have an account? Sign in to continue your journey with PhotoShare.
                                </p>
                                <button 
                                    className="ghost overlay-button" 
                                    onClick={toggleSignin}
                                    type="button"
                                >
                                    Sign In
                                </button>
                            </div>
                            
                            <div className="overlay-panel overlay-right">
                                <h1 className="overlay-title">Hello, Friend!</h1>
                                <p className="overlay-text">
                                    Enter your details and start your journey with PhotoShare today.
                                </p>
                                <button 
                                    className="ghost overlay-button" 
                                    onClick={toggleSignup}
                                    type="button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Login_Register;