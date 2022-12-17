import Menu from "./menu";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen min-w-full">
      <Menu />
      <main className="w-10/12">{children}</main>
    </div>
  );
};

export default Layout;
