# Facial Recognition Photo Sharing Platform

## Introduction

This project is an AI-powered photo-sharing platform that utilizes facial recognition technology to allow event attendees to access their pictures easily. Users can register, create events, and upload images. Guests can then retrieve their pictures by scanning their faces via a webcam. The system efficiently matches guest face embeddings with event images and displays the relevant photos.


## Features

- User authentication (registration & login)
- Create and manage multiple events
- Upload and store event images
- Face recognition-based image retrieval
- QR code Scanning
- Email verification for user registration


## Project Structure

This project consists of three main components:

1. **Front-end** (React.js) - The user interface for uploading and retrieving photos.
2. **Node.js Server** - Handles user authentication, event management, and email notifications.
3. **Flask Server** - Manages facial recognition and processing of face embeddings.

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed before proceeding:

- Node.js & npm
- Python (3.12.1 recommended)
- MongoDB
- Virtual Environment (`venv`)

### Database Setup

MongoDB is used for storing user data, events, and face embeddings. Before running the servers, create a MongoDB database named `photo_sharing_db`:

Add Mongo DB url in node service and flask service 

### Front-end Setup

Navigate to the `front-end` folder and install dependencies:

```sh
cd front-end
npm install
npm start
```

### Node.js Server Setup

Navigate to the `node-server` folder, install dependencies, and configure environment variables:

```sh
cd node-server-1
npm install
```

**Nodemailer Configuration:**
Create a `.env` file in the `node-server` directory and add your email credentials:

```
EMAIL=your_email@example.com
EMAIL_PASS=your_email_password
```

Modify `index.js` to use these credentials for sending OTPs and verification emails.

Run the server:

```sh
npm start
```

### Flask Server Setup

Navigate to the `flask-server` folder, create a virtual environment, and install dependencies:

```sh
cd flask-server-2
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Run the server:

```sh
python app.py
```

---

## Usage

1. Register or log in to the platform.
2. Create an event and upload photos.
3. Share the event link or QR code with attendees.
4. Attendees scan their faces to retrieve their pictures.

---

## Contributing

Feel free to fork this repository, create feature branches, and submit pull requests to improve the project.

## License

This project is licensed under the MIT License.

## Contact

For any issues or contributions, feel free to open an issue or reach out.

