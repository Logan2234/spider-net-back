// Define the CORS options
const corsOptions = {
    origin: 'https://localhost:5173', // Allow requests from this origin (e.g., frontend server)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow these headers in requests
    credentials: true, // Allow cookies and other credentials to be sent
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Export the CORS options so that they can be used in the app
export default corsOptions;
