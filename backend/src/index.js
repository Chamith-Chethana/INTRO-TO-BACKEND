import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

const startServer = async () => {
    try {
        await connectDB();

        const port = process.env.PORT || 8000;
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        server.on("error", (error) => {
            console.error("Server failed to start:", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();