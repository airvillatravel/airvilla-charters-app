"use client";
import ProgressLoading from "@/components/utils/ProgressLoading";
import useLayoutAuth from "@/components/hooks/layout/useLayoutAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isPrivateMode } = useLayoutAuth();

  // loading
  if (loading || isPrivateMode === null) return <ProgressLoading />;

  // private mode
  if (isPrivateMode) {
    return (
      <div className="h-[100vh] flex justify-center items-center text-xl">
        You cant use this app because some features might not work as expected
        when you are using private mode.
      </div>
    );
  }

  // public mode
  return <div className="bg-gray-50 dark:bg-gray-900">{children}</div>;
}
