import express from "express";
import { gameRouter } from "./games/infrastructure/rest-api/gameRouter";
import { PORT } from "../config";

const initApp = () => {
    const app = express();

    app.use(express.json());
    app.disable("x-powered-by");

    app.use("/api/games", gameRouter);

    const port = PORT;
    app.listen(port, () => {
        console.log(`[APP] - Starting application on port ${port}`);
    });
};

initApp();