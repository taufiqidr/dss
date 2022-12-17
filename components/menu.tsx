import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Menu = () => {
  const { data: session, status } = useSession();
  let user_menu;
  if (status === "authenticated") {
    user_menu = (
      <div
        className="m-3 mt-auto flex cursor-pointer gap-x-3 text-2xl hover:text-blue-500"
        onClick={() => signOut()}
      >
        Logout
      </div>
    );
  } else if (status === "unauthenticated") {
    user_menu = (
      <div
        className="m-3 mt-auto flex cursor-pointer gap-x-3 text-2xl hover:text-blue-500"
        onClick={() => signIn("google")}
      >
        Login
      </div>
    );
  } else {
    user_menu = (
      <div className="m-3 mt-auto flex cursor-pointer gap-x-3 text-2xl hover:text-blue-500">
        Loading
      </div>
    );
  }

  return (
    <div className="flex h-screen w-2/12 flex-col border bg-blue-300">
      <nav className="m-3 flex flex-col gap-y-3  text-2xl">
        <Link href={"/"} className="flex gap-x-3 hover:text-blue-500">
          Home
        </Link>
        <Link href={"/mahasiswa"} className="flex gap-x-3 hover:text-blue-500">
          Mahasiswa
        </Link>
        <Link href={"/jurusan"} className="flex gap-x-3 hover:text-blue-500">
          Jurusan
        </Link>
        <Link href={"/fakultas"} className="flex gap-x-3 hover:text-blue-500">
          Fakultas
        </Link>
      </nav>
      {user_menu}
    </div>
  );
};

export default Menu;
