import React, { useEffect, useState } from "react";
import { 
  Input, 
  Form, 
  Button, 
  message, 
  Card, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Skeleton,
  Space,
  Empty,
  Badge,
  Avatar,
  Upload,
  Tooltip
} from "antd";
import { 
  EditOutlined, 
  CameraOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  ShopOutlined,
  FileTextOutlined,
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  GiftOutlined
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "./PhotographerDetail.css";

const { Title, Text, Paragraph } = Typography;

const Photographer_detail = () => {
  const [studio_name, setName] = useState("");
  const [phone_no, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [offer, setOffer] = useState("");
  const [description, setDescription] = useState("");
  const [exist, setExist] = useState(false);
  const [studioData, setStudioData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchStudio = async () => {
      setLoading(true);
      let user = localStorage.getItem("user");
      if (!user) {
        message.error("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      user = JSON.parse(user);
      const create_by = user._id;

      try {
        const resp = await fetch(
          `http://localhost:5000/exist-studio?create_by=${create_by}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await resp.json();

        if (resp.ok && result.exist) {
          setStudioData(result.exist);
          setExist(true);
          // Set avatar if studio has one
          if (result.exist.avatar) {
            setAvatar(`http://localhost:5000/uploads/${result.exist.avatar}`);
            setFileList([
              {
                uid: '-1',
                name: 'studio_avatar.png',
                status: 'done',
                url: `http://localhost:5000/uploads/${result.exist.avatar}`,
              }
            ]);
          }
        } else {
          setExist(false);
        }
      } catch (error) {
        console.error("Error fetching studio:", error);
        message.error("Failed to load studio information");
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [refresh]);

  const handleForm = async (e) => {
    if (e) e.preventDefault();

    // Form validation
    if (!studio_name?.trim()) {
      message.error("Studio name is required");
      return;
    }

    if (!phone_no?.trim()) {
      message.error("Phone number is required");
      return;
    }

    if (!address?.trim()) {
      message.error("Studio address is required");
      return;
    }

    let user = localStorage.getItem("user");
    if (!user) {
      message.error("User not found. Please log in again.");
      return;
    }
    
    user = JSON.parse(user);
    const create_by = user._id;

    const formData = new FormData();
    formData.append("studio_name", studio_name);
    formData.append("phone_no", phone_no);
    formData.append("address", address);
    formData.append("offer", offer);
    formData.append("description", description);
    formData.append("create_by", create_by);

    // Add avatar if available
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    try {
      const endpoint = exist ? `http://localhost:5000/update-studio/${studioData._id}` : 'http://localhost:5000/studio';
      const method = exist ? "PUT" : "POST";
      
      setLoading(true);
      let resp = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      if (resp.ok) {
        resp = await resp.json();
        setRefresh((prev) => prev + 1);
        message.success(resp.message);
        setEditMode(false);
      } else {
        resp = await resp.json();
        message.error(resp.message || "Failed to save studio details");
      }
    } catch (error) {
      console.error("Error saving studio:", error);
      message.error("An unexpected error occurred while saving studio details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (editMode) {
      // Cancel edit mode
      setEditMode(false);
    } else {
      // Enter edit mode
      setEditMode(true);
      setName(studioData.studio_name || "");
      setPhone(studioData.phone_no || "");
      setAddress(studioData.address || "");
      setDescription(studioData.description || "");
      setOffer(studioData.offer || "");
    }
  };

  const handleAvatarChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  if (loading && !editMode) {
    return (
      <Card className="photographer-card loading-card">
        <Skeleton avatar active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <div className="photographer-detail-container">
      <Title level={2} className="page-title">
        <CameraOutlined className="title-icon" /> Studio Profile
      </Title>
      
      <Paragraph className="page-description">
        {exist ? 
          "Manage your studio details to attract potential clients" : 
          "Complete your studio profile to showcase your photography services"
        }
      </Paragraph>

      {exist && !editMode ? (
        <Card
          className="photographer-card"
          actions={[
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
              className="edit-button"
            >
              Edit Profile
            </Button>
          ]}
        >
          <div className="studio-profile">
            <div className="studio-header">
              <Badge
                count={
                  <Tooltip title="Professional Photographer">
                    <CameraOutlined style={{ color: '#f56a00' }} />
                  </Tooltip>
                }
                offset={[-5, 5]}
              >
                <Avatar 
                  size={100} 
                  src={avatar} 
                  icon={<CameraOutlined />}
                  className="studio-avatar"
                />
              </Badge>
              
              <div className="studio-title">
                <Title level={3}>{studioData.studio_name}</Title>
                <Space size="small" className="studio-tags">
                  <Badge color="green" text="Active" />
                  <Badge color="blue" text="Photographer" />
                </Space>
              </div>
            </div>

            <Divider />

            <Row gutter={[24, 24]} className="studio-details">
              <Col xs={24} md={12} className="detail-item">
                <Space align="start">
                  <PhoneOutlined className="detail-icon" />
                  <div>
                    <Text strong className="detail-label">Contact Number</Text>
                    <Paragraph className="detail-value">{studioData.phone_no || "Not provided"}</Paragraph>
                  </div>
                </Space>
              </Col>

              <Col xs={24} md={12} className="detail-item">
                <Space align="start">
                  <HomeOutlined className="detail-icon" />
                  <div>
                    <Text strong className="detail-label">Studio Address</Text>
                    <Paragraph className="detail-value">{studioData.address || "Not provided"}</Paragraph>
                  </div>
                </Space>
              </Col>

              <Col xs={24} className="detail-item">
                <Space align="start">
                  <GiftOutlined className="detail-icon" />
                  <div>
                    <Text strong className="detail-label">Services & Offers</Text>
                    <Paragraph className="detail-value">{studioData.offer || "No offers listed"}</Paragraph>
                  </div>
                </Space>
              </Col>

              <Col xs={24} className="detail-item">
                <Space align="start">
                  <FileTextOutlined className="detail-icon" />
                  <div>
                    <Text strong className="detail-label">About Studio</Text>
                    <Paragraph className="detail-value description-text">{studioData.description || "No description provided"}</Paragraph>
                  </div>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>
      ) : (
        <Card className="photographer-card form-card">
          <Form layout="vertical" className="studio-form">
            <div className="avatar-upload-container">
              <Upload
                listType="picture-circle"
                fileList={fileList}
                onChange={handleAvatarChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                showUploadList={false}
              >
                {fileList.length > 0 ? (
                  <div className="avatar-preview">
                    <img 
                      src={fileList[0].url || URL.createObjectURL(fileList[0].originFileObj)} 
                      alt="avatar" 
                      style={{ width: '100%', borderRadius: '50%' }} 
                    />
                  </div>
                ) : (
                  <div className="avatar-upload-button">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Studio Logo</div>
                  </div>
                )}
              </Upload>
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item 
                  label="Studio Name" 
                  required 
                  tooltip="Your photography business name"
                >
                  <Input
                    prefix={<ShopOutlined style={{ color: '#8b5cf6' }} />}
                    value={studio_name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your studio name"
                    className="styled-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item 
                  label="Phone Number" 
                  required
                  tooltip="Business contact number for clients"
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: '#8b5cf6' }} />}
                    type="tel"
                    value={phone_no}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter business phone number"
                    maxLength={13}
                    className="styled-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item 
                  label="Studio Address" 
                  required
                  tooltip="Physical location of your studio"
                >
                  <Input
                    prefix={<HomeOutlined style={{ color: '#8b5cf6' }} />}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your studio address"
                    className="styled-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item 
                  label="Services & Special Offers" 
                  tooltip="List your photography services and any special offers"
                >
                  <Input
                    prefix={<GiftOutlined style={{ color: '#8b5cf6' }} />}
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g., Wedding photography, Family portraits, 20% off first booking"
                    className="styled-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item 
                  label="About Your Studio" 
                  tooltip="Describe your photography style and expertise"
                >
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share your photography experience, style, and what makes your studio special..."
                    rows={5}
                    className="styled-textarea"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="form-actions">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleForm}
                className="save-button"
              >
                {exist ? "Update Profile" : "Create Profile"}
              </Button>
              
              {editMode && (
                <Button
                  icon={<RollbackOutlined />}
                  onClick={handleEdit}
                  className="cancel-button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Photographer_detail;