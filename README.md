# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js

1.  Install dependencies:
    `npm install`
2.  Create a `.env` file in the root of your project (e.g., `.env` or `.env.local`).
3.  Add the following environment variables to your `.env` file, replacing the placeholder values with your actual credentials:

    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    IMGUR_CLIENT_ID=your_imgur_client_id_here
    XANO_API_ENDPOINT=your_xano_api_endpoint_url_here
    UPLOAD_PASSWORD=your_chosen_upload_password_here
    ```

    -   `GEMINI_API_KEY`: Your API key for the Gemini API.
    -   `IMGUR_CLIENT_ID`: Your Client ID for the Imgur API, used for image uploads.
    -   `XANO_API_ENDPOINT`: The full URL to your Xano backend endpoint where artwork data will be saved.
    -   `UPLOAD_PASSWORD`: A password you choose to protect the artwork upload functionality.

4.  Run the app:
    `npm run dev`
