import express from 'express';
const app = express();

import dotenv from 'dotenv';
import dbConnect from './utils/dbConnect.js';
// import authRoute from './routes/auths.js';
// import userRoute from './routes/user.js'
// import authRoute from './routes/auth.js'
// import adminRoute from './routes/admin.js'

let PORT = process.env.PORT;

dotenv.config();
// ===connect to database
dbConnect();
// ===accept json files
app.use(express.json());
// ===register the routes
// app.use('/api/auth', authRoute);
// app.use('/api/v1', userRoute);
// app.use('/api/v1', authRoute);
// app.use('/api/v1', adminRoute);

app.listen(PORT, ()=>{
    console.log("Backend server is running on http://localhost:"+PORT)
})