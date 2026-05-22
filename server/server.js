import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

import app from "./src/app.js";
import { checkConnection } from "./src/config/db.js";

const startServer = async () => {
    try {

        await checkConnection();
        
        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 5000}`
            );
        });

    } catch (error) {

        console.error(
            "Failed to connect to the database. Server is shutting down."
        );

        process.exit(1);
    }
};

startServer();