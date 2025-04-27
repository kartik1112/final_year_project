import React, { useEffect, useState } from "react";
import { 
  Image, 
  message, 
  Button, 
  FloatButton, 
  Popconfirm, 
  Input, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Tabs, 
  Modal, 
  Form, 
  Empty, 
  Tag,
  Tooltip,
  Badge,
  Skeleton
} from 'antd';
import { 
  DeleteOutlined, 
  RollbackOutlined, 
  CopyOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  PictureOutlined,
  QrcodeOutlined,
  LinkOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Upload_Img from "./Upload_Img";
import Qrcode from "./Qrcode";
import './InEvent.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InEvent = ({ backbtn, eventID, name, pin, setRefresh }) => {
  const [images, setImages] = useState([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [url, setUrl] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updatePin, setUpdatePin] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  function refreshData() {
    setRefresh(prev => prev + 1);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy: " + err.message);
      });
  };

  useEffect(() => {
    setUrl(`http://localhost:3000/collect/${eventID}`);
    setUpdateName(name);
    setUpdatePin(pin || '');

    const fetchImages = async () => {
      setLoading(true);
      try {
        const _id = eventID;
        let result = await fetch('http://localhost:5000/in-event', {
          method: "post",
          body: JSON.stringify({ _id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        result = await result.json();
        if (Array.isArray(result)) {
          setImages(result);
        } else {
          message.error("Images not found!");
          setImages([]);
        }
      } catch (error) {
        message.error("Error fetching images");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [eventID, name, pin]);

  const handleDeleteEvent = async () => {
    try {
      const _id = eventID;
      let result = await fetch('http://localhost:5000/delete-event', {
        method: "delete",
        body: JSON.stringify({ _id }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result.ok) {
        result = await result.json();
        message.success(`Event "${result.event_name}" has been deleted!`);
        setDeleteModalVisible(false);
        backbtn();
      } else {
        result = await result.json();
        message.error(result.message);
      }
    } catch (error) {
      message.error("Failed to delete event: " + error.message);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      if (!updateName.trim()) {
        message.error("Event name cannot be empty");
        return;
      }
      
      let result = await fetch(`http://localhost:5000/events/${eventID}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateName, updatePin }),
      });

      if (result.ok) {
        result = await result.json();
        message.success(result.message);
        setIsEditing(false);
        // Refresh the data
        setRefresh(prev => prev + 1);
      } else {
        result = await result.json();
        message.error(result.message);
      }
    } catch (error) {
      message.error('Error updating event: ' + error.message);
    }
  };

  const handleDeleteImage = async (imageName, imageId) => {
    try {
      let result = await fetch('http://localhost:5000/delete-image', {
        method: "delete",
        body: JSON.stringify({ name: imageName, _id: imageId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      result = await result.json();
      
      if (result.success) {
        message.success("Image deleted successfully!");
        setImages(images.filter(image => image.name !== imageName));
        setModalVisible(false);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Failed to delete image: " + error.message);
    }
  };

  const showImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <div className="in-event-container">
      <Card className="event-header-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            {isEditing ? (
              <Form layout="vertical" className="edit-event-form">
                <Form.Item label="Event Name" required>
                  <Input 
                    value={updateName} 
                    onChange={(e) => setUpdateName(e.target.value)}
                    placeholder="Enter event name"
                  />
                </Form.Item>
                <Form.Item label="PIN Protection (Optional)">
                  <Input 
                    value={updatePin} 
                    onChange={(e) => setUpdatePin(e.target.value)}
                    placeholder="Leave empty for no PIN"
                    maxLength={6}
                  />
                </Form.Item>
                <div className="edit-actions">
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleUpdateEvent}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    icon={<CloseOutlined />} 
                    onClick={() => {
                      setIsEditing(false);
                      setUpdateName(name);
                      setUpdatePin(pin || '');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <div className="event-title-container">
                  <Title level={3} className="event-title">{name}</Title>
                  <Tooltip title="Edit event details">
                    <Button 
                      icon={<EditOutlined />} 
                      type="text" 
                      className="edit-event-btn"
                      onClick={() => setIsEditing(true)}
                    />
                  </Tooltip>
                </div>
                {pin && (
                  <Tag color="purple" className="pin-tag">
                    PIN Protected: {pin}
                  </Tag>
                )}
                <Paragraph className="sharing-instruction">
                  Share this link with guests to collect photos
                </Paragraph>
                <div className="share-link-container">
                  <Input 
                    value={url} 
                    readOnly 
                    addonAfter={
                      <Tooltip title="Copy link">
                        <CopyOutlined onClick={() => copyToClipboard(url)} className="copy-icon" />
                      </Tooltip>
                    }
                  />
                </div>
              </>
            )}
          </Col>
          <Col xs={24} md={8} className="qr-code-container">
            <Card className="qr-card">
              <div className="qr-header">
                <QrcodeOutlined />
                <Text strong>Scan to Contribute</Text>
              </div>
              <Qrcode url={url} />
            </Card>
          </Col>
        </Row>
        <div className="event-actions">
          <Button type="primary" icon={<UploadOutlined />} onClick={() => document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth' })}>
            Upload Photos
          </Button>
          <Button icon={<RollbackOutlined />} onClick={backbtn}>
            Back to Events
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => setDeleteModalVisible(true)}
          >
            Delete Event
          </Button>
        </div>
      </Card>

      <Tabs defaultActiveKey="1" className="event-tabs">
        <TabPane 
          tab={
            <span>
              <PictureOutlined /> Photos ({images.length})
            </span>
          } 
          key="1"
        >
          <div id="uploadSection" className="upload-section">
            <Card className="upload-card">
              <Title level={4}>Upload Photos to This Event</Title>
              <Upload_Img event_id={eventID} d_ref={refreshData} inevent={true} />
            </Card>
          </div>

          <div className="photo-gallery">
            {loading ? (
              <Row gutter={[16, 16]}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <Col xs={12} sm={8} md={6} lg={4} key={item}>
                    <Card className="image-card-skeleton">
                      <Skeleton.Image active className="gallery-skeleton" />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : images.length > 0 ? (
              <Row gutter={[16, 16]}>
                {images.map((image, index) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={index}>
                    <Badge 
                      count={index + 1} 
                      className="image-badge"
                      offset={[-8, 8]}
                    >
                      <Card 
                        className="image-card"
                        hoverable
                        bodyStyle={{ padding: 0 }}
                        cover={
                          <div 
                            className="image-container"
                            onMouseEnter={() => setHoveredImageIndex(index)}
                            onMouseLeave={() => setHoveredImageIndex(null)}
                          >
                            <div className="image-wrapper">
                              <Image
                                src={`http://localhost:5000/uploads/${image.name}`}
                                alt={`image ${index}`}
                                className="gallery-image"
                                preview={false}
                                fallback="data:image/png;base64,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"
                              />
                            </div>
                            
                            {hoveredImageIndex === index && (
                              <div className="image-hover-overlay">
                                <div className="image-hover-actions">
                                  <Button 
                                    type="primary" 
                                    shape="circle"
                                    icon={<EyeOutlined />}
                                    onClick={() => showImageModal(image)}
                                    className="view-btn"
                                    size="large"
                                  />
                                  <Button 
                                    type="primary" 
                                    danger 
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteImage(image.name, image._id)}
                                    className="delete-btn"
                                    size="large"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </Badge>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No photos uploaded yet"
              />
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Image Preview Modal */}
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={800}
        className="image-preview-modal"
        centered
      >
        {selectedImage && (
          <div className="modal-content">
            <Image
              src={`http://localhost:5000/uploads/${selectedImage.name}`}
              alt="Preview"
              className="preview-image"
            />
            <div className="modal-actions">
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteImage(selectedImage.name, selectedImage._id)}
              >
                Delete Image
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Event Confirmation Modal */}
      <Modal
        title="Delete Event"
        visible={deleteModalVisible}
        onOk={handleDeleteEvent}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        className="delete-event-modal"
      >
        <p>Are you sure you want to delete the event "{name}"?</p>
        <p>This will permanently delete all photos and event data. This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default InEvent;