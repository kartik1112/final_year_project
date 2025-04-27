import React, { useEffect } from "react";
import Goal from "./home/Goal";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./navbar/Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import "./About.css"; // We'll create this file next

const About = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <>
            <Header />
            
            <div className="about-hero">
                <div className="animated-background"></div>
                <Container className="position-relative">
                    <Row className="align-items-center py-5">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <div className="about-content">
                                <h1 className="display-4 fw-bold mb-4 slide-in">Contribution</h1>
                                <p className="lead mb-4 fade-in" style={{animationDelay: '0.2s'}}>
                                    This project, a Photo Sharing Website with Powerful Face Recognition, 
                                    was developed by Azeem Khan and Kartik Buttan and Bhavya Jain as part of our final year project.
                                </p>
                                <p className="fade-in" style={{animationDelay: '0.4s'}}>
                                    Together, we collaborated on testing, debugging, and refining the system 
                                    to ensure it meets user requirements and delivers an efficient photo-sharing 
                                    platform enhanced with face recognition capabilities.
                                </p>
                                <div className="mt-5 slide-up" style={{animationDelay: '0.6s'}}>
                                    <a href="https://github.com/kartik1112" className="btn btn-primary me-3 pulse-btn">
                                        View Project <i className="ms-2">→</i>
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="about-image-container bounce-in">
                                <img 
                                    src="/person/we.jpg" 
                                    alt="Project Developers" 
                                    className="about-image" 
                                />
                                <div className="image-decoration"></div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="tech-section py-5">
                <Container>
                    <h2 className="text-center mb-5 slide-in">Technologies Used</h2>
                    <Row className="justify-content-center">
                        {['React', 'Node.js', 'Express', 'MongoDB', 'Face-API.js'].map((tech, index) => (
                            <Col key={index} xs={6} md={4} lg={2} className="mb-4">
                                <div className="tech-badge fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                                    {tech}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <Goal />
            <Footer />
        </>
    );
};

export default About;