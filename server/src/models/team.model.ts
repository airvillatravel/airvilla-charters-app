import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export enum Role {
  MASTER = "master",
  MODERATOR = "moderator",
  ACCOUNTANT = "accountant",
}

export enum Department {
  CUSTOMER_SUPPORT = "Customer Support",
  MANAGEMENT = "Management",
  FINANCE = "Finance",
  HUMAN_RESOURCES = "Human Resources",
  MARKETING = "Marketing",
  SALES = "Sales",
  IT = "IT",
  OPERATIONS = "Operations",
  RESEARCH_AND_DEVELOPMENT = "Research & Development",
}
