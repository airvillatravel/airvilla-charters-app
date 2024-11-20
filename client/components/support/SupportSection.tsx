"use client";
import useAffiliateUserAuth from "../hooks/useAffiliateUserAuth";
import ProgressLoading from "../utils/ProgressLoading";
import axios from "axios";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import React, { useState, useEffect, useRef } from "react";
import { Send, Upload, X } from "lucide-react";
import {
  Category,
  categoryFields,
  categories,
  departmentDescriptions,
} from "@/utils/data/supportFormData";
import Image from "next/image";

const SupportForm = (): JSX.Element => {
  // State for loading state
  const [loading, setLoading] = useState(false);

  // Dispatch function for the Redux store
  const dispatch = useAppDispatch();

  // UI states
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("bug");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef(null);

  // fields validation
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({ subject: "", description: "", category: "", customFields: "" });

  // UI functions
  useEffect(() => {
    setCustomFields({});
  }, [category]);

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const errors: Record<string, string> = {};
    if (!subject) errors.subject = "Subject is required";
    if (!description) errors.description = "Description is required";
    if (!category) errors.category = "Category is required";
    if (!Object.keys(customFields).length) errors.customFields = "Required";
    if (category === "general" && customFields.department === "") {
      errors.customFields = "Department is required";
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length) return;

    // const formData = { subject, description, category, customFields, files };

    // Create a FormData object
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("customFields", JSON.stringify(customFields));

    // Append files
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Here you would typically send the data to your server, including the files
    try {
      // Set loading state to true
      setLoading(true);
      // Send POST request to server for form submission
      let res = await axios.post(
        process.env.SERVER_URL + "/api/submit-feedback",
        formData,
        {
          withCredentials: true, // Ensure credentials are included
        }
      );
      // Extract data from response
      const data: { success: boolean; message: string } = res.data;

      // Clear form if submission is successful
      if (data.success) {
        setSubject("");
        setDescription("");
        setCategory("bug");
        setCustomFields({});
        setFiles([]);
        // Reset file input
        if (fileInputRef.current) {
          (fileInputRef.current as HTMLInputElement).value = "";
        }
      }

      // Dispatch message to Redux store
      dispatch(setMsg({ success: data.success, message: data.message }));

      // Set loading state to false
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      dispatch(
        setMsg({
          success: false,
          message: "Failed to send feedback. Please try again later.",
        })
      );
      // Handle Axios errors
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        return error.response.data;
      } else {
        // Log error if it's not an Axios error
        console.error("Login error:", error.message);
        return {
          success: false,
          message: "Failed to send feedback. Please try again later.",
        };
      }
    }
  };

  return (
    <div className="text-slate-700 dark:text-gray-300 min-h-screen flex items-center justify-center max-w-7xl mx-auto my-8">
      <div className="bg-slate-50 dark:bg-gray-800 rounded-r-lg shadow-xl p-8 w-full min-w-fit max-w-3xl min-h-screen">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Support</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Feedback Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Feedback Category
            </label>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat: any) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategory(cat.value);
                    setSubject("");
                    setDescription("");
                    setCustomFields({});
                    setFiles([]);
                    // Reset file input
                    if (fileInputRef.current) {
                      (fileInputRef.current as HTMLInputElement).value = "";
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-md transition-colors duration-300 shadow-lg border dark:border-transparent ${
                    category === cat.value
                      ? "bg-white dark:bg-gray-700 ring-2 ring-red-500"
                      : "bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <cat.icon size={24} className={cat.color} />
                  <span className="mt-2 text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
            {validationErrors.category && (
              <div className="text-[10px] mt-1 text-rose-500">
                {validationErrors.category}
              </div>
            )}
          </div>

          {/* Severity */}
          {category &&
            categoryFields[category].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2 "
                >
                  {field.label}
                </label>
                {field.type === "select" && (
                  <div>
                    <select
                      id={field.name}
                      value={customFields[field.name] || ""}
                      onChange={(e) =>
                        handleCustomFieldChange(field.name, e.target.value)
                      }
                      className="w-full bg-white dark:bg-gray-700 border-none rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {field.name === "department" &&
                      customFields[field.name] && (
                        <p className="mt-2 text-sm text-gray-400">
                          {departmentDescriptions[customFields[field.name]]}
                        </p>
                      )}
                  </div>
                )}
                {validationErrors.customFields && (
                  <div className="text-[10px] mt-1 text-rose-500">
                    {validationErrors.customFields}
                  </div>
                )}
              </div>
            ))}

          {/* Subject  */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full dark:bg-gray-700 border-none rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none"
              placeholder="Enter the subject of your feedback"
              required
            />
            {validationErrors.subject && (
              <div className="text-[10px] mt-1 text-rose-500">
                {validationErrors.subject}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full dark:bg-gray-700 border-none rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-none h-32"
              placeholder="Provide details about your feedback"
              maxLength={2000}
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              {description.length}/2000 characters
            </p>
            {validationErrors.description && (
              <div className="text-[10px] mt-1 text-rose-500">
                {validationErrors.description}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium mb-2"
            >
              Attachments
            </label>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-white border border-slate-100 dark:border-transparent dark:bg-gray-700 rounded-md font-medium text-red-500 hover:text-red-400 px-4 py-2 text-sm flex items-center"
              >
                <Upload size={18} className="mr-2" />
                Upload Files
                <input
                  id="file-upload"
                  name="files"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <span className="text-sm text-gray-400">
                {files.length} file(s) selected
              </span>
            </div>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-700 rounded-md p-1 text-sm"
                  >
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-400 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin w-4 h-4 fill-current shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function SupportSection() {
  const loading = useAffiliateUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return <SupportForm />;
}
