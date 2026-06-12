import express, {
  type Application,
  type Request,
  type Response,
} from "express";
export const app: Application = express();


app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Micro Task Server Is Running On....");
});
