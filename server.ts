import express, { type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const port = 3000;
const isProduction = process.env.NODE_ENV === "produciton";

const __filename = fileURLToPath(import.meta.url); //server.ts
const __dirname = path.dirname(__filename); ///Users/Rasmu/SchoolStuff/api-development/telefonboken/

async function main() {
    const app = express();

    let vite;
    if (!isProduction) {
        const { createServer: createViteServer } = await import("vite");
        vite = await createViteServer({
            server: { middlewareMode: true},
            root: __dirname,
        });
        app.use(vite.middlewares);
    } else {
        app.get("/", ({ res }: { res: Response }) => {
            res.sendFile(path.join(__dirname, "index.html"));
        });
    }
    app.listen(port, () => {
        console.log(
            `Server ${
            isProduction ? "PROD" : "DEV"
            } live at http://localhost:${port}`
        );
    });
};

main().catch((error) => console.log(error));