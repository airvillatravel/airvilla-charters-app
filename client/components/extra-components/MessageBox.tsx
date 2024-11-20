"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectActionMsg } from "@/redux/features/ActionMsgSlice";
import Toast from "../toast";
import Toast02 from "../toast-02";

const MessageBox = () => {
  const [isVisible, setIsVisible] = useState(false);
  const action = useAppSelector(selectActionMsg);
  const [toast2ErrorOpen, setToast2ErrorOpen] = useState<boolean>(true);
  const [toast2SuccessOpen, setToast2SuccessOpen] = useState<boolean>(true);

  // set the timeout to make the box invisible
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [action]);

  if (
    action.success === null ||
    action.message === "Unauthorized" ||
    action.message?.toLowerCase() === "login"
  ) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-3 right-3">
          {/* {action.success && action.message  */}
          {/* // success msg */}
          {action.success && action.message && (
            <Toast
              type="success"
              open={toast2SuccessOpen}
              setOpen={setToast2SuccessOpen}
            >
              {typeof action.message === "string" && action.message}
            </Toast>
          )}
          {/* // error message */}
          {!action.success && action.message && (
            <Toast
              type="error"
              open={toast2ErrorOpen}
              setOpen={setToast2ErrorOpen}
            >
              {typeof action.message === "string" && action.message}
            </Toast>
          )}
        </div>
      )}
    </>
  );
};

export default MessageBox;
