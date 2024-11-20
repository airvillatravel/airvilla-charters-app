// server base url
const SERVER_URL = process.env.SERVER_URL;
// BASE URL
const BASE_URL = SERVER_URL + "/api/master";

// MASTER USER ENDPOINT
const masterUrl = {
  // users
  getAllUsersForMaster: BASE_URL + "/users",
  getAllSearchUsersForMaster: BASE_URL + "/users/search",
  getSingleUserForMaster: (userId: string) => BASE_URL + `/users/${userId}`,
  getSingleUserRequestForMaster: (userId: string) =>
    BASE_URL + `/users/${userId}/request`,
  getSingleUserPasswordForMaster: (userId: string) =>
    BASE_URL + `/users/${userId}/password`,

  // tickets
  getAllTicketsForMaster: BASE_URL + "/tickets",
  getSingleTicketForMaster: (refId: string) => BASE_URL + `/tickets/${refId}`,
  updateTicketStatusForMaster: (refId: string) =>
    BASE_URL + `/tickets/${refId}/status`,
  getAgencyNamesForMaster: BASE_URL + "/agencyNames",
  getUpdateValidTicketForMaster: (refId: string) =>
    BASE_URL + `/tickets/${refId}/valid`,

  // dashboard
  getTotalTicketsForMaster: BASE_URL + "/tickets/total",
  getTotalUsersForMaster: BASE_URL + "/users/total",
};

export default masterUrl;
