"use client";
import ThemeToggle from "@/components/theme-toggle";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LucideIcon,
  Home,
  Plane,
  Bell,
  ChevronDown,
  Users,
  FileText,
  User,
  LogOut,
  Settings,
  Mail,
  Ticket,
  CreditCard,
  BarChart4,
  Headphones,
  ListChecks,
  Luggage,
  Cog,
  Wallet,
  X,
  CheckCircle,
  Info,
  Trash2,
  Calendar,
  Check,
  AlertCircle,
  Menu,
  Building,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, selectUser } from "@/redux/features/AuthSlice";
import { fetchLogout } from "@/lib/data/authData";
import { useRouter } from "next/navigation";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { setLoading } from "@/redux/features/LoadingSlice";
import Image from "next/image";
import logo from "@/public/images/logo/airvilla_logo_symbol_red.png";

// Reusable button component
interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  notifications?: number;
}

// Dropdown menu component for navigation items
interface NavDropdownMenuProps {
  title: string;
  icon: LucideIcon;
  items: { icon: React.ReactNode; text: string; link: string }[];
}

// User info header component
interface UserInfoHeaderProps {
  userInfo: {
    firstName: string;
    lastName: string;
    agencyName: string;
    role: string;
    balance: string;
  };
}

interface MenuLinkProps {
  icon: LucideIcon;
  text: string;
  link: string;
  highlighted?: boolean;
  isRed?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// User info header component
interface UserInfoHeaderProps {
  userInfo: {
    firstName: string;
    lastName: string;
    agencyName: string;
    role: string;
    balance: string;
  };
  toggleDropdown: () => void;
}

export default function Header() {
  return <NavigationBar />;
}

// Custom hook for managing screen size
const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

// Reusable button component
const IconButton = ({
  icon: Icon,
  onClick,
  className = "",
  notifications = 0,
}: IconButtonProps) => (
  <div className="relative">
    <button
      onClick={onClick}
      className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 ${className}`}
    >
      <Icon size={20} />
    </button>
    {notifications > 0 && (
      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
        {notifications}
      </span>
    )}
  </div>
);

// Dropdown menu component for navigation items
const NavDropdownMenu = ({
  title,
  icon: Icon,
  items,
}: NavDropdownMenuProps) => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useScreenSize();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenMenu(false);
      }
    };

    // Add event listener when the dropdown is open
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500 cursor-pointer rounded-lg transition duration-300"
      >
        <span className="flex items-center justify-center">
          <Icon size={20} className="mr-2" />
          {title}
        </span>
        <ChevronDown size={20} className="ml-1" />
      </button>
      {isOpenMenu && (
        <div
          className={`${
            isMobile ? "relative" : "absolute"
          } z-10 py-2 mt-2 bg-gray-50 dark:bg-gray-700 rounded-md shadow-xl w-full`}
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center px-4 py-2 text-sm  hover:bg-gray-200 hover:text-red-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-500"
            >
              {item.icon}
              <span className="ml-2">{item.text}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// User info header component
const UserInfoHeader = ({ userInfo, toggleDropdown }: UserInfoHeaderProps) => (
  <div className=" dark:text-gray-200 rounded-lg font-sans">
    <div className="mb-1">
      <div className="flex justify-between space-x-3 px-4 py-1">
        <div className="flex space-x-3 pr-4 py-1">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-500 dark:text-gray-300" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-50 dark:border-gray-800"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <X
          size={28}
          onClick={toggleDropdown}
          className="text-gray-700 hover:text-white dark:text-white dark:hover:text-gray-100 bg-transparent hover:bg-red-600 rounded-full p-1 transition duration-300"
        />
      </div>
      <div className="flex items-center justify-between cursor-pointer p-2 rounded text-base ml-2">
        <div className="flex items-center space-x-2">
          <Users size={18} />
          <p className="font-medium text-gray-500 dark:text-gray-300 capitalize">
            {userInfo.role}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between cursor-pointer p-2 rounded text-base ml-2">
        <div className="flex items-center space-x-2">
          <Building size={18} />
          <p className="font-medium text-gray-500 dark:text-gray-300">
            {userInfo.agencyName}
          </p>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
    <div className="mt-2 text-base text-gray-600 dark:text-gray-300">
      <div className="flex items-center space-x-2 px-4 py-2">
        <CreditCard size={18} />
        <span>
          Balance:{" "}
          <span className="font-medium text-green-500 dark:text-green-400 ml-1">
            $ {userInfo.balance}
          </span>
        </span>
      </div>
    </div>
    <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
  </div>
);

const MenuLink = ({
  icon: Icon,
  text,
  link,
  highlighted = false,
  isRed = false,
  onClick,
}: MenuLinkProps) => {
  const baseClass = `w-full text-left block px-4 py-2 text-sm ${
    isRed
      ? "text-red-500"
      : highlighted
      ? "text-blue-500 font-medium"
      : "text-gray-500 dark:text-gray-300"
  } hover:bg-gray-200 hover:text-red-500 dark:hover:text-red-500 dark:hover:bg-gray-800 flex items-center space-x-2`;

  return onClick ? (
    <button onClick={onClick} className={baseClass} role="menuitem">
      <Icon size={18} />
      <span>{text}</span>
    </button>
  ) : (
    <Link href={link} className={baseClass} role="menuitem">
      <Icon size={18} />
      <span>{text}</span>
    </Link>
  );
};
// Logo placeholder component
const LogoPlaceholder = () => (
  <Link
    href="/blockseats"
    className="flex items-center justify-center rounded-lg w-10 h-10"
  >
    <Image src={logo} alt="logo" />
  </Link>
);

// Navigation bar component
const NavigationBar = React.memo(() => {
  const user: any = useAppSelector(selectUser);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useScreenSize();
  const toggleMenu = () => setIsNavOpen(!isNavOpen);

  // State for managing the visibility of the message popup
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Memoized handlers for opening and closing the message popup
  const handleMessageClick = () => {
    setIsMessageOpen((prevState) => !prevState);
    setIsMenuOpen(false); // Close menu
    setIsNotificationsOpen(false); // Close notifications
  };
  const handleNotificationsClick = () => {
    setIsNotificationsOpen((prevState) => !prevState);
    setIsMessageOpen(false); // Close messages
    setIsMenuOpen(false); // Close menu
  };
  const toggleDropdown = () => {
    setIsMenuOpen((prevState) => !prevState);
    setIsMessageOpen(false); // Close messages
    setIsNotificationsOpen(false); // Close notifications
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNavOpen(!isNavOpen);
      }
    };

    // Add event listener when the dropdown is open
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);

  const dropdownRef2 = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsMessageOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMessageOpen, isNotificationsOpen, isMenuOpen]);
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg min-h-[72px] h-[72px] content-center">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoPlaceholder />
            <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
              {user.agencyName}
            </span>
          </div>

          {isMobile ? (
            <IconButton
              icon={isNavOpen ? X : Menu}
              onClick={toggleMenu}
              className="xl:hidden"
            />
          ) : (
            <>
              <NavItems isMobile={false} />
              <RightSideItems
                onMessageClick={handleMessageClick}
                onNotificationsClick={handleNotificationsClick}
                toggleDropdown={toggleDropdown}
                isMobile={false}
              />
              <div className="relative" ref={dropdownRef2}>
                <div className="absolute top-0 md:top-8 right-0 mt-2 z-40 md:w-96">
                  {isMessageOpen && (
                    <MessagePopup onClose={handleMessageClick} />
                  )}
                  {isNotificationsOpen && (
                    <NotificationsComponent
                      isNotificationsOpen={isNotificationsOpen}
                      onCloseNotifications={handleNotificationsClick}
                    />
                  )}
                </div>
                <div className="absolute top-0 md:top-8 right-0 mt-2 z-40 md:w-72">
                  {isMenuOpen && (
                    <UserMenu
                      isMenuOpen={isMenuOpen}
                      toggleDropdown={toggleDropdown}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isMobile && isNavOpen && (
        <div className="block xl:hidden bg-white dark:bg-gray-800 absolute z-40 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" ref={dropdownRef}>
            <NavItems isMobile={true} />
            <RightSideItems
              onMessageClick={handleMessageClick}
              onNotificationsClick={handleNotificationsClick}
              toggleDropdown={toggleDropdown}
              isMobile={true}
            />
            <div className="relative" ref={dropdownRef2}>
              <div className="absolute top-2 xl:top-8 right-0 md:right-1/3 mt-2 z-40 w-full md:w-72">
                {isMessageOpen && <MessagePopup onClose={handleMessageClick} />}
                {isNotificationsOpen && (
                  <NotificationsComponent
                    isNotificationsOpen={isNotificationsOpen}
                    onCloseNotifications={handleNotificationsClick}
                  />
                )}
                {isMenuOpen && (
                  <UserMenu
                    isMenuOpen={isMenuOpen}
                    toggleDropdown={toggleDropdown}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

// Navigation items component
const NavItems = ({ isMobile }: { isMobile: boolean }) => {
  const user: any = useAppSelector(selectUser);
  return (
    <div
      className={
        isMobile
          ? "flex flex-col space-y-2"
          : "flex space-y-0 space-x-4 mx-auto"
      }
    >
      <Link
        href="/blockseats"
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-red-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-500 cursor-pointer rounded-lg transition duration-300"
      >
        <Home size={20} className="mr-2" />
        Home
      </Link>
      <NavDropdownMenu
        title="Ticket Hub"
        icon={Ticket}
        items={[
          {
            icon: <Ticket size={18} />,
            text: "My Tickets",
            link: "/flight-tickets/myTickets",
          },
          { icon: <Luggage size={18} />, text: "My Bookings", link: "" },
          { icon: <CreditCard size={18} />, text: "My Sales", link: "" },
        ]}
      />
      {user.role !== "affiliate" ? (
        <NavDropdownMenu
          title={user.role === "master" ? "Master Hub" : "Agency Hub"}
          icon={Cog}
          items={[
            {
              icon: <Settings size={18} />,
              text: "Settings",
              link: "/account-hub/account-overview",
            },
            // Conditionally include "Users" item only if user is "agency"
            ...(user.role === "agency"
              ? [
                  {
                    icon: <Users size={18} />,
                    text: "Users",
                    link: "/account-hub/organization-settings",
                  },
                ]
              : []),
            { icon: <FileText size={18} />, text: "Reports", link: "" },
            { icon: <Wallet size={18} />, text: "Wallet", link: "" },
          ]}
        />
      ) : (
        ""
      )}
      {user.role === "master" ? (
        <NavDropdownMenu
          title="Master Control"
          icon={Settings}
          items={[
            {
              icon: <Users size={18} />,
              text: "Users",
              link: "/master-control/users",
            },
            {
              icon: <Users size={18} />,
              text: "Team Management",
              link: "/master-control/team-management",
            },
            {
              icon: <FileText size={18} />,
              text: "Ticket Requests",
              link: "/master-control/ticket-requests",
            },
            {
              icon: <ListChecks size={18} />,
              text: "Tickets Overview",
              link: "/master-control/tickets-overview",
            },
          ]}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const NotificationsComponent = ({
  isNotificationsOpen,
  onCloseNotifications,
}: {
  isNotificationsOpen: boolean;
  onCloseNotifications: () => void;
}) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system",
      title: "Scheduled Maintenance",
      message: "The site will be down for maintenance on S...",
      time: "1d ago",
      isRead: false,
    },
    {
      id: 2,
      type: "system",
      title: "New Feature Alert",
      message: "Check out our new booking interface for a s...",
      time: "3d ago",
      isRead: false,
    },
    {
      id: 3,
      type: "flight",
      title: "Flight Update",
      message: "Your flight to Paris has been reschedul...",
      time: "2h ago",
      isRead: false,
    },
    {
      id: 4,
      type: "booking",
      title: "Booking Confirmed",
      message: "Your hotel booking in Rome is confirm...",
      time: "1d ago",
      isRead: false,
    },
    {
      id: 5,
      type: "info",
      title: "New travel advisory for your upcoming trip.",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 6,
      type: "success",
      title: "Your refund has been processed successfully.",
      time: "3 hours ago",
      isRead: false,
    },
    {
      id: 7,
      type: "alert",
      title: "Flight BA123 has been delayed by 2 hours.",
      time: "Yesterday",
      isRead: false,
    },
    {
      id: 8,
      type: "event",
      title: "Reminder: Check-in opens in 24 hours.",
      time: "2 days ago",
      isRead: true,
    },
    {
      id: 9,
      type: "flight",
      title: "Gate change for your flight to Paris.",
      time: "3 days ago",
      isRead: true,
    },
    {
      id: 10,
      type: "info",
      title: "New promotion: 20% off on selected flights.",
      time: "4 days ago",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const markAsClicked = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Icon mapping based on notification type
  const iconMap: { [key: string]: React.ElementType } = {
    info: Info,
    alert: AlertCircle,
    success: Check,
    event: Calendar,
    flight: Plane,
  };

  return (
    <div className="font-sans bg-white text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg shadow-lg">
      {isNotificationsOpen && (
        <div className="rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-700 dark:text-white">
          <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-semibold space-x-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-xs font-semibold text-white rounded-full px-2 py-1">
                  {unreadCount} new
                </span>
              )}
            </h2>
            <X
              size={28}
              onClick={onCloseNotifications}
              className="text-gray-700 hover:text-white dark:text-white dark:hover:text-gray-100 bg-transparent hover:bg-red-600 rounded-full p-1 transition duration-300"
            />
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 && (
              <div className="bg-white dark:bg-gray-700">
                {notifications.map((notification) => {
                  // Determine which icon to use based on the notification type
                  const IconComponent = iconMap[notification.type] || Bell;
                  return (
                    <div
                      key={notification.id}
                      className="p-4 cursor-pointer bg-white dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600"
                      onClick={() => markAsClicked(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 relative">
                          <IconComponent
                            className="text-gray-500 dark:text-gray-400 mr-2"
                            size={20}
                          />
                          {!notification.isRead && (
                            <div className="absolute -top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="ml-2 flex items-center justify-between space-x-2">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            <div className="ml-2 flex items-center space-x-2">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsClicked(notification.id);
                                  }}
                                  className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition duration-300"
                                  title="Mark as Read"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600 transition duration-300"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="p-4 text-center">No notifications</div>
          )}

          {notifications.length > 0 && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button className="w-full text-center text-sm text-blue-500 hover:underline">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const UserMenu = React.memo(
  ({
    isMenuOpen,
    toggleDropdown,
  }: {
    isMenuOpen: boolean;
    toggleDropdown: () => void;
  }) => {
    const dispatch = useAppDispatch();
    const user: any = useAppSelector(selectUser);
    const router = useRouter();

    const [userInfo] = useState({
      firstName: user && user.isLogin ? user.firstName : "",
      lastName: user && user.isLogin ? user.lastName : "",
      agencyName: user && user.isLogin ? user.agencyName : "",
      role: user && user.isLogin ? user.role : "",
      balance: "0",
    });

    // Close menu when clicking outside

    // handle logout function
    const handleLogout = async () => {
      dispatch(setLoading(true));
      // clean all cookies
      const logout = await fetchLogout();

      // remove all cookies & set isLogin to false
      if (logout?.success) dispatch(logoutUser());

      // send a success msg
      if (logout?.success) {
        // redirect to login page
        router.push("/signin");
      }

      dispatch(setMsg({ success: logout.success, message: logout.message }));

      dispatch(setLoading(false));
    };
    return (
      <>
        {isMenuOpen && (
          // absolute top-12 right-0 mt-2 md:w-96
          <div
            className="
         rounded-md shadow-lg bg-gray-50 dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-40"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <UserInfoHeader
                userInfo={userInfo}
                toggleDropdown={toggleDropdown}
              />
              <MenuLink icon={PieChart} text="Dashboard" link="/dashboard" />
              <MenuLink icon={Luggage} text="My Bookings" link="" />
              <MenuLink icon={BarChart4} text="Reports" link="" />
              <MenuLink
                icon={Settings}
                text="Settings"
                highlighted
                link="/account-hub/account-overview"
              />
              <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
              <MenuLink
                icon={Headphones}
                text="Help & Support"
                link="/support"
              />
              <ThemeToggle />
              <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
              <MenuLink
                icon={LogOut}
                text="Sign Out"
                isRed={true}
                link=""
                onClick={handleLogout}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

// Right side items component
const RightSideItems = React.memo(
  ({
    onMessageClick,
    onNotificationsClick,
    toggleDropdown,
    isMobile,
  }: {
    onMessageClick: () => void;
    onNotificationsClick: () => void;
    toggleDropdown: () => void;
    isMobile: boolean;
  }) => {
    return (
      <div
        className={
          isMobile
            ? "flex flex-col items-stretch space-y-2"
            : "flex items-center space-y-0 space-x-4"
        }
      >
        <Link href="/blockseats">
          <button className="bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-lg transition duration-300 flex justify-center items-center w-full my-4 xl:my-0">
            <Plane size={20} className="mr-2" />
            Search for Flights
          </button>
        </Link>
        <div className="flex items-center justify-center space-x-2">
          <IconButton icon={Mail} onClick={onMessageClick} notifications={4} />
          <IconButton
            icon={Bell}
            onClick={onNotificationsClick}
            notifications={4}
          />
          <IconButton
            icon={User}
            onClick={toggleDropdown}
            className="dark:bg-gray-800 dark:hover:bg-gray-700"
          />
        </div>
      </div>
    );
  }
);

// Message Popup Component
// This component displays a list of messages in a popup
const MessagePopup = React.memo(({ onClose }: { onClose: () => void }) => {
  // Sample messages data
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Hi there! Just checking on the flight details.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "Your booking has been confirmed.",
      time: "Yesterday",
    },
    {
      id: 3,
      sender: "Support Team",
      content: "We've processed your refund request.",
      time: "2 days ago",
    },
    {
      id: 4,
      sender: "Alice Johnson",
      content: "Your flight to Paris has been rescheduled.",
      time: "3 days ago",
    },
    {
      id: 5,
      sender: "Bob Williams",
      content: "New promotional offer available for your next booking!",
      time: "4 days ago",
    },
    {
      id: 6,
      sender: "Customer Service",
      content: "How was your recent flight experience?",
      time: "5 days ago",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden h-full z-40">
      <div className="py-4 px-6 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          Messages
        </h3>
        <X
          size={28}
          onClick={onClose}
          className="text-gray-700 hover:text-white dark:text-white dark:hover:text-gray-100 bg-transparent hover:bg-red-600 rounded-full p-1 transition duration-300"
        />
      </div>
      <div
        className="overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(300px)" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className="py-4 px-6 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {message.sender}
              </span>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {message.content}
            </p>
          </div>
        ))}
      </div>
      <div className="py-4 px-6">
        <a
          href="#"
          className="block text-center text-blue-500 hover:text-blue-400"
        >
          View All Messages
        </a>
      </div>
    </div>
  );
});
