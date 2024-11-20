"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AcceptInvitationEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const token = searchParams.get("token");

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/team/invitations/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    acceptInvitation();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[420px] bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">
            {status === "loading" ? (
              "Processing Invitation..."
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="inline h-5 w-5 text-green-500" />
                Invitation Accepted
              </>
            ) : (
              <>
                <XCircle className="inline h-5 w-5 text-red-500" />
                Invalid Invitation
              </>
            )}
          </h2>
        </div>
        <div>
          {status === "loading" ? (
            <p>Please wait while we process your invitation...</p>
          ) : status === "success" ? (
            <div className="space-y-4">
              <p>Your invitation has been accepted successfully.</p>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>This invitation link is invalid or has expired.</p>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Return Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
