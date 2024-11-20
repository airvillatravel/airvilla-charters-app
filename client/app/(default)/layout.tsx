"use client";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import ProgressLoading from "@/components/utils/ProgressLoading";
import SessionExpirationPopup from "@/components/extra-components/SessionExpirationPopup";
import useLayoutDefault from "@/components/hooks/layout/useLayoutDefault";
import LoginLoadingProgress from "@/components/extra-components/LoginLoadingProgress";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isSessionExpiredPopupOpen } = useLayoutDefault();

  if (loading) return <ProgressLoading />;
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <SessionExpirationPopup isOpen={isSessionExpiredPopupOpen} />
      <LoginLoadingProgress />
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header />

        <main className="grow [&>*:first-child]:scroll-mt-16">{children}</main>
      </div>
    </div>
  );
}
