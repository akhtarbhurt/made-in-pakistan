import dotenv from "dotenv";
import { app } from "./app";
import { connectDB } from "./database/db";

// Load environment variables
dotenv.config({
    path: "./.env"
});

connectDB().then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
}).catch((error: any) => console.log(error));

