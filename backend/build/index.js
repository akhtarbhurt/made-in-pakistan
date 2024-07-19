"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const db_1 = require("./database/db");
// Load environment variables
dotenv_1.default.config({
    path: "./.env"
});
(0, db_1.connectDB)().then(() => {
    const port = process.env.PORT || 3000;
    app_1.app.listen(port, () => {
        console.log(`Server listening at port ${port}`);
    });
}).catch((error) => console.log(error));
console.log("Environment variables:", process.env);
