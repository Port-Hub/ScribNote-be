const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;

// Connections Begin

app.listen(PORT || 5000, () =>
    console.log(`Server running in port "${PORT}"`)
);

// Connections End