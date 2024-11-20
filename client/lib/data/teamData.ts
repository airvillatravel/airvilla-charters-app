import teamMemberUrl from "../endpoints/teamEndpoints";
import axios from "axios";

// Helper function to handle API requests
const fetchData = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// Get team ID
const getTeamId = async () => {
  const url = teamMemberUrl.getTeamId;
  return await fetchData(url);
};

// Get InvitedById
const getInvitedById = async () => {
  const url = teamMemberUrl.getInvitedById;
  return await fetchData(url);
};

// Create a new team member
const createTeamMember = async (data: any) => {
  const url = teamMemberUrl.createTeamMember;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await fetchData(url, options);
};

// Update a team member
const updateTeamMember = async (memberId: string, data: any) => {
  const url = teamMemberUrl.updateTeamMember(memberId);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await fetchData(url, options);
};

// Get all team members
const fetchAllTeamMembers = async () => {
  const url = teamMemberUrl.getAllTeamMembers;
  return await fetchData(url);
};

const fetchAllSearchTeamMembers = async (
  input: string,
  accountType: string,
  cursor?: string,
  pageSize: number = 5
) => {
  try {
    const response = await axios.get(teamMemberUrl.getAllSearchTeamMembers, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        input,
        accountType,
        cursor, // Pass the cursor parameter
        pageSize, // Pass the pageSize parameter
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data = response.data;

    console.log({ data });

    return data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, message: "Internal server error" };
  }
};
// Get a single team member by ID
const getSingleTeamMember = async (memberId: string) => {
  const url = teamMemberUrl.getSingleTeamMember(memberId);
  return await fetchData(url);
};

// Update a team member's role
const updateTeamMemberRole = async (memberId: string, role: string) => {
  const url = teamMemberUrl.updateTeamMemberRole(memberId, role);
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  };
  return await fetchData(url, options);
};

// Remove a team member
const removeTeamMember = async (memberId: string) => {
  const url = teamMemberUrl.removeTeamMember(memberId);
  const options = {
    method: "DELETE",
  };
  return await fetchData(url, options);
};

// Resend an invitation to a team member
const resendInvitation = async (
  email: string,
  teamId: string,
  memberId: string
) => {
  const url = teamMemberUrl.resendInvitation(email, teamId, memberId);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, teamId, memberId }),
  };
  return await fetchData(url, options);
};

export {
  getTeamId,
  createTeamMember,
  updateTeamMember,
  fetchAllTeamMembers,
  fetchAllSearchTeamMembers,
  getSingleTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  resendInvitation,
};
