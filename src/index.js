import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
