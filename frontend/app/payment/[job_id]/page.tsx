"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const job_id = params.job_id;

  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePay = () => {
    if (!card || !name || !cvv) {
      alert("Fill all details");
      return;
    }

    fetch("http://localhost:5000/pay-online", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ job_id }),
    }).then(() => {
      alert("Payment Successful ");
      router.push("/dashboard");
      setTimeout(() => {
      window.location.reload();
}, 200);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Payment 💳
        </h2>

        <input
          type="text"
          placeholder="Card Number"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Card Holder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          onClick={handlePay}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Pay Now
        </button>

      </div>
    </div>
  );
}