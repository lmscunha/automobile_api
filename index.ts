import "dotenv/config";
import { app } from "./src/server";

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
