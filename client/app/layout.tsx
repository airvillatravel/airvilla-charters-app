import "./css/style.css";

import { Inter } from "next/font/google";
import Theme from "./theme-provider";
import AppProvider from "./app-provider";
import StoreProvider from "../redux/StoreProvider";
import MessageBox from "@/components/extra-components/MessageBox";
import Loading from "@/components/Loading";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Airvilla Charter",
  description: "Airvilla Charter Flight App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
      <body
        className={`${inter.variable} font-inter antialiased bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400`}
      >
        <StoreProvider>
          <Theme>
            <AppProvider>
              <AppRouterCacheProvider>
                <SocketProvider>
                  <Loading />
                  {children}
                  <MessageBox />
                </SocketProvider>
              </AppRouterCacheProvider>
            </AppProvider>
          </Theme>
        </StoreProvider>
      </body>
    </html>
  );
}
