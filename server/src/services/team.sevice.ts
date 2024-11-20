// import { hash } from "bcrypt";
// import { sendInvitationEmail } from "../utils/email/sendInvitation";
// import { PrismaClient } from "@prisma/client";
// import { generateInvitationToken } from "../utils/invitation";
// import { Role, Department } from "../models/team.model";

// const prisma = new PrismaClient();

// export class TeamService {
//   async createTeamMember(data: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     role: Role;
//     department: Department;
//     teamId: string;
//   }) {
//     const hashedPassword = await hash(data.password, 10);

//     const member = await prisma.teamMember.create({
//       data: {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         password: hashedPassword,
//         role: data.role,
//         department: data.department,
//         teamId: data.teamId,
//         status: "PENDING",
//       },
//     });

//     const invitationToken = generateInvitationToken();
//     await prisma.invitation.create({
//       data: {
//         token: invitationToken,
//         teamMemberId: member.id,
//         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       },
//     });

//     await sendInvitationEmail(data.email, invitationToken, {
//       firstName: data.firstName,
//       lastName: data.lastName,
//       password: data.password,
//     });

//     return member;
//   }

//   async acceptInvitation(token: string) {
//     const invitation = await prisma.invitation.findUnique({
//       where: { token },
//       include: { teamMember: true },
//     });

//     if (!invitation || invitation.expiresAt < new Date()) {
//       throw new Error("Invalid or expired invitation");
//     }

//     await prisma.teamMember.update({
//       where: { id: invitation.teamMemberId },
//       data: { status: "ACTIVE" },
//     });

//     await prisma.invitation.delete({
//       where: { id: invitation.id },
//     });

//     return invitation.teamMember;
//   }

//   async removeMember(memberId: string, requesterId: string) {
//     const requester = await prisma.teamMember.findUnique({
//       where: { id: requesterId },
//     });

//     if (requester?.role !== Role.MASTER) {
//       throw new Error("Unauthorized");
//     }

//     return prisma.teamMember.delete({
//       where: { id: memberId },
//     });
//   }

//   async updateMemberRole(memberId: string, role: Role, requesterId: string) {
//     const requester = await prisma.teamMember.findUnique({
//       where: { id: requesterId },
//     });

//     if (requester?.role !== Role.MASTER) {
//       throw new Error("Unauthorized");
//     }

//     return prisma.teamMember.update({
//       where: { id: memberId },
//       data: { role },
//     });
//   }

//   //   private async sendInvitationEmail(
//   //     email: string,
//   //     token: string,
//   //     memberInfo: any
//   //   ) {
//   //     const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;

//   //     await sendEmail({
//   //       to: email,
//   //       subject: "Team Invitation",
//   //       html: `
//   //         <h1>Welcome to the team!</h1>
//   //         <p>You have been invited to join the team. Here are your credentials:</p>
//   //         <p>Email: ${email}</p>
//   //         <p>Password: ${memberInfo.password}</p>
//   //         <p>Please click the link below to accept the invitation:</p>
//   //         <a href="${invitationUrl}">Accept Invitation</a>
//   //       `,
//   //     });
//   //   }
// }
