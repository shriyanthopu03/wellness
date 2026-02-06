# Setup Instructions

To enable Gemini AI features, please update the `backend/.env` file with your actual API key:

1. Open `backend/.env`
2. Replace `your_gemini_api_key_here` with your Google Gemini API Key.
3. Save the file.
4. Restart the backend server.

**Note:** The application includes a fallback mode that uses the Gemini REST API directly if the Python SDK has compatibility issues (which is common in some environments). This ensures the AI features work as long as the API Key is valid.
