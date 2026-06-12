import { app } from "./app";
import config from "./config";

const main = () => {
  app.listen(config.port, () => {
    console.log(`Micro task Server Listening On ${config.port}`);
  });
};

main();
