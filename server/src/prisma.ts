import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import URL from "./utils/DatabaseUrl";

const { NODE_ENV, DATABASE_URL, TEST_DATABASE_URL } = process.env;
const connectionString = NODE_ENV === "test" ? TEST_DATABASE_URL : URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma
  .$connect()
  .then(() => {
    console.log(
      `Connected to ${NODE_ENV === "test" ? "test" : "main"} database`
    );
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

export default prisma;
