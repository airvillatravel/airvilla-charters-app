"use client";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import ProgressLoading from "../../utils/ProgressLoading";
import MasterUsersTab from "../users/MasterUsersTab";
import useMasterUserAuth from "@/components/hooks/useMasterUserAuth";

import {
  MasterUserDataType,
  MasterUserResultType,
  TeamMemberDataType,
} from "@/utils/definitions/masterDefinitions";
import {
  fetchAllSearchUsersForMaster,
  fetchAllUsersForMaster,
  fetchDeleteUsersForMaster,
  fetchUserRequestForMaster,
} from "@/lib/data/masterUsersData";
import { useInView } from "react-intersection-observer";
import SearchUsersMasterBar from "../users/SearchUsersMasterBar";
import { setLoading } from "@/redux/features/LoadingSlice";
import ListLoading from "@/components/flight-tickets/myTickets/ListLoading";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import Tabs from "@/components/extra-components/Tabs";
import MasterUsersList from "../users/MasterUsersTableList";
import { date } from "joi";
import FilterClassDropdown from "../tickets-overview/FilterDropdown";
import DateFilter from "@/components/master-control/users/DateFilter";
import { Calculator, PlusCircle, Shield, Users } from "lucide-react";
import Link from "next/link";
import AddTeamMember from "./AddTeamMember";
import {
  fetchAllSearchTeamMembers,
  fetchAllTeamMembers,
  getTeamId,
} from "@/lib/data/teamData";
import TeamManagementTableList from "./TeamManagementList";

const accountTypeTypes = [
  { id: 0, value: "all" },
  { id: 1, value: "master" },
  { id: 2, value: "moderator" },
  { id: 3, value: "accountant" },
];

const departmentType = [
  { id: 0, value: "all", enumValue: "all" },
  { id: 1, value: "customer service", enumValue: "customer_support" },
  { id: 2, value: "management", enumValue: "management" },
  { id: 3, value: "finance", enumValue: "finance" },
  { id: 4, value: "human resources", enumValue: "human_resources" },
  { id: 5, value: "marketing", enumValue: "marketing" },
  { id: 6, value: "sales", enumValue: "sales" },
  { id: 7, value: "information technology", enumValue: "it" },
  { id: 8, value: "operations", enumValue: "operations" },
  { id: 9, value: "research & development", enumValue: "research_development" },
];

const getEnumValueFromDisplay = (displayValue: string): string | undefined => {
  const result = departmentType.find((opt) => opt.value === displayValue);
  return result?.enumValue;
};
const formatDepartmentName = (department: string): string => {
  return (
    departmentType.find((opt) => opt.enumValue === department)?.value ||
    department
  );
};

