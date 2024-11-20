// server base url
const SERVER_URL = process.env.SERVER_URL;
// BASE URL
const BASE_URL = SERVER_URL + "/api/ticket";

// LOGIN ENDPOINT
const ticketUrl = {
  addTicket: BASE_URL + "/new",
  getAllTickets: BASE_URL + "/",
  searchTickets: BASE_URL + `/search`,
  singleTicket: (id: string) => BASE_URL + `/${id}`,
};

export default ticketUrl;
