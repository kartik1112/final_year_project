import React, { useState } from "react";
import { Button, Form, Input, message, Steps, Spin } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Header from "../navbar/Header";
import Footer from "../Footer";
import './ForgetPassword.css';

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPassword, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const handleSendOTP = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      message.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      let result = await fetch('http://localhost:5000/send-otp', {
        method: "post",
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (result.ok) {
        result = await result.json();
        message.success(result.message);
        setCurrentStep(1);
      } else {
        result = await result.json();
        message.warning(result.message);
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      message.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    if (!newPassword || newPassword.length < 8) {
      message.error('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    try {
      let result = await fetch('http://localhost:5000/newPassword-verify-otp', {
        method: "post",
        body: JSON.stringify({ otp, email, newpassword: newPassword }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (result.ok) {
        result = await result.json();
        message.success(result.message);
        setCurrentStep(2);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        result = await result.json();
        message.warning(result.message);
      }
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Email',
      content: (
        <div className="step-content">
          <h2>Forgot Your Password?</h2>
          <p className="step-description">
            Don't worry! Enter your email address and we'll send you a verification code.
          </p>
          
          <Form layout="vertical" className="recovery-form">
            <Form.Item
              label="Email Address"
              required
              tooltip="We'll send a verification code to this email"
            >
              <Input 
                prefix={<MailOutlined className="input-icon" />}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                onClick={handleSendOTP} 
                loading={loading}
                size="large"
                className="action-button"
                block
              >
                Send Verification Code
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: 'Verification',
      content: (
        <div className="step-content">
          <h2>Verify Your Identity</h2>
          <p className="step-description">
            We've sent a 6-digit verification code to <strong>{email}</strong>. 
            Enter the code below to continue.
          </p>
          
          <Form layout="vertical" className="recovery-form">
            <Form.Item
              label="Verification Code"
              required
              tooltip="Check your email inbox for the 6-digit code"
            >
              <Input.OTP
                inputType="numeric"
                length={6}
                onChange={setOTP}
                size="large"
                className="otp-input"
              />
            </Form.Item>
            
            <Form.Item
              label="New Password"
              required
              tooltip="Must be at least 8 characters long"
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a new password"
                size="large"
              />
            </Form.Item>
            
            <div className="form-actions">
              <Button 
                onClick={() => setCurrentStep(0)}
                size="large"
              >
                Back
              </Button>
              
              <Button 
                type="primary" 
                onClick={handleVerifyOTP} 
                loading={loading}
                size="large"
                className="action-button"
              >
                Reset Password
              </Button>
            </div>
            
            <Button 
              type="link" 
              onClick={handleSendOTP} 
              disabled={loading}
              className="resend-link"
            >
              Didn't receive the code? Send again
            </Button>
          </Form>
        </div>
      ),
    },
    {
      title: 'Success',
      content: (
        <div className="step-content success-step">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" width="100" height="100">
              <path fill="#4CAF50" d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm5.292,9.293-6.5,6.5a1,1,0,0,1-1.414,0l-3.5-3.5a1,1,0,0,1,1.414-1.414L10,13.586l5.793-5.793a1,1,0,0,1,1.414,1.414Z"/>
            </svg>
          </div>
          <h2>Password Reset Successful!</h2>
          <p className="step-description">
            Your password has been reset successfully. Redirecting you to the login page...
          </p>
          <Spin />
        </div>
      ),
    },
  ];

  return (
    <div className="password-recovery-page">
      <Header />
      
      <div className="recovery-content">
        <div className="animated-background"></div>
        
        <div className="recovery-container">
          <Steps
            current={currentStep}
            items={steps.map(item => ({ title: item.title }))}
            className="recovery-steps"
          />
          
          <div className="steps-content">
            {steps[currentStep].content}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgetPass;