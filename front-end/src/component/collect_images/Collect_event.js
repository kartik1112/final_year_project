import React, { useEffect, useState } from "react";
import { 
  Button, 
  Form, 
  Input, 
  message, 
  Card, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Spin, 
  Tabs, 
  Empty, 
  Avatar 
} from "antd";
import { 
  KeyOutlined, 
  CameraOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  UploadOutlined,
  ShopOutlined,
  GiftOutlined,
  SearchOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import "./CollectEvent.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Collect_event = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const result = await fetch('http://localhost:5000/collect_event', {
        method: 'POST',
        body: JSON.stringify({ _id: eventId }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result.ok) {
        const data = await result.json();
        setEvent(data.event);
        setStudio(data.studio);
      } else {
        const error = await result.json();
        message.error(error.message || "Failed to load event");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      message.error("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await fetch('http://localhost:5000/confirm_pin', {
        method: "POST",
        body: JSON.stringify({ 
          _id: eventId, 
          pin: values.pin 
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await result.json();
      
      if (data.pin) {
        message.success(data.result);
        // Navigate to camera page with event ID
        navigate("/camera", { state: eventId });
      } else {
        message.error(data.result || "Invalid PIN");
      }
    } catch (error) {
      console.error("Error validating PIN:", error);
      message.error("Failed to validate PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToFaceSearch = () => {
    navigate(`/face-search/${eventId}`, { 
      state: { 
        eventName: event?.event_name,
        requiresPin: !!event?.pin,
        pin: pin
      } 
    });
  };

  if (loading) {
    return (
      <div className="collect-loading-container">
        <Spin size="large" />
        <Text className="loading-text">Loading event details...</Text>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="collect-error-container">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Event not found or no longer available"
        />
        <Button type="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="collect-event-container">
      <Card className="event-header-card">
        <Title level={2} className="event-title">
          {event.event_name}
        </Title>
        <Paragraph className="event-description">
          Welcome! You can find and download your photos from this event.
        </Paragraph>
        
        {event.pin && (
          <div className="pin-protected-banner">
            <LockOutlined className="lock-icon" />
            <Text>This event is PIN protected</Text>
          </div>
        )}
      </Card>

      <Row gutter={[24, 24]} className="content-row">
        <Col xs={24} md={event.pin ? 12 : 24} lg={event.pin ? 14 : 24} className="main-column">
          <Card className="action-card">
            <Title level={4} className="card-title">
              <SearchOutlined className="card-icon" /> Find Your Photos
            </Title>
            
            <Paragraph className="action-description">
              We can find photos that include you using facial recognition. 
              Take or upload a selfie, and we'll match it with event photos.
            </Paragraph>
            
            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                onClick={navigateToFaceSearch}
                className="action-button camera-button"
              >
                Find My Photos
              </Button>
              {/* <Button
                size="large"
                icon={<UploadOutlined />}
                className="action-button upload-button"
                onClick={() => navigate(`/upload/${eventId}`)}
              >
                Upload Photos to Event
              </Button> */}
            </div>
          </Card>
          
          {studio && (
            <Card className="studio-card">
              <div className="studio-header">
                <Avatar 
                  size={64} 
                  icon={<ShopOutlined />} 
                  className="studio-avatar"
                />
                <div className="studio-info">
                  <Title level={4} className="studio-name">
                    {studio.studio_name}
                  </Title>
                  <Text type="secondary">Event Photographer</Text>
                </div>
              </div>
              
              <Divider />
              
              <Row gutter={[16, 16]} className="studio-details">
                <Col xs={24} md={12}>
                  <div className="detail-item">
                    <PhoneOutlined className="detail-icon" />
                    <div>
                      <Text strong>Contact Number</Text>
                      <div>{studio.phone_no}</div>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} md={12}>
                  <div className="detail-item">
                    <HomeOutlined className="detail-icon" />
                    <div>
                      <Text strong>Studio Address</Text>
                      <div>{studio.address}</div>
                    </div>
                  </div>
                </Col>
                
                {studio.offer && (
                  <Col xs={24}>
                    <div className="detail-item">
                      <GiftOutlined className="detail-icon" />
                      <div>
                        <Text strong>Special Offers</Text>
                        <div>{studio.offer}</div>
                      </div>
                    </div>
                  </Col>
                )}
                
                {studio.description && (
                  <Col xs={24}>
                    <div className="detail-item">
                      <InfoCircleOutlined className="detail-icon" />
                      <div>
                        <Text strong>About Studio</Text>
                        <Paragraph>{studio.description}</Paragraph>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          )}
        </Col>
        
        {event.pin && (
          <Col xs={24} md={12} lg={10} className="pin-column">
            <Card className="pin-card">
              <Title level={4} className="card-title">
                <KeyOutlined className="card-icon" /> Enter Event PIN
              </Title>
              
              <Paragraph className="pin-description">
                This event is protected with a PIN code. Please enter the PIN provided by the event organizer.
              </Paragraph>
              
              <Form
                form={form}
                onFinish={handlePinSubmit}
                layout="vertical"
                className="pin-form"
              >
                <Form.Item
                  name="pin"
                  rules={[
                    { required: true, message: 'Please enter the event PIN' },
                    { max: 6, message: 'PIN cannot be more than 6 digits' }
                  ]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    maxLength={6}
                    size="large"
                    placeholder="Enter 6-digit PIN"
                    onChange={e => setPin(e.target.value)}
                    className="pin-input"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="submit-pin-button"
                  >
                    Verify PIN
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Collect_event;