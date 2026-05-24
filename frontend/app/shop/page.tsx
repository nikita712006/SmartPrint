"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ShopDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "owner") {
      alert("Access denied ❌");
      window.location.href = "/";
      return;
    }

    if (!user?.shop?.shop_id) return;

    fetch(`http://localhost:5000/shop-orders/${user.shop.shop_id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-10 py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Shop Dashboard
        </h1>

        {orders.length === 0 ? (
          <p className="mt-6 text-gray-500">No orders yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.job_id}
                className="bg-white p-5 rounded-xl shadow border"
              >
                <h2 className="text-lg font-bold">{order.title}</h2>

                <p>Pages: {order.pages}</p>
                <p>Copies: {order.copies}</p>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={
                      order.status === "COMPLETED"
                        ? "text-green-600"
                        : order.status === "REJECTED"
                        ? "text-red-500"
                        : order.status === "ACCEPTED"
                        ? "text-blue-500"
                        : "text-orange-500"
                    }
                  >
                    {order.status}
                  </span>
                </p>

                {/* 🔥 PAYMENT DETAILS */}
                <div className="mt-3 text-sm">
                  <p><b>Payment Status:</b> {order.payment_status || "PENDING"}</p>
                  <p><b>Method:</b> {order.method || "Not Selected"}</p>
                  <p><b>Amount:</b> ₹{order.amount || 0}</p>
                  <p><b>Paid At:</b> {order.paid_at || "Not Paid Yet"}</p>
                </div>

                {/* 🔥 ACCEPT / REJECT */}
                {order.status.toUpperCase() === "PENDING" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        fetch(
                          `http://localhost:5000/update-status/${order.job_id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ status: "ACCEPTED" }),
                          }
                        ).then(() => window.location.reload());
                      }}
                    >
                      Accept
                    </button>

                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        fetch(
                          `http://localhost:5000/update-status/${order.job_id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ status: "REJECTED" }),
                          }
                        ).then(() => window.location.reload());
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* 🔥 COMPLETE ORDER */}
                {order.status.toUpperCase() === "ACCEPTED" && (
                  <button
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      fetch(
                        `http://localhost:5000/complete-order/${order.job_id}`,
                        {
                          method: "POST",
                        }
                      ).then(() => window.location.reload());
                    }}
                  >
                    Mark Completed
                  </button>
                )}

                {/* 🔥 CASH CONFIRM BUTTON */}
                {order.method === "CASH" &&
                  order.payment_status !== "PAID" && (
                    <button
                      className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
                      onClick={() => {
                        fetch(
                          `http://localhost:5000/confirm-cash/${order.job_id}`,
                          {
                            method: "POST",
                          }
                        ).then(() => window.location.reload());
                      }}
                    >
                      Confirm Cash Payment 💵
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}