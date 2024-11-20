import React, { useState, useEffect } from "react";
import ModalBlank from "../../modal-blank";
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import axios from "axios";
import { createTeamMember, updateTeamMember } from "@/lib/data/teamData";

// Enums matching Prisma schema
enum TeamMemberRole {
  master = "master",
  moderator = "moderator",
  accountant = "accountant",
}

enum Department {
  customer_support = "customer_support",
  management = "management",
  finance = "finance",
  human_resources = "human_resources",
  marketing = "marketing",
  sales = "sales",
  it = "it",
  operations = "operations",
  research_development = "research_development",
}

interface AddTeamMemberProps {
  dangerModalOpen: boolean;
  setDangerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamId: string;
  onSuccess?: () => void;
  selectedUser?: any;
}

export default function AddTeamMember({
  dangerModalOpen,
  setDangerModalOpen,
  teamId,
  onSuccess,
  selectedUser,
}: AddTeamMemberProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: TeamMemberRole.moderator,
    department: Department.customer_support,
  });

  // Update form data when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        password: "",
        confirmPassword: "",
        role: selectedUser.role || TeamMemberRole.moderator,
        department: selectedUser.department || Department.customer_support,
      });
      setIsEditMode(false); // Reset edit mode when user changes
    } else {
      // Reset form when no user is selected
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: TeamMemberRole.moderator,
        department: Department.customer_support,
      });
    }
  }, [selectedUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate passwords if this is a new user or passwords are being changed
    if (!selectedUser || formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (selectedUser && isEditMode) {
        // Update existing team member
        response = await updateTeamMember(selectedUser.id, {
          ...formData,
          teamId,
          // Only include password if it was changed
          ...(formData.password ? { password: formData.password } : {}),
        });
      } else {
        // Create new team member
        response = await createTeamMember({
          ...formData,
          teamId,
          invitedById: localStorage.getItem("userId"),
        });
      }

      if (response) {
        setSuccessMessage(
          response?.data?.message ||
            (selectedUser
              ? "Team member updated successfully!"
              : "Team member added successfully!")
        );
        setDangerModalOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (selectedUser
            ? "Failed to update team member"
            : "Failed to add team member")
      );
    } finally {
      setLoading(false);
    }
  };

  const ROLES = Object.values(TeamMemberRole);
  const DEPARTMENTS = Object.entries(Department).map(([key]) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  return (
    <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 p-0 md:p-4 z-50 content-center"
        tabIndex={-1}
      >
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg max-w-lg min-w-80 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {selectedUser
                ? isEditMode
                  ? "Edit Team Member"
                  : "View Team Member"
                : "Add Team Member"}
            </h2>
            <button
              onClick={() => setDangerModalOpen(false)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 bg-red-500 p-2 text-center rounded-lg"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter member's first name"
                  required
                  readOnly={selectedUser && !isEditMode}
                  className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    selectedUser && !isEditMode
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter member's last name"
                  required
                  readOnly={selectedUser && !isEditMode}
                  className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    selectedUser && !isEditMode
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter member's email address"
                required
                readOnly={selectedUser && !isEditMode}
                className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                  selectedUser && !isEditMode
                    ? "opacity-75 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>

            {(!selectedUser || isEditMode) && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    {isEditMode ? "New Password (optional)" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={
                        isEditMode
                          ? "Enter new password"
                          : "Enter member's password"
                      }
                      required={!selectedUser}
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                  >
                    {isEditMode ? "Confirm New Password" : "Confirm Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={
                        isEditMode
                          ? "Confirm new password"
                          : "Confirm member's password"
                      }
                      required={!selectedUser}
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                disabled={selectedUser && !isEditMode}
                className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none ${
                  selectedUser && !isEditMode
                    ? "opacity-75 cursor-not-allowed"
                    : ""
                }`}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="department"
                className="block text-sm font-medium mb-1"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                disabled={selectedUser && !isEditMode}
                className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none ${
                  selectedUser && !isEditMode
                    ? "opacity-75 cursor-not-allowed"
                    : ""
                }`}
              >
                {DEPARTMENTS.map((department, index) => (
                  <option
                    key={department}
                    value={Object.values(Department)[index]}
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              {selectedUser && !isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Edit
                </button>
              )}

              {(!selectedUser || isEditMode) && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                  } text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⌛</span>
                      {selectedUser ? "Updating..." : "Adding Member..."}
                    </>
                  ) : selectedUser ? (
                    "Update Member"
                  ) : (
                    "Add Member"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ModalBlank>
  );
}
