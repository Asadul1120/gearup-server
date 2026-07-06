import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

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
