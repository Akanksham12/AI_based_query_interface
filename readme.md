# Database Query Generator

## Overview

This project is a Database Query Generator that enables users to generate database queries based on textual descriptions. It includes a frontend built with React and a backend using Node.js and Express, which communicates with the Google Generative AI API.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18+): [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js. Verify installation with `npm -v`.

## Backend Setup

1. **Navigate to the Backend Directory**

   ```sh
   cd backend
   ```

2. **Install Backend Dependencies**

   ```sh
   npm install express dotenv @google/generative-ai
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory and add your Google Generative AI API key:

   ```env
   API_KEY=<YOUR_GOOGLE_GENERATIVE_AI_API_KEY>
   ```

4. **Start the Backend Server**

   ```sh
   npm start
   ```

   This command starts the backend server, which listens for requests and communicates with the Google Generative AI API.

## Frontend Setup

1. **Navigate to the Frontend Directory**

   ```sh
   cd frontend
   ```

2. **Install Frontend Dependencies**

   ```sh
   npm install react react-dom react-select
   ```

3. **Start the Frontend Development Server**

   ```sh
   npm start
   ```

   This command starts the frontend development server, which hosts the React application.

## Usage

1. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to view the frontend interface.

2. **Generate Queries**

   Use the provided UI to input textual descriptions and generate database queries. The frontend sends the description to the backend, which uses the Google Generative AI API to generate the appropriate query.

## Additional Information

- **Frontend**: The React application is located in the `frontend` directory. Customize and extend it as needed.
- **Backend**: The Node.js and Express server is located in the `backend` directory. Update routes and logic to fit your requirements.
- **API Key**: Make sure to replace `<YOUR_GOOGLE_GENERATIVE_AI_API_KEY>` with your actual API key.
