import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Image, message, Button, Card, Typography, Spin, Empty } from 'antd';
import { DownloadOutlined, CameraOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './CameraCaptureWithMask.css';

const { Title, Text } = Typography;

const CameraCaptureWithMatch = () => {
  const location = useLocation();
  const event_id = location.state;
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [loading, setLoading] = useState(false);

  // Existing functionality preserved
  const captureAndMatch = async () => {
    setCameraOn(false);
    setLoading(true);

    if (webcamRef.current) {
      try {
        const capturedImageSrc = webcamRef.current.getScreenshot();
        if (!capturedImageSrc) throw new Error("Failed to capture image");

        setImageSrc(capturedImageSrc);

        // Convert the captured image to a file
        const blob = await fetch(capturedImageSrc).then(res => res.blob());
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

        // Prepare the FormData object with image and event_id
        const formData = new FormData();
        formData.append('image', file);
        formData.append('event_id', event_id);

        // Send the image to the server for face matching
        const response = await axios.post('http://127.0.0.1:5000/match_faces', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.matches?.length) {
          // If matches found, set the matched photos
          setMatchedPhotos(response.data.matches);
          setErrorMessage('');
          message.success("Matching faces found!");
        } else {
          // No matches found, clear matched photos and show a message
          setMatchedPhotos([]);
          setErrorMessage(response.data.message || 'No matching faces found.');
          message.warning("You are not present in this event.");
        }
      } catch (error) {
        // Handle errors and show a fallback error message
        setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        message.error("Your Face is not clear");
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Camera is not ready, please try again.");
      setLoading(false);
    }
  };

  const doDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new message.error('Network response was not ok');

      const blob = await response.blob();
      const a = document.createElement('a');
      const urlBlob = URL.createObjectURL(blob);
      a.href = urlBlob;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      message.error('Failed to download the image.');
    }
  };

  const resetCamera = () => {
    setImageSrc(null);
    setCameraOn(true);
    setMatchedPhotos([]);
    setErrorMessage('');
  };

  return (
    <div className="face-match-container">
      <Card className="header-card">
        <Title level={2} className="page-title">
          <CameraOutlined className="title-icon" /> Face Recognition
        </Title>
        <Text className="subtitle">Find photos of yourself from this event</Text>
      </Card>

      <div className="content-area">
        <div className="camera-section">
          <Card className="camera-card">
            <Title level={4} className="section-title">
              {imageSrc ? "Your Selfie" : "Take a Selfie"}
            </Title>
            
            {!imageSrc ? (
              <div className="webcam-container">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="webcam"
                />
                <Button 
                  type="primary" 
                  icon={<CameraOutlined />} 
                  onClick={captureAndMatch}
                  className="capture-button"
                  loading={loading}
                >
                  Capture & Find Matches
                </Button>
              </div>
            ) : (
              <div className="selfie-result">
                <div className="selfie-container">
                  <img src={imageSrc} alt="Selfie" className="selfie-image" />
                  <CheckCircleOutlined className="selfie-check-icon" />
                </div>
                <Button 
                  type="default" 
                  icon={<ReloadOutlined />}
                  onClick={resetCamera}
                  className="reset-button"
                >
                  Take Another Photo
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="results-section">
          <Card className="results-card">
            <Title level={4} className="section-title">
              Matched Photos
            </Title>

            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <Text className="loading-text">Finding your photos...</Text>
              </div>
            ) : matchedPhotos.length > 0 ? (
              <div className="matches-grid">
                {matchedPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="match-item"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="match-image-container">
                      <Image
                        src={`http://localhost:5000/uploads/${photo.name}`}
                        alt={`Match ${index + 1}`}
                        className="match-image"
                        preview={false}
                      />
                      {hoveredImageIndex === index && (
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => doDownload(`http://localhost:5000/uploads/${photo.name}`, photo.name)}
                          className="download-button"
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-matches">
                {errorMessage ? (
                  <Empty 
                    description={errorMessage}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="empty-state"
                  />
                ) : (
                  <div className="instructions">
                    <Text className="instruction-text">
                      Take a clear selfie to find photos of yourself from this event
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureWithMatch;