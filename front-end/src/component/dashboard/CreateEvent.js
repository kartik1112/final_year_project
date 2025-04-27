import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Switch,
  Button,
  Upload,
  message,
  Form,
  Typography,
  Tooltip,
  Divider,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  PlusOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
  ShareAltOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Qrcode from "./Qrcode";
import Upload_Img from "./Upload_Img";
import "./CreateEvent.css";

const { Title, Text, Paragraph } = Typography;

const CreateEvent = () => {
  const [event_name, setEventName] = useState("");
  const [pin, setPin] = useState("");
  const [switcher, setSwitcher] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [createEvent, setCreateEvent] = useState(false);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link");
      });
  };

  const make_event = async () => {
    if (!event_name.trim()) {
      message.error("Please enter an event name");
      return;
    }

    setLoading(true);

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        message.error("User not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userString);
      const created_id = user._id;

      // PIN validation
      if (switcher && pin.length > 6) {
        message.error("PIN cannot be more than 6 digits");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("event_name", event_name);
      formData.append("created_id", created_id);
      formData.append("pin", pin);

      // Add the selected image file
      if (fileList[0]) {
        formData.append("event_photo", fileList[0].originFileObj);
      }

      // Send request to create event
      let result = await fetch("http://localhost:5000/event", {
        method: "POST",
        body: formData,
      });

      result = await result.json();

      if (result.event_name && result._id) {
        message.success(`Event "${result.event_name}" created successfully!`);
        setUrl(`http://localhost:3000/collect/${result._id}`);
        setCreateEvent(true);
        setResult(result);
        // Don't reset form fields to allow additional uploads
      } else {
        message.error(result.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("An error occurred while creating the event");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventName("");
    setPin("");
    setSwitcher(false);
    setFileList([]);
    setCreateEvent(false);
    setUrl("");
    setResult("");
  };

  return (
    <div className="create-event-container">
      <Title level={2} className="page-title">
        Create New Event
      </Title>
      <Paragraph className="page-description">
        Create a new event to collect and share photos with your guests
      </Paragraph>

      <Row gutter={[24, 24]} className="content-row">
        <Col
          xs={24}
          md={createEvent ? 12 : 24}
          lg={createEvent ? 10 : 16}
          className="form-column"
        >
          <Card
            className="create-event-card"
            title={
              <div className="card-title-container">
                <div className="card-icon-bg">
                  <UploadOutlined className="card-icon" />
                </div>
                <span>Event Details</span>
              </div>
            }
            bordered={false}
          >
            <Form layout="vertical" className="create-event-form">
              <Form.Item
                label="Event Name"
                required
                tooltip="Give your event a memorable name"
              >
                <Input
                  type="text"
                  onChange={(e) => setEventName(e.target.value)}
                  value={event_name}
                  placeholder="Enter event name (e.g. Summer Wedding 2025)"
                  size="large"
                  prefix={<ShareAltOutlined style={{ color: "#8b5cf6" }} />}
                  className="styled-input"
                />
              </Form.Item>

              <Form.Item
                label="Event Cover Image"
                tooltip="Add a cover image for your event (optional)"
              >
                <ImgCrop rotationSlider aspect={16 / 9}>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    className="cover-upload"
                    accept="image/*"
                  >
                    {fileList.length < 1 && (
                      <div className="upload-placeholder">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload Cover</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>

              <div className="security-section">
                <Divider>
                  <Text type="secondary">Security Options</Text>
                </Divider>

                <div className="switch-container">
                  <div className="switch-label">
                    <div className="switch-title">
                      <Text strong>PIN Protection</Text>
                      <Tooltip title="Add a PIN code to restrict access to your event">
                        <QuestionCircleOutlined className="help-icon" />
                      </Tooltip>
                    </div>
                    <Text type="secondary" className="switch-description">
                      Only people with the PIN can access this event
                    </Text>
                  </div>
                  <Switch
                    onChange={() => {
                      if (switcher) {
                        setSwitcher(false);
                        setPin("");
                      } else {
                        setSwitcher(true);
                      }
                    }}
                    checked={switcher}
                    checkedChildren={<LockOutlined />}
                    unCheckedChildren={<UnlockOutlined />}
                    className="styled-switch"
                  />
                </div>

                {switcher && (
                  <Form.Item
                    label="6-digit PIN Code"
                    className="pin-input-container"
                  >
                    <Input
                      type="number"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter 6-digit PIN"
                      maxLength={6}
                      size="large"
                      prefix={<LockOutlined style={{ color: "#8b5cf6" }} />}
                      className="styled-input pin-input"
                    />
                  </Form.Item>
                )}
              </div>

              <div className="form-actions">
                <Button
                  onClick={make_event}
                  type="primary"
                  size="large"
                  className="create-button"
                  disabled={!event_name || loading}
                  loading={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </Button>

                {createEvent && (
                  <Button
                    onClick={resetForm}
                    size="large"
                    className="reset-button"
                  >
                    Create Another Event
                  </Button>
                )}
              </div>
            </Form>
          </Card>
        </Col>

        {createEvent && (
          <Col xs={24} md={12} lg={14} className="share-column">
            <div className="event-created-section">
              <Card
                className="share-card"
                bordered={false}
                title={
                  <div className="card-title-container">
                    <div className="card-icon-bg success-bg">
                      <LinkOutlined className="card-icon" />
                    </div>
                    <span>Share Your Event</span>
                  </div>
                }
              >
                <div className="success-message">
                  <Title level={4} className="congrats-text">
                    🎉 Your event "{result.event_name}" has been created!
                  </Title>
                  <Paragraph className="share-description">
                    Share this link with guests to collect photos
                  </Paragraph>
                </div>

                <div className="share-link">
                  <Input
                    value={url}
                    readOnly
                    className="link-input"
                    size="large"
                  />
                  <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(url)}
                    size="large"
                    className="copy-button"
                  >
                    Copy Link
                  </Button>
                </div>

                <div className="qr-section">
                  <Title level={4} className="qr-title">
                    <QrCode className="qr-icon" /> QR Code
                  </Title>
                  <Paragraph className="qr-description">
                    Guests can scan this QR code to access the event
                  </Paragraph>
                  <div className="qr-container">
                    <Qrcode url={url} size={200} />
                  </div>
                </div>
              </Card>

              <Card
                className="upload-card"
                bordered={false}
                title={
                  <div className="card-title-container">
                    <div className="card-icon-bg upload-bg">
                      <UploadOutlined className="card-icon" />
                    </div>
                    <span>Upload Photos</span>
                  </div>
                }
              >
                <Paragraph className="upload-description">
                  Start adding photos to your event
                </Paragraph>
                <Upload_Img event_id={result._id} />
              </Card>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

// Helper component for QR icon
const QrCode = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="6" height="6" x="3" y="3" rx="1" />
    <rect width="6" height="6" x="15" y="3" rx="1" />
    <rect width="6" height="6" x="3" y="15" rx="1" />
    <path d="M15 15h.01M15 18h.01M18 15h.01M18 18h.01M21 21v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
  </svg>
);

export default CreateEvent;
