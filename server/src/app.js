import express from 'express';
import cors from 'cors';
import availabilityRouter from './routes/availabilityRoute.js';
import eventRouter from './routes/eventRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import meetingRouter from './routes/meetingRoute.js';


const app = express()

app.use(cors({
    origin: "*",                         
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.send("Hello World");
})

app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/meeting", meetingRouter);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


export default app;