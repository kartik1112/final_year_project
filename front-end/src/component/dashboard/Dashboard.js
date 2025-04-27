import React, { useEffect, useState } from "react";
import Upload_Img from "./Upload_Img";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  message,
  Switch,
  Upload,
  Layout,
  Menu,
  Button,
  Avatar,
  Statistic,
  Card,
  Row,
  Col,
  Empty,
  Spin,
} from "antd";
import ImgCrop from "antd-img-crop";
import Qrcode from "./Qrcode";
import Display_event from "./Display_event";
import InEvent from "./InEvent";
import Photographer_detail from "./Photographer_detail";
import {
  AppstoreOutlined,
  UserOutlined,
  PictureOutlined,
  UploadOutlined,
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  CalendarOutlined,
  SaveOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import CreateEvent from "./CreateEvent";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [Dsiplay_Pin, setDisplay_Pin] = useState("");
  const [useeffect, setuseeffect] = useState(0);
  const [eventdata, seteventdata] = useState([]);
  const [eventID, seteventID] = useState("");
  const [eventName, seteventName] = useState("");
  const [renderEvent, setrenderEvent] = useState(false);
  let [result, setresult] = useState("");
  const [pin, setpin] = useState("");
  const [switcher, setswitcher] = useState(false);
  const [url, seturl] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [createEvent, setcreateEvent] = useState(false);
  const [DisplayEvent, setDisplayEvent] = useState(false);
  const [event_name, setevent] = useState("");
  const [username, setusername] = useState("");
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("event");

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (!auth) {
      navigate("/login");
      return;
    }
    setusername(JSON.parse(auth));
  }, [useeffect, navigate]);

  // ANT DESIGN FILE UPLOAD HANDLERS
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

  // TAB NAVIGATION FUNCTIONS
  function Events() {
    setActiveTab("event");
    setRefresh((prev) => prev + 1);
    setcreateEvent(false);
    setrenderEvent(false);
    seteventID("");
    seteventName("");
  }

  function create_event() {
    setevent("");
    setActiveTab("create-event");
    setrenderEvent(false);
    seteventID("");
    seteventName("");
    setFileList([]);
    setswitcher(false);
    setpin("");
  }

  // Update the inevents function in Dashboard.js
  function inevents(eventID, name, display_pin) {
    console.log("Opening event from Dashboard:", eventID, name, display_pin);
    // Clear previous state to avoid conflicts
    setcreateEvent(false);

    // Set the event data
    seteventID(eventID);
    seteventName(name);
    setDisplay_Pin(display_pin);

    // Enable the event rendering
    setrenderEvent(true);

    // Change the active tab last to trigger the UI update
    setActiveTab("InEvent");
  }

  function complete_d() {
    setActiveTab("complete-detail");
    setcreateEvent(false);
    setrenderEvent(false);
    seteventID("");
    seteventName("");
  }

  // EVENT CREATION FUNCTION
  const make_event = async () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const created_id = user._id;

      if (!switcher || (pin && pin.length <= 6)) {
        const formData = new FormData();
        formData.append("event_name", event_name);
        formData.append("created_id", created_id);
        formData.append("pin", pin);

        if (fileList[0]) {
          formData.append("event_photo", fileList[0].originFileObj);
        }

        try {
          let result = await fetch("http://localhost:5000/event", {
            method: "POST",
            body: formData,
          });

          result = await result.json();

          if (result.event_name && result._id) {
            message.success("Event is created! ");
            seturl(`http://localhost:3000/collect/${result._id}`);
            setcreateEvent(true);
            setRefresh((prev) => prev + 1);
            setevent("");
            setpin("");
            setresult(result);
            setFileList([]);
          } else {
            message.warning(result.result);
          }
        } catch (error) {
          message.error("Error creating event: " + error.message);
        }
      } else {
        message.error("Only 6 Digit Pin Accepted");
      }
    } else {
      message.error("No user found in localStorage");
    }
  };

  // COPY TO CLIPBOARD FUNCTION
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy: " + err.message);
      });
  };

  // LOGOUT FUNCTION
  const logout = () => {
    const result = window.confirm("Are you sure you want to logout?");
    if (result) {
      localStorage.clear();
      navigate("/login");
    }
    setuseeffect((prev) => prev + 1);
  };

  // STATS FOR DASHBOARD (PLACEHOLDER VALUES)
  const stats = [
    {
      title: "Total Events",
      value: eventdata.length || 0,
      icon: <AppstoreOutlined />,
    },
    { title: "Total Photos", value: 0, icon: <PictureOutlined /> },
    { title: "Recognized Faces", value: 0, icon: <TeamOutlined /> },
  ];

  return (
    <Layout className="dashboard-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="dashboard-sider"
        width={300}
      >
        <div className="logo">
          {collapsed ? (
            <span className="logo-text collapsed">SS</span>
          ) : (
            <span className="logo-text">Snap Sap</span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[
            activeTab === "event"
              ? "1"
              : activeTab === "create-event"
              ? "2"
              : activeTab === "complete-detail"
              ? "3"
              : "1",
          ]}
          className="dashboard-menu"
          items={[
            {
              key: "1",
              icon: <AppstoreOutlined className="menu-icon" />,
              label: <span className="menu-label">Event's</span>,
              onClick: Events,
            },
            {
              key: "2",
              icon: <SaveOutlined className="menu-icon" />,
              label: <span className="menu-label">Create New Event</span>,
              onClick: create_event,
            },
            {
              key: "3",
              icon: <UserOutlined className="menu-icon" />,
              label: <span className="menu-label">Profile</span>,
              onClick: complete_d,
            },
          ]}
        />
        <div className="dashboard-footer">
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            className="logout-button"
          >
            {collapsed ? "" : "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout className={`site-layout ${collapsed ? '' : 'expanded'}`}>
        <Header className="dashboard-header">
          <div className="header-left">
            <Button
              className="toggle-button"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            {activeTab === "event" && (
              <h1 className="header-title">Your Events</h1>
            )}
            {activeTab === "InEvent" && (
              <h1 className="header-title">{eventName}</h1>
            )}
            {activeTab === "create-event" && (
              <h1 className="header-title">Create Event</h1>
            )}
            {activeTab === "complete-detail" && (
              <h1 className="header-title">Profile</h1>
            )}
          </div>
          <div className="header-content">
            <span className="welcome-message">
              {username.name || "Welcome"}
            </span>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className="user-avatar"
            />
          </div>
        </Header>

        <Content className="dashboard-content">
          {/* Event display */}
          {activeTab === "event" && (
            <div className="content-section">
              <Display_event
                refresh={refresh}
                onclick={inevents}
                eventdata={eventdata}
                seteventdata={seteventdata}
              />
            </div>
          )}

          {/* In Event photos */}
          {activeTab === "InEvent" && (
            <div className="content-section">
              {renderEvent && (
                <InEvent
                  backbtn={Events}
                  setRefresh={setRefresh}
                  eventID={eventID}
                  name={eventName}
                  pin={Dsiplay_Pin}
                />
              )}
            </div>
          )}

          {/* Create Event */}
          {activeTab === "create-event" && (
            <CreateEvent></CreateEvent>
          )}

          {/* Profile section */}
          {activeTab === "complete-detail" && (
            <div className="content-section">
              <Photographer_detail />
            </div>
          )}
        </Content>

        {/* <div className="footer">
                    <p>Design by (Azeem khan & Abdul-kareem)</p>
                </div> */}
      </Layout>
    </Layout>
  );
};

export default Dashboard;