function TeamManagementList() {
  // ########## STATES #########
  const dispatch = useAppDispatch();
  const tabs = ["all", "master", "moderator", "accountant"];
  const [selectedTab, setSelectedTab] = useState(() => {
    // Retrieve the selected tab from the URL hash or default to the first tab
    const hash = window.location.hash.replace("#", "");
    return tabs.includes(hash) ? hash : tabs[0];
  });
  const [users, setUsers] = useState<MasterUserResultType[]>([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [teamId, setTeamId] = useState<string>("");
  const { ref, inView } = useInView();
  const [userStatus, setUserStatus] = useState<{
    userId: string;
    status: string;
    value: string;
  }>({ userId: "", status: "", value: "" });

  const [filterData, setFilterData] = useState<TeamMemberDataType>({
    accountType: "all",
    department: "all",
    registrationDateFilter: "all time",
    lastLoginFilter: "all time",
  });
  // clicked for reset
  const [resetForm, setResetForm] = useState(false);

  // ############ FUNCTIONS #################
  // Pass enumValue to Prisma instead of the display value
  const handleDepartmentChange = (departmentEnum: string) => {
    setFilterData({ ...filterData, department: departmentEnum }); // Use enum value for saving
  };

  const loadMoreUsers = async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    const searchQuery = {
      searchQuery: searchInput,
      ...filterData,
      role: selectedTab,
    };
    const filterString = JSON.stringify(searchQuery);
    const userData = await fetchAllSearchTeamMembers(
      filterString,
      selectedTab,
      nextCursor
    );
    setUsers((prevUsers) => [...prevUsers, ...userData.results.users]);
    setNextCursor(userData.results.nextCursor);
    setIsLoading(false);
  };

  // ############### USE EFFECT ###########
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
  // call to load more users whenever scroll
  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  // fetch search data with debounce
  const debouncedFetchSearchUsers = useDebouncedCallback(async (query) => {
    setIsLoading(true);
    setUsers([]);
    setNextCursor(null);
    const searchQuery = {
      searchQuery: searchInput,
      ...query,
      role: selectedTab,
    };
    const filterString = JSON.stringify(searchQuery);
    const searchUsers = await fetchAllSearchTeamMembers(
      filterString,
      selectedTab
    );
    setUsers(searchUsers?.results?.users);
    setIsLoading(false);
  }, 700);

  // fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setUsers([]);
    setNextCursor(null);
    let data;
    if (selectedTab === "all") {
      data = await fetchAllTeamMembers();
    } else {
      const searchQuery = {
        searchQuery: searchInput,
        ...filterData,
        role: selectedTab,
      };
      const filterString = JSON.stringify(searchQuery);
      data = await fetchAllSearchTeamMembers(filterString, selectedTab);
    }
    console.log({ data });
    setUsers(data.results?.users || data.results);
    setIsLoading(false);
  };

  // call it when there a search input or filters change
  useEffect(() => {
    if (
      searchInput.length > 0 ||
      filterData.accountType !== "all" ||
      filterData.department !== "all" ||
      filterData.registrationDateFilter !== "all time" ||
      filterData.lastLoginFilter !== "all time"
    ) {
      debouncedFetchSearchUsers(filterData);
    } else {
      fetchData();
    }
  }, [searchInput, filterData, selectedTab, debouncedFetchSearchUsers]);

  // UPDATE & DELETE USER
  useEffect(() => {
    const updateUserStatus = async () => {
      dispatch(setLoading(true));
      const updateData = await fetchUserRequestForMaster(userStatus.userId, {
        accountStatus: userStatus.value,
      });

      // update user info with client if success
      if (updateData.success) {
        fetchData();
      }

      // display message
      dispatch(
        setMsg({ success: updateData.success, message: updateData.message })
      );

      dispatch(setLoading(false));
    };

    const deleteUser = async () => {
      dispatch(setLoading(true));

      // send req to delete the user
      const DeleteUser = await fetchDeleteUsersForMaster(userStatus.userId);

      if (DeleteUser.success) {
        setUsers(users.filter((user) => user.id !== userStatus.userId));
      }

      // show the message
      dispatch(
        setMsg({
          success: DeleteUser.success,
          message: DeleteUser.message,
        })
      );

      dispatch(setLoading(false));
    };

    // if user update
    if (userStatus.status === "update") {
      updateUserStatus();
    }

    // if delete user
    if (userStatus.status === "delete") {
      deleteUser();
    }
  }, [userStatus.userId]);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-5">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Internal Team Management
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="relative mb-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg pb-7 pt-5 px-1 sm:px-3 ">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
            {/*  Account Type*/}
            <div className="flex-1">
              <FilterClassDropdown
                fieldName="Account Type"
                options={accountTypeTypes}
                selectedOption={filterData.accountType}
                onChangeHandler={(accountType) =>
                  setFilterData({ ...filterData, accountType })
                }
              />
            </div>

            {/* Registration Date filter */}
            <div className="flex-1">
              <DateFilter
                filterFormData={filterData}
                setFilterFormData={(formData) => setFilterData(formData)}
                labelName="Registration Date"
                fieldName="registrationDateFilter"
              />
            </div>

            {/* Last Login filter */}
            <div className="flex-1">
              <DateFilter
                filterFormData={filterData}
                setFilterFormData={(formData) => setFilterData(formData)}
                labelName="Last Login"
                fieldName="lastLoginFilter"
              />
            </div>

            {/* Department filter */}
            <div className="flex-1">
              <FilterClassDropdown
                fieldName="Department Type"
                options={departmentType.map(({ id, value }) => ({
                  id,
                  value,
                }))}
                selectedOption={formatDepartmentName(filterData.department)}
                onChangeHandler={(selectedDisplayValue) => {
                  const selectedEnumValue =
                    getEnumValueFromDisplay(selectedDisplayValue);

                  if (selectedEnumValue) {
                    handleDepartmentChange(selectedEnumValue); // Set enum value in filterData
                  }
                }}
              />
            </div>

            {/* Clear filter */}
            <button
              type="button"
              className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-300 py-2 px-4 rounded-lg"
              onClick={() => {
                setFilterData({
                  accountType: "all",
                  department: "all",
                  registrationDateFilter: "all time",
                  lastLoginFilter: "all time",
                });
                setResetForm(true);
              }}
            >
              Clean filter
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg relative overflow-hidden max-w-7xl mx-auto">
        {/* SMALL SCREENS */}
        <header className="xl:hidden bg-gray-50 dark:bg-gray-800 py-4 px-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between border-b border-gray-300 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between w-full">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
              <span className="text-2xl font-bold text-red-500 mr-2">
                {users?.length}
              </span>
              <span className="text-lg font-semibold">Total Team Members</span>
            </h2>
            {/* Search form */}
            <SearchUsersMasterBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            {/* Add Team Member button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-300"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <PlusCircle size={20} className="mr-2" />
              <span className=" ml-2">Add Team Member</span>
            </button>
          </div>
          <div className="w-full overflow-x-auto mt-8 xl:mt-0">
            {/* Tabs */}
            <Tabs
              tabs={tabs}
              selectedTab={selectedTab}
              onChangeHandler={setSelectedTab}
            />
          </div>
        </header>

        {/* LARGE SCREENS */}
        <header className="hidden bg-gray-50 dark:bg-gray-800 py-4 px-6 xl:flex flex-col sm:flex-row sm:flex-wrap items-center justify-between border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center flex-1 space-x-6 w-full sm:w-auto mt-4 sm:mt-0">
            <div className="flex items-center space-x-6 flex-1">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 flex justify-center items-center content-center">
                <span className="text-2xl font-bold text-red-500 mr-2 flex justify-center items-center content-center space-x-2">
                  <Users />
                  <span>{users?.length}</span>
                </span>
                <span className="text-lg font-semibold">
                  Total Team Members
                </span>
              </h2>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
              {/* Tabs */}
              <Tabs
                tabs={tabs}
                selectedTab={selectedTab}
                onChangeHandler={setSelectedTab}
              />
            </div>
            {/* Search form */}
            <SearchUsersMasterBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            {/* Add Team Member button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-300"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <PlusCircle size={20} className="mr-2" />
              <span className=" ml-2">Add Team Member</span>
            </button>
          </div>
        </header>
        <div>
          {/* Table */}
          <div
            className="overflow-x-auto custom-scrollbar"
            style={{ maxHeight: "calc(100vh - 400px)" }}
          >
            <Suspense
              fallback={
                <div className="py-3 w-full">
                  <div className="flex justify-center">
                    <ListLoading />
                  </div>
                </div>
              }
            >
              <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs font-semibold capitalize text-gray-800 dark:text-gray-50 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-200 dark:border-gray-700 text-left sticky -top-0.5">
                  <tr>
                    <th className="pl-2 p-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Employee ID
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Full Name
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Email
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Role
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Account Status
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Login Status
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Department
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Date Added
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Last Login
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table body */}

                <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {users &&
                    users.map((user, index) => (
                      <tr ref={ref} key={index}>
                        <TeamManagementTableList
                          user={user}
                          setUserStatus={setUserStatus}
                          key={user.id}
                        />
                      </tr>
                    ))}
                </tbody>
              </table>
              {users && users.length === 0 && isLoading === false && (
                <h1 className="text-center text-lg mt-10">No Users Found</h1>
              )}
              {isLoading && (
                <div className="py-3 w-full">
                  <div className="flex justify-center">
                    <ListLoading />
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Model */}
      <AddTeamMember
        dangerModalOpen={modalOpen}
        setDangerModalOpen={setModalOpen}
        teamId={teamId}
        onSuccess={fetchData}
      />
    </>
  );
}
export default function TeamManagement() {
  // check user's access
  const loading = useMasterUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <TeamManagementList />
    </div>
  );
}
