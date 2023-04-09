import app from "./app";
import prisma from "./middleware/prisma";
import { config } from "dotenv";

config();

const PORT: String = process.env.PORT!;

// Connections Begin

app.listen(PORT || 5000, () =>
    console.log( `The API server has successfully started. \nListening at ${
        "http://localhost:"+PORT || "http://localhost:5000"
      }`)
);

process.on("SIGINT", () => {
  prisma.$disconnect();
  console.log("Prisma Disconnected.");
  process.exit(0);
});

// Connections End