import { DashboardProvider } from "@/context/DashboardContext";

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
