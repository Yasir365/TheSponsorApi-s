import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.config.js';
import route from './src/routes/index.routes.js';


dotenv.config();

const app = express();

const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/the-sponsor-apis/v1', route);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to The Sponsor Event Management System." });
});

app.use((req, res) => {
    return res.status(400).send({ message: "Sorry! Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
