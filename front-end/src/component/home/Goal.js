import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Goal.css";

const Goal = () => {
    const steps = [
        {
            number: "01",
            title: "Create an Event",
            description: "Create a new event for your wedding, party or gathering."
        },
        {
            number: "02",
            title: "Upload Photos",
            description: "Upload your event photos to create a shared collection."
        },
        {
            number: "03",
            title: "Share with Guests",
            description: "Invite guests with a unique link or QR code."
        },
        {
            number: "04",
            title: "Face Recognition Magic",
            description: "Guests can find their photos by simply taking a selfie."
        }
    ];
    
    return (
        <div className="goal-section">
            {/* <div className="animated-background"></div> */}
            <Container className="position-relative">
                <Row className="align-items-center py-5">
                    <Col lg={5} className="mb-5 mb-lg-0">
                        <div className="goal-content">
                            <p className="overline slide-in">HOW DOES IT WORK</p>
                            <h2 className="display-5 fw-bold mb-4 fade-in">How To Collect Your Wedding Photos?</h2>
                            
                            <div className="steps-container mt-5">
                                {steps.map((step, index) => (
                                    <div 
                                        key={index} 
                                        className="step-item slide-up"
                                        style={{animationDelay: `${0.2 * index}s`}}
                                    >
                                        <div className="step-number">{step.number}</div>
                                        <div className="step-details">
                                            <h5 className="step-title">{step.title}</h5>
                                            <p className="step-description">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col lg={7} className="video-container">
                        <div className="video-wrapper bounce-in">
                            <video 
                                className="goal-video"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/images/Share_Event.mp4" type="video/mp4" />
                            </video>
                            <div className="video-decoration"></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Goal;