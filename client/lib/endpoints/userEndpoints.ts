// server base url
const SERVER_URL = process.env.SERVER_URL;
// BASE URL
const BASE_URL = SERVER_URL + "/api/user";

// TICKETS ENDPOINT
const userUrl = {
  getAllUserTickets: BASE_URL + "/tickets",
  singleTicket: (id: string) => BASE_URL + `/tickets/${id}`,
  updateSingleTicket: (refId: string) => BASE_URL + `/tickets/${refId}/status`,
  getUserProfile: BASE_URL + "/profile",
  updateUserEmail: BASE_URL + "/email",
  updateUserEmailVerify: (token: string) => BASE_URL + `/email/verify/${token}`,
  updateUserPassword: BASE_URL + "/password",
  deleteUserProfile: BASE_URL + "/profile/delete",
  updateValidTicket: (refId: string) =>
    BASE_URL + `/tickets/${refId}/update_request`,
  withdrawUpdateValidTicket: (refId: string) =>
    BASE_URL + `/tickets/${refId}/update_request/withdraw`,
};

export default userUrl;
