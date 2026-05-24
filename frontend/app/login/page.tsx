"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data && data.success) {
        setMsg("Login successful");

        // ✅ FIXED LINE
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
  if (data.user.role === "owner") {
    router.push("/shop");        // 👈 owner goes here
  } else {
    if (data.user.role === "owner") {
  router.push("/shop");
} else {
  router.push("/dashboard");
}   // 👈 normal user
  }
}, 1000);
      } else {
        setMsg("Invalid email or password");
      }

    } catch (err) {
      console.log(err);
      setMsg("Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f8fb] px-6">
      <form
        onSubmit={handleSignin}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => updateField("password", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
          required
        />

        <button className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold">
          Sign In
        </button>

        {msg && <p className="text-sm text-center">{msg}</p>}
      </form>
    </main>
  );
}