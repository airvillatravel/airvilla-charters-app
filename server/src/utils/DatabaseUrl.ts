import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const { DATABASE_URL, DB_SSL_CERT, NODE_ENV } = process.env;

// Only use the certificate in the production environment
let updatedDatabaseUrl = DATABASE_URL;

if (NODE_ENV === "production" && DB_SSL_CERT) {
  // Define a path for the temporary ce""rtificate file
  const certPath = path.join(__dirname, "../..", "temp_root.crt");

  // Write the certificate content to the temporary file
  fs.writeFileSync(certPath, DB_SSL_CERT);

  // Append the sslrootcert parameter to the database URL
  updatedDatabaseUrl += `&sslrootcert=${certPath}`;
}

// Set the updated database URL
process.env.DATABASE_URL = updatedDatabaseUrl;

export default updatedDatabaseUrl;
