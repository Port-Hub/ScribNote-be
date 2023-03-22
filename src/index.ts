import app from "./app";
import * as dotenv from "dotenv";
import prisma from "./middleware/prisma";

dotenv.config();

const PORT: String | undefined = process.env.PORT;

// Connections Begin

app.listen(PORT || 5000, () =>
    console.log( `The API server has successfully started. \nListening at ${
        "http://localhost:"+PORT || "http://localhost:5000"
      }`)
);

process.on("SIGINT", function () {
  prisma.$disconnect();
  console.log("Prisma Disconnected.");
  process.exit(0);
});

// Connections End