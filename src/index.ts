import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const PORT: String | undefined = process.env.PORT;

// Connections Begin

app.listen(PORT || 5000, () =>
    console.log( `The API server has successfully started. \nListening at ${
        "http://localhost:"+PORT || "http://localhost:5000"
      }`)
);

// Connections End