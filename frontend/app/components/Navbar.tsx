"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">

      {/* LOGO */}
      <h1 className="text-xl font-bold text-orange-500">
        🖨️ PrintFlow
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* 🔥 IF USER LOGGED IN */}
        {user ? (
          <>
            <Link href="/book" className="text-gray-700 hover:text-orange-500">
              Book Print
            </Link>

            <Link href="/dashboard" className="text-gray-700 hover:text-orange-500">
              Dashboard
            </Link>

            {/* USER NAME */}
            <span className="font-semibold text-gray-900">
              {user.name}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* 🔥 NOT LOGGED IN */}
            <Link href="/" className="text-gray-700 hover:text-orange-500">
              Home
            </Link>

            <Link href="/login" className="text-gray-700 hover:text-orange-500">
              Login
            </Link>

            <Link href="/signup" className="text-gray-700 hover:text-orange-500">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}