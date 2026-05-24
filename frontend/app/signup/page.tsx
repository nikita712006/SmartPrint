"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.text();
    console.log("SIGNUP RESPONSE:", data);

    if (!res.ok) {
      alert(data || "Signup failed ❌");
      return;
    }

    alert(data || "User registered successfully ✅");

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        role: "customer"
      })
    );

    router.push("/book");
  } catch (err) {
    console.log(err);
    alert("Backend not reachable ❌");
  }
}

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow space-y-4"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Name"
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            type="text"
            placeholder="Mobile"
            onChange={(e) => updateField("mobile", e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold hover:bg-orange-600"
          >
            Sign Up
          </button>
        </form>
      </main>
    </>
  );
}