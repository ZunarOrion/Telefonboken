import express from "express";
import cors from "cors";
import { signup, login, logout } from "./controllers/userController.ts";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/signup', signup);

app.post('/login', login)

app.post('/logout', logout)

app.listen(port, () => {
    console.log(`App running at ${port}`)
});
