import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Menu from "./menu";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <div
          className="absolute right-0 bottom-0 z-50 mr-10 mb-10 rounded-full border p-4"
          onClick={() => setTheme("light")}
          role="button"
        >
          <BsSunFill className="h-full w-full text-yellow-500" />
        </div>
      );
    } else {
      return (
        <div
          className="absolute right-0 bottom-0 z-50 mr-10 mb-10 rounded-full border p-4"
          onClick={() => setTheme("dark")}
          role="button"
        >
          <BsMoonFill className="h-full w-full text-gray-900" />
        </div>
      );
    }
  };
  return (
    <div className="flex min-h-screen min-w-full">
      <Menu />
      <main className="w-10/12">{children}</main>
      {renderThemeChanger()}
    </div>
  );
};

export default Layout;
