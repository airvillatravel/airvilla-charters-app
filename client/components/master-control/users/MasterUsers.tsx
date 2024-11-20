"use client";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProgressLoading from "../../utils/ProgressLoading";
import useMasterUserAuth from "@/components/hooks/useMasterUserAuth";
import {
  MasterUserDataType,
  MasterUserResultType,
} from "@/utils/definitions/masterDefinitions";
import {
  fetchAllSearchUsersForMaster,
  fetchDeleteUsersForMaster,
  fetchUserRequestForMaster,
} from "@/lib/data/masterUsersData";
import { useInView } from "react-intersection-observer";
import SearchUsersMasterBar from "./SearchUsersMasterBar";
import { setLoading } from "@/redux/features/LoadingSlice";
import ListLoading from "@/components/flight-tickets/myTickets/ListLoading";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import Tabs from "@/components/extra-components/Tabs";
// import MasterUsersTableList from "./MasterUsersTableList";
import FilterClassDropdown from "../tickets-overview/FilterDropdown";
import DateFilter from "./DateFilter";

// Lazy load MasterUsersCard component
const MasterUsersTableList = lazy(() => import("./MasterUsersTableList"));

const accountTypeTypes = [
  { id: 0, value: "all" },
  { id: 1, value: "affiliate" },
  { id: 2, value: "agency" },
];
const subscriptionStatusTypes = [
  { id: 0, value: "all" },
  { id: 1, value: "active" },
  { id: 2, value: "inactive" },
];

function MasterUsersList() {
  // ########## STATES #########
  const dispatch = useAppDispatch();
  const tabs = ["all", "accepted", "pending", "rejected", "suspended"];
  const [selectedTab, setSelectedTab] = useState(() => {
    // Retrieve the selected tab from the URL hash or default to the first tab
    const hash = window.location.hash.replace("#", "");
    return tabs.includes(hash) ? hash : tabs[0];
  });
  const [users, setUsers] = useState<MasterUserResultType[]>([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [userStatus, setUserStatus] = useState<{
    userId: string;
    status: string;
    value: string;
  }>({ userId: "", status: "", value: "" });

  const [filterData, setFilterData] = useState<MasterUserDataType>({
    accountType: "all",
    subscriptionStatus: "all",
    registrationDateFilter: "all time",
    lastLoginFilter: "all time",
  });
  // clicked for reset
  const [resetForm, setResetForm] = useState(false);

  // ############ FUNCTIONS #################
  const loadMoreUsers = async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    const filterString = JSON.stringify(filterData);
    const userData = await fetchAllSearchUsersForMaster(
      filterString,
      selectedTab,
      nextCursor
    );

    setUsers((prevUsers) => {
      const newUsers = userData.results.users.filter(
        (newUser: any) =>
          !prevUsers.some((existingUser) => existingUser.id === newUser.id)
      );
      return [...prevUsers, ...newUsers];
    });
    setNextCursor(userData.results.nextCursor);
    setIsLoading(false);
  };

  // ############### USE EFFECT ###########
  // call to load more users whenever scroll
  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  // fetch search data with debounce
  const debouncedFetchSearchUsers = useDebouncedCallback(async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort previous request
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setUsers([]);
      setNextCursor(null);
      const filterString = JSON.stringify({
        ...filterData,
        searchQuery: query,
      });

      const searchUsers = await fetchAllSearchUsersForMaster(
        filterString,
        selectedTab,
        undefined, // Pass undefined for the cursor if not available
        5, // Page size
        controller.signal // Pass the abort signal
      );

      if (!controller.signal.aborted) {
        setUsers(searchUsers?.results?.users || []);
        setNextCursor(searchUsers?.results?.nextCursor || null);
        setIsLoading(false);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    }
  }, 700);

  // fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setUsers([]);
    setNextCursor(null);
    const filterString = JSON.stringify({
      ...filterData,
      searchQuery: searchInput,
    });

    let data;
    if (selectedTab === "all") {
      data = await fetchAllSearchUsersForMaster(filterString);
    } else {
      data = await fetchAllSearchUsersForMaster(filterString, selectedTab);
    }
    if (data.success && data.results?.users) {
      setUsers(data.results?.users || []);
      setNextCursor(data.results?.nextCursor || null);
    } else {
      console.error("Failed to fetch initial users:", data.message);
    }
    setIsLoading(false);
  }, [filterData, searchInput, selectedTab]);

  useEffect(() => {
    if (searchInput.length === 0) {
      debouncedFetchSearchUsers.cancel();
      fetchData();
    } else {
      debouncedFetchSearchUsers(searchInput);
    }
  }, [searchInput, selectedTab, filterData, fetchData]);

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

  const resetFilters = useCallback(() => {
    setFilterData({
      accountType: "all",
      subscriptionStatus: "all",
      registrationDateFilter: "all time",
      lastLoginFilter: "all time",
    });
  }, []);

  const memoizedFilterDropdowns = useMemo(
    () => (
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1">
          <FilterClassDropdown
            fieldName="Account Type"
            options={accountTypeTypes}
            selectedOption={filterData.accountType}
            onChangeHandler={(accountType) =>
              setFilterData((prev) => ({ ...prev, accountType }))
            }
          />
        </div>
        <div className="flex-1">
          <DateFilter
            filterFormData={filterData}
            setFilterFormData={setFilterData}
            labelName="Registration Date"
            fieldName="registrationDateFilter"
          />
        </div>
        <div className="flex-1">
          <DateFilter
            filterFormData={filterData}
            setFilterFormData={setFilterData}
            labelName="Last Login"
            fieldName="lastLoginFilter"
          />
        </div>
        <div className="flex-1">
          <FilterClassDropdown
            fieldName="Subscription Status"
            options={subscriptionStatusTypes}
            selectedOption={filterData.subscriptionStatus}
            onChangeHandler={(subscriptionStatus) =>
              setFilterData((prev) => ({ ...prev, subscriptionStatus }))
            }
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-300 py-2 px-4 rounded-lg"
          onClick={resetFilters}
        >
          Clean filter
        </button>
      </div>
    ),
    [filterData, resetFilters]
  );

  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-5">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Users
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="relative mb-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg pb-7 pt-5 px-1 sm:px-3 ">
          {memoizedFilterDropdowns}
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
              <span className="text-lg font-semibold">Total Users</span>
            </h2>
            {/* Search form */}
            <SearchUsersMasterBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
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
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                <span className="text-2xl font-bold text-red-500 mr-2">
                  {users?.length}
                </span>
                <span className="text-lg font-semibold">Total Users</span>
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
                      User ID
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Full Name
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Status
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Email
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Account Type
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Subscription Type
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Subscription Status
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Last Login
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Current Wallet Balance
                    </th>
                    <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10 ">
                      Active Tickets
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
                        <MasterUsersTableList
                          key={user.id}
                          user={user}
                          setUserStatus={setUserStatus}
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
    </>
  );
}
export default function MasterUsers() {
  // check user's access
  const loading = useMasterUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <MasterUsersList />
    </div>
  );
}
