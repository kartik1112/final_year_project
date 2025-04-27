import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Spin, 
  message, 
  Typography, 
  Empty, 
  Image, 
  Divider, 
  Modal,
  Upload
} from 'antd';
import {
  CameraOutlined,
  ReloadOutlined,
  PictureOutlined,
  DownloadOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './CameraCaptureWithMask.css';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const API_BASE_URL = 'http://localhost:5000'; // or 'http://127.0.0.1:5000' - use the same one throughout

const CameraCaptureWithMatch = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [event_id, setEventId] = useState('');
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    // Get event_id from location state or params
    const id = location.state || eventId;
    setEventId(id);
  }, [location, eventId]);

  const captureImage = () => {
    if (webcamRef.current) {
      const capturedImageSrc = webcamRef.current.getScreenshot();
      setImageSrc(capturedImageSrc);
      setErrorMessage('');
    } else {
      setErrorMessage('Camera not available. Please ensure your camera is connected and you have granted permission.');
    }
  };

  const resetCapture = () => {
    setImageSrc('');
    setMatchedPhotos([]);
    setErrorMessage('');
    setUploadMode(false);
    setUploadedFile(null);
  };

  const captureAndMatch = async () => {
    if (!imageSrc && !uploadedFile) {
      message.error('Please capture or upload an image first');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      let formData = new FormData();
      formData.append('event_id', event_id);
      
      // Either use the captured image or the uploaded file
      if (uploadedFile) {
        // console.log('Captured Image Source:', imageSrc); // Add logging to debug
        formData.append('image', uploadedFile);
      } else {
        // Convert the captured image to a file
        const blob = await fetch(imageSrc).then(res => res.blob());
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        formData.append('image', file);
      }

      // Send the image to the server for face matching
      const response = await axios.post(`${API_BASE_URL}/match_faces`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('API Response:', response.data); // Add logging to debug

      // Check the structure of the matches data
      if (response.data.matches && Array.isArray(response.data.matches) && response.data.matches.length > 0) {
        // Handle both formats of response data
        // Format 1: Array of strings (just the image names)
        // Format 2: Array of objects with name property
        const formattedMatches = response.data.matches.map(match => {
          return typeof match === 'string' ? match : match.name;
        });
        
        setMatchedPhotos(formattedMatches);
        setErrorMessage('');
        message.success("Matching faces found!");
      } else {
        // No matches found, clear matched photos and show a message
        setMatchedPhotos([]);
        setErrorMessage('No matching faces found in this event. Try another photo or different angle.');
        message.info("No matches found");
      }
    } catch (error) {
      console.error('Error during face matching:', error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorMessage('An error occurred during face matching. Please try again.');
      message.error("Error processing your request");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (imagePath) => {
    const fullImageUrl = `${API_BASE_URL}/uploads/${imagePath}`;
    console.log('Previewing image:', fullImageUrl);
    setPreviewImage(fullImageUrl);
    setPreviewVisible(true);
  };

  const downloadImage = (imagePath) => {
    const fullImageUrl = `${API_BASE_URL}/uploads/${imagePath}`;
    console.log('Downloading image:', fullImageUrl);
    
    // Use fetch to check if the image exists first
    fetch(fullImageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Image not found');
        }
        return response.blob();
      })
      .then(blob => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract a clean filename
        const filename = imagePath.split('/').pop();
        link.download = filename || 'photo.jpg';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Download error:', error);
        message.error('Failed to download image. Please try again.');
      });
  };

  const handleUploadChange = (info) => {
    if (info.file.status !== 'uploading') {
      const file = info.file.originFileObj;
      if (file) {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
      }
      return false; // Prevent automatic upload
    },
    onChange: handleUploadChange,
    showUploadList: false,
  };

  return (
    <div className="camera-capture-container">
      <Card className="camera-header-card">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          Back to Event
        </Button>
        <Title level={3} className="camera-title">Find Your Photos</Title>
        <Paragraph className="camera-description">
          Take a selfie or upload a photo of yourself, and we'll find all the photos from this event that include you.
        </Paragraph>
      </Card>

      <Row gutter={[24, 24]} className="camera-content-row">
        <Col xs={24} md={12} className="capture-column">
          <Card className="capture-card">
            <Title level={4} className="card-title">
              {uploadMode ? <UploadOutlined className="card-icon" /> : <CameraOutlined className="card-icon" />}
              {uploadMode ? "Upload a Photo" : "Take a Selfie"}
            </Title>

            {uploadMode ? (
              <div className="upload-area">
                <Dragger {...uploadProps} className="photo-uploader">
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag a photo to upload</p>
                  <p className="ant-upload-hint">
                    Choose a clear photo of your face for the best results
                  </p>
                </Dragger>
              </div>
            ) : (
              <div className="webcam-container">
                {!imageSrc ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                  />
                ) : (
                  <div className="captured-image-container">
                    <img src={imageSrc} alt="Captured" className="captured-image" />
                  </div>
                )}
              </div>
            )}

            <div className="capture-actions">
              {!imageSrc ? (
                <>
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={captureImage}
                    size="large"
                    className="capture-button"
                    disabled={uploadMode}
                  >
                    Take Photo
                  </Button>
                  <Button
                    type="default"
                    onClick={() => setUploadMode(!uploadMode)}
                    size="large"
                    icon={uploadMode ? <CameraOutlined /> : <UploadOutlined />}
                    className="mode-toggle-button"
                  >
                    {uploadMode ? "Use Camera" : "Upload Photo"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<PictureOutlined />}
                    onClick={captureAndMatch}
                    size="large"
                    className="match-button"
                    loading={loading}
                  >
                    Find My Photos
                  </Button>
                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={resetCapture}
                    size="large"
                    className="reset-button"
                  >
                    Take Again
                  </Button>
                </>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} className="results-column">
          <Card className="results-card">
            <Title level={4} className="card-title">
              <PictureOutlined className="card-icon" />
              Matching Photos
            </Title>

            <div className="results-container">
              {loading ? (
                <div className="loading-results">
                  <Spin size="large" />
                  <Text className="loading-text">Finding your photos...</Text>
                </div>
              ) : matchedPhotos.length > 0 ? (
                <div className="photo-grid">
                  {matchedPhotos.map((photo, index) => {
                    // Handle both string and object formats
                    const photoPath = typeof photo === 'string' ? photo : photo.name;
                    
                    return (
                      <div key={index} className="photo-item">
                        <Image
                          src={`${API_BASE_URL}/uploads/${photoPath}`}
                          alt={`Matched photo ${index + 1}`}
                          className="matched-photo"
                          preview={false}
                          onClick={() => handlePreview(photoPath)}
                        />
                        <div className="photo-actions">
                          <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={() => downloadImage(photoPath)}
                            size="small"
                            className="download-button"
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : imageSrc ? (
                <div className="no-results">
                  {errorMessage ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={errorMessage}
                    />
                  ) : (
                    <div className="instructions">
                      <PictureOutlined className="instruction-icon" />
                      <Text>Click "Find My Photos" to search for matches</Text>
                    </div>
                  )}
                </div>
              ) : (
                <div className="instructions">
                  <CameraOutlined className="instruction-icon" />
                  <Text>Take or upload a photo to start searching</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        visible={previewVisible}
        title={null}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="90vw"
        centered
        destroyOnClose={true}
        className="preview-modal"
        closeIcon={<CloseOutlined style={{ color: 'white' }} />}
      >
        <img alt="Preview" src={previewImage} className="preview-image" />
      </Modal>
    </div>
  );
};

export default CameraCaptureWithMatch;