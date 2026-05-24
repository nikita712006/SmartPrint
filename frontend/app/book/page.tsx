"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function BookPrintPage() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "owner") {
      alert("Owners cannot book prints ❌");
      window.location.href = "/shop";
    }
  }, []);

  const router = useRouter();

  const [pdfName, setPdfName] = useState("No file chosen");

  const [form, setForm] = useState({
    title: "",
    pdf_name: "",
    pages: "",
    copies: "",
    color: false,
    binding: "None",
    shop: "Campus Xerox",
    booking_date: "",
    slot: "",
  });

  const [shops, setShops] = useState<any[]>([]);
  const [shopId, setShopId] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/shops")
      .then((res) => res.json())
      .then((data) => {
        setShops(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function calculateCost() {
    const pages = Number(form.pages);
    const copies = Number(form.copies);

    if (!pages || !copies) return 0;

    let cost = pages * copies * (form.color ? 10 : 2);

    if (form.binding === "Spiral") cost += 20;
    if (form.binding === "Hard Bind") cost += 50;

    return cost;
  }

  const allSlots = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","01:00","01:30","02:00","02:30",
    "03:00","03:30","04:00","04:30","05:00",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const userString = localStorage.getItem("user");

      if (!userString) {
        alert("Please login first");
        return;
      }

      if (!shopId) {
        alert("Please select a shop");
        return;
      }

      if (!form.booking_date) {
        alert("Please select a date");
        return;
      }

      if (!form.slot) {
        alert("Please select a time slot");
        return;
      }

      if (Number(form.copies) <= 0) {
        alert("Copies must be at least 1");
        return;
      }

      if (Number(form.pages) <= 0) {
        alert("Pages must be at least 1");
        return;
      }

      const user = JSON.parse(userString);

      
      const payload = {
        user_id: user.user_id,
        shop_id: Number(shopId),
        title: form.title,
        pdf_name: form.pdf_name,
        pages: Number(form.pages),
        copies: Number(form.copies),
        color: form.color ? 1 : 0,
        binding: form.binding,
        booking_date: form.booking_date,
        slot: form.slot,
      };

      console.log("PAYLOAD:", payload);

      const res = await fetch("http://localhost:5000/book-print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Something went wrong");
        return;
      }

      alert("Order placed successfully 🚀");

      setForm({
        title: "",
        pdf_name: "",
        pages: "",
        copies: "",
        color: false,
        binding: "None",
        shop: "Campus Xerox",
        booking_date: "",
        slot: "",
      });

      setShopId("");
      setBookedSlots([]);
      setPdfName("No file chosen");

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Backend not reachable ❌");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 md:px-16 py-12">
        <h1 className="text-4xl font-bold text-gray-900">Book Print</h1>
        <p className="text-gray-700 mt-2">
          Upload and schedule your printing — no queues, no stress.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT FORM */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">

            <input
              value={form.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Document Name"
              className="w-full border px-4 py-3 rounded-xl text-black"
              required
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                const name = file ? file.name : "No file chosen";
                setPdfName(name);
                updateField("pdf_name", name);
              }}
              className="text-black"
            />

            <p className="text-gray-700 text-sm">{pdfName}</p>

            <input
              type="number"
              placeholder="Pages"
              value={form.pages || ""}
              onChange={(e) => updateField("pages", e.target.value)}
              className="border px-4 py-3 rounded-xl w-full text-black"
            />

            <input
              type="number"
              placeholder="Copies"
              value={form.copies || ""}
              onChange={(e) => updateField("copies", e.target.value)}
              className="border px-4 py-3 rounded-xl w-full text-black"
            />
            <select
  value={shopId}
  onChange={(e) => setShopId(e.target.value)}
  className="w-full border px-4 py-3 rounded-xl text-black"
  required
>
  <option value="">Select Shop</option>

  {shops.map((shop) => (
    <option key={shop.shop_id} value={shop.shop_id}>
      {shop.shop_name}
    </option>
  ))}
</select>
            <button
              type="button"
              onClick={() => updateField("color", !form.color)}
              className={`w-full py-3 rounded-xl ${
                form.color ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-900"
              }`}
            >
              Color: {form.color ? "ON" : "OFF"}
            </button>

            <select
              value={form.binding || ""}
              onChange={(e) => updateField("binding", e.target.value)}
              className="w-full border px-4 py-3 rounded-xl text-black"
            >
              <option>None</option>
              <option>Spiral</option>
              <option>Staple</option>
              <option>Hard Bind</option>
            </select>

            <input
              type="date"
              value={form.booking_date || ""}
              onChange={(e) => updateField("booking_date", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              required
            />

            <select
              value={form.slot || ""}
              onChange={(e) => updateField("slot", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
              required
            >
              <option value="">Choose a slot</option>
              {allSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
            >
              Book Print
            </button>
          </form>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-8 space-y-4 text-lg">
              <p><b>Document:</b> {form.title || "-"}</p>
              <p><b>Pages:</b> {form.pages || 0}</p>
              <p><b>Copies:</b> {form.copies || 0}</p>
              <p><b>Color:</b> {form.color ? "Yes" : "No"}</p>
              <p><b>Binding:</b> {form.binding}</p>
              <p><b>Date:</b> {form.booking_date || "-"}</p>
              <p><b>Time Slot:</b> {form.slot || "-"}</p>
            </div>

            <div className="mt-8 bg-orange-100 rounded-2xl p-6">
              <p className="text-gray-700 text-lg">Estimated Cost</p>
              <h3 className="text-4xl font-bold text-orange-600 mt-2">
                ₹{calculateCost()}
              </h3>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}