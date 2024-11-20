import React, { useEffect, useState } from "react";
import { getFormatDate, getFormatTime } from "@/utils/functions/functions";
import Link from "next/link";
import {
  MasterUserDataType,
  MasterUserResultType,
} from "@/utils/definitions/masterDefinitions";
import { Edit, EyeIcon, Trash2 } from "lucide-react";
import {
  fetchSingleUserForMaster,
  fetchUserRequestForMaster,
} from "@/lib/data/masterUsersData";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";
import AlertWindow from "@/components/alart/AlertWindow";
import { setLoading } from "@/redux/features/LoadingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import AddTeamMember from "./AddTeamMember";
import { getTeamId } from "@/lib/data/teamData";

type StatusColor = "yellow" | "red" | "green" | "blue" | "purple" | "gray";

type StatusConfig = {
  [key: string]: StatusColor;
};

// Define status aliases
type StatusAliases = {
  [key: string]: string[];
};

const STATUS_COLORS: StatusConfig = {
  suspended: "red",
  accepted: "green",
  pending: "blue",
  rejected: "gray",
} as const;

const STATUS_ALIASES: StatusAliases = {
  suspended: ["inactive"],
  accepted: ["active"],
} as const;

const DEFAULT_STATUS = "rejected";

const getStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase();

  // Check direct status
  if (normalizedStatus in STATUS_COLORS) {
    return STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS];
  }

  // Check aliases
  for (const [mainStatus, aliases] of Object.entries(STATUS_ALIASES)) {
    if (aliases.includes(normalizedStatus)) {
      return STATUS_COLORS[mainStatus as keyof typeof STATUS_COLORS];
    }
  }

  // Return default
  return STATUS_COLORS[DEFAULT_STATUS];
};

const getStatusStyle = (status: string) => {
  const color = getStatusConfig(status);
  const baseStyle =
    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  return `${baseStyle} bg-${color}-100 text-${color}-800`;
};

const getStatusDot = (status: string) => {
  const color = getStatusConfig(status);
  return `bg-${color}-400`;
};

// Mapping function to convert enum values to display values
const formatDepartmentName = (department: string) => {
  const departmentMapping: { [key: string]: string } = {
    customer_support: "customer service",
    management: "management",
    finance: "finance",
    human_resources: "human resources",
    marketing: "marketing",
    sales: "sales",
    it: "information technology",
    operations: "operations",
    research_development: "research & development",
  };

  return departmentMapping[department] || department;
};

interface UserStatus {
  userId: string;
  status: string;
  value: string;
}

export default function TeamManagementTableList({
  user,
  setUserStatus,
}: {
  user: MasterUserResultType | any;
  setUserStatus: React.Dispatch<React.SetStateAction<UserStatus>>;
}) {
  // hash value url
  const hash = window.location.hash.replace("#", "");
  // loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<MasterUserResultType | {}>({});
  const [editMode, setEditMode] = useState<boolean>(() =>
    hash === "edit" ? true : false
  );
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [teamId, setTeamId] = useState<string>("");

  const dispatch = useAppDispatch();

  // handle user request
  const handleUserRequest = async () => {
    const status = () => {
      if (selectedRequest === "accept") {
        return "accepted";
      } else if (selectedRequest === "reject") {
        return "rejected";
      }
    };

    dispatch(setLoading(true));
    const updateData = await fetchUserRequestForMaster(user.id, {
      accountStatus: status(),
    });

    // update user info with client if success
    if (updateData.success) {
      setUserInfo(updateData.results);
    }

    // display message
    dispatch(
      setMsg({ success: updateData.success, message: updateData.message })
    );

    // close the alart window
    setDangerModalOpen(false);
    dispatch(setLoading(false));
  };

  // Reset selectedUser when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setSelectedUser(null);
    }
  }, [modalOpen]);

  // Fetch team ID
  useEffect(() => {
    const fetchTeamId = async () => {
      try {
        const response = await getTeamId();
        setTeamId(response.teamId);
      } catch (error) {
        console.error("Error fetching team ID:", error);
      }
    };
    fetchTeamId();
  }, []);

  return (
    <>
      <td className="hidden">
        <AlertWindow
          title={`${selectedRequest} User Request`}
          content={`Are you sure you want to ${selectedRequest} this user?`}
          yesBtnText={selectedRequest}
          noBtnText="Cancel"
          handleYesBtnClick={handleUserRequest}
          dangerModalOpen={dangerModalOpen}
          setDangerModalOpen={setDangerModalOpen}
        />
      </td>
      {/* User ID */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-blue-400">#{user.refId}</div>
      </td>
      {/* Full Name */}
      <td className="table-list-field">
        <div className="group">
          {/* Truncated Full Name */}
          <div className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[100px]">
            {`${user?.firstName} ${user?.lastName}`}
          </div>
          <div className="relative">
            {/* Tooltip with Full Name */}
            <div className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded px-2 py-1 group-hover:block">
              {`${user?.firstName} ${user?.lastName}`}
            </div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="table-list-field">
        <div className="group">
          {/* Truncated Email */}
          <div className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[150px]">
            {user.email?.split("@")[0]}...
          </div>
          {/* Tooltip with Full Email */}
          <div className="relative">
            <div className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded px-2 py-1 group-hover:block">
              {user.email}
            </div>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100 capitalize">
          {user.role}
        </div>
      </td>

      {/* Status */}
      <td className="table-list-field">
        <span className={`capitalize ${getStatusStyle(user.accountStatus)}`}>
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
              user.accountStatus
            )}`}
          ></span>
          {user.accountStatus}
        </span>
      </td>

      {/* login status */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {user.status}
        </div>
      </td>

      {/* Department */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100 capitalize">
          {formatDepartmentName(user.department)}
        </div>
      </td>

      {/* date added */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {user.createdAt ? getFormatDate(user.createdAt) : "N/A"}
        </div>
      </td>

      {/* last login */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {user.lastLogin ? getFormatDate(user.lastLogin) : "N/A"} |{" "}
          {user.lastLogin ? getFormatTime(user.lastLogin) : "N/A"}
        </div>
      </td>

      {/* Actions */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex flex-row-reverse justify-start space-x-1">
          {isDeletable(user.accountStatus) && (
            <button
              className="text-red-400 hover:text-red-500 dark:hover:text-red-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
              onClick={() => {
                setDangerModalOpen(true);
                setSelectedRequest("reject");
              }}
            >
              <Trash2 size={18} />
            </button>
          )}

          {isEditable(user.accountStatus) && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
            >
              <Edit size={18} />
            </button>
          )}

          <button
            onClick={() => {
              setSelectedUser(user);
              setModalOpen(true);
            }}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
          >
            <EyeIcon size={18} />
          </button>
        </div>
      </td>

      {/* Modal */}
      <AddTeamMember
        dangerModalOpen={modalOpen}
        setDangerModalOpen={setModalOpen}
        teamId={teamId}
        onSuccess={undefined}
        selectedUser={selectedUser}
      />
    </>
  );
}

// Helper function to check if the ticket is editable
const isEditable = (status: string) => {
  return ["rejected"].includes(status?.toLowerCase());
};

// Helper function to check if the ticket is view-only
const isDeletable = (status: string) => {
  return ["pending", "blocked", "rejected"].includes(status?.toLowerCase());
};
