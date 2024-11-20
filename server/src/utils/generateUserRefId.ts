import prisma from "../prisma";

async function generateUserRefId() {
  let refId;
  let exists = true;

  while (exists) {
    refId = Math.floor(1000000 + Math.random() * 9000000).toString(); // Generates a 7-digit number
    const existingRecord = await prisma.user.findFirst({
      where: { refId },
    });
    if (!existingRecord) {
      exists = false;
    }
  }

  return refId;
}

export default generateUserRefId;
