import express from "express";
import { gameRouter } from "./games/infrastructure/rest-api/gameRouter";

const initApp = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/games", gameRouter);

  const port = 3000;

  app.listen(port, () => {
    console.log(`[APP] - Starting application on port ${port}`);
  });
}

initApp();