import app from "./app.js";
import config from "./config/index.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();
    console.log(" ✅ Database connected successfully");
    app.listen(config.port, () => {
      console.log(
        ` ✅ Server is running on port http://localhost:${config.port}`,
      );
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

main();
