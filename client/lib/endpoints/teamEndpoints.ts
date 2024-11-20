// server base url
const SERVER_URL = process.env.SERVER_URL;
// BASE URL
const BASE_URL = SERVER_URL + "/api/team";

// TEAM MEMBER ENDPOINT
const teamMemberUrl = {
  // team
  getTeamId: BASE_URL + "/id",
  getInvitedById: BASE_URL + "/id",
  // team member
  getAllTeamMembers: BASE_URL + "/members",
  getAllSearchTeamMembers: BASE_URL + "/members/search",
  createTeamMember: BASE_URL + "/members",
  updateTeamMember: (memberId: string) => BASE_URL + `/members/${memberId}`,
  getSingleTeamMember: (memberId: string) => BASE_URL + `/members/${memberId}`,
  updateTeamMemberRole: (memberId: string, role: string) =>
    BASE_URL + `/members/${memberId}/role`,
  removeTeamMember: (memberId: string) => BASE_URL + `/members/${memberId}`,
  resendInvitation: (email: string, teamId: string, memberId: string) =>
    BASE_URL + `/invitations/resend`,
};

export default teamMemberUrl;
