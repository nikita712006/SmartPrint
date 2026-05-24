"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  
  const fetchOrders = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.user_id) return;

    fetch(`http://localhost:5000/print-jobs/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS:", data);
        setOrders(data);
      })
      .catch((err) => console.log(err));
  };

  // ✅ CLEAN useEffect
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-10 py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          My Print Orders
        </h1>

        <p className="text-gray-600 mt-2">
          Track all your print jobs here.
        </p>

        {orders.length === 0 ? (
          <p className="mt-6 text-gray-500">No orders yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.job_id}
                className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-md transition"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {order.title}
                </h2>

                <p className="text-gray-700">
                  <b>Shop:</b> {order.shop_name || "Not assigned"}
                </p>

                <p className="text-gray-600">
                  Pages: {order.pages}
                </p>

                <p className="text-gray-600">
                  Copies: {order.copies}
                </p>

                <p className="text-gray-700">
                  <b>Date:</b> {order.booking_date || "Not selected"}
                </p>

                <p className="text-gray-700">
                  <b>Time Slot:</b> 🕒 {order.slot || "Not selected"}
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    order.status === "COMPLETED"
                      ? "text-green-600"
                      : order.status === "REJECTED"
                      ? "text-red-500"
                      : order.status === "ACCEPTED"
                      ? "text-blue-500"
                      : "text-orange-500"
                  }`}
                >
                  Status: {order.status}
                </p>

                {/* PAYMENT DETAILS */}
                <div className="mt-3 text-sm text-gray-700">
                  <p><b>Payment Status:</b> {order.payment_status || "PENDING"}</p>
                  <p><b>Method:</b> {order.method || "Not Selected"}</p>
                  <p><b>Amount:</b> ₹{order.amount || 0}</p>
                  <p>
  <b>Paid At:</b>{" "}
  {order.payment_status === "PAID"
    ? order.paid_at
    : "Not Paid Yet"}
</p>
                </div>

                {/* PAYMENT BUTTONS */}
                {order.status?.toUpperCase() === "ACCEPTED" &&
                  !order.method && (
                    <div className="mt-4 flex gap-3">

                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => {
                          fetch("http://localhost:5000/choose-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              job_id: order.job_id,
                              method: "ONLINE",
                            }),
                          }).then(() => {
                            window.location.href = `/payment/${order.job_id}`;
                          });
                        }}
                      >
                        Pay Online 💳
                      </button>

                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                        onClick={() => {
                          fetch("http://localhost:5000/choose-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              job_id: order.job_id,
                              method: "CASH",
                            }),
                          }).then(() => window.location.reload());
                        }}
                      >
                        Pay at Shop 🏪
                      </button>

                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}