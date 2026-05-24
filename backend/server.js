const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= DB CONNECTION ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Protect@1410",
  database: "smartprint_campus",
});

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend is working ");
});

/* ================= GET ALL PRINT JOBS ================= */
app.get("/print-jobs", (req, res) => {
  db.query("SELECT * FROM print_jobs", (err, result) => {
    if (err) {
      console.log("❌ ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

/* ================= GET USER-SPECIFIC JOBS ================= */
app.get("/print-jobs/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT pj.*, s.shop_name,
           p.amount, p.method, p.payment_status, p.paid_at
    FROM print_jobs pj
    JOIN shops s ON pj.shop_id = s.shop_id
    LEFT JOIN payments p ON pj.job_id = p.job_id
    WHERE pj.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(" DB ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});
/* ================= GET SHOP ORDERS ================= */
app.get("/shop-orders/:shop_id", (req, res) => {
  const shopId = req.params.shop_id;

  const sql = `
    SELECT pj.*, u.name AS customer_name,
       p.amount, p.method, p.payment_status, p.paid_at
FROM print_jobs pj
JOIN users u ON pj.user_id = u.user_id
LEFT JOIN payments p ON pj.job_id = p.job_id
WHERE pj.shop_id = ?
ORDER BY pj.created_at DESC
  `;

  db.query(sql, [shopId], (err, result) => {
    if (err) {
      console.log("SHOP ORDERS ERROR:", err);
      return res.status(500).json(err);
    }

    console.log("📦 SHOP ORDERS:", result);
    res.json(result);
  });
});
/* ================= ACCEPT ORDER ================= */
app.post("/accept-order/:job_id", (req, res) => {
  const jobId = req.params.job_id;

  db.query(
    "UPDATE print_jobs SET status='ACCEPTED' WHERE job_id=?",
    [jobId],
    (err) => {
      if (err) {
        console.log("❌ ACCEPT ERROR:", err);
        return res.status(500).json(err);
      }

      // 🔥 CREATE PAYMENT ONLY AFTER ACCEPT
      db.query(
        "INSERT INTO payments (job_id, payment_status) VALUES (?, 'PENDING')",
        [jobId],
        (err2) => {
          if (err2) {
            console.log("❌ PAYMENT INIT ERROR:", err2);
            return res.status(500).json(err2);
          }

          res.send("Order accepted + payment initialized");
        }
      );
    }
  );
});

/* ================= REJECT ORDER ================= */
app.post("/reject-order/:job_id", (req, res) => {
  const jobId = req.params.job_id;

  db.query(
    "UPDATE print_jobs SET status='REJECTED' WHERE job_id=?",
    [jobId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Order rejected");
    }
  );
});

/* ================= GET ALL SHOPS ================= */
app.get("/shops", (req, res) => {
  db.query("SELECT * FROM shops", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

/* ================= INSERT PRINT JOB ================= */
app.post("/book-print", (req, res) => {
  console.log("🔥 BOOK PRINT HIT");
  console.log("Booking Data:", req.body);

  const {
    user_id,
    shop_id,
    title,
    pdf_name,
    pages,
    copies,
    color,
    binding,
    booking_date,
    slot,
  } = req.body;

  const pricePerPage = color === 1 ? 10 : 2;
  const totalPrice = pages * copies * pricePerPage;

  const sql = `
    INSERT INTO print_jobs 
    (user_id, shop_id, title, pdf_name, pages, copies, color, binding, booking_date, slot, total_price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
  `;

  db.query(
    sql,
    [
      user_id,
      shop_id,
      title,
      pdf_name,
      pages,
      copies,
      color,
      binding,
      booking_date,
      slot,
      totalPrice,
    ],
    (err, result) => {
      if (err) {
        console.log("❌ INSERT ERROR:", err);
        return res.status(500).json(err);
      }

      const jobId = result.insertId;

      db.query(
        "INSERT INTO payments (job_id, amount, payment_status) VALUES (?, ?, 'PENDING')",
        [jobId, totalPrice],
        (err2) => {
          if (err2) {
            console.log("❌ PAYMENT INSERT ERROR:", err2);
            return res.status(500).json(err2);
          }

          res.json({ success: true });
        }
      );
    }
  );
});

/* ================= COMPLETE ORDER + CREATE PAYMENT ================= */
app.post("/complete-order/:id", (req, res) => {
  const jobId = req.params.id;

  // 1️⃣ Mark order completed
  db.query(
    "UPDATE print_jobs SET status='COMPLETED' WHERE job_id=?",
    [jobId],
    (err) => {
      if (err) return res.status(500).json(err);

      // 2️⃣ Get price
      db.query(
        "SELECT total_price FROM print_jobs WHERE job_id=?",
        [jobId],
        (err, result) => {
          if (err) return res.status(500).json(err);

          const amount = result[0].total_price;

          // 3️⃣ 🔥 ENSURE PAYMENT ROW EXISTS
          db.query(
            "SELECT * FROM payments WHERE job_id=?",
            [jobId],
            (err, rows) => {
              if (rows.length === 0) {
                // INSERT if not exists
                db.query(
                  "INSERT INTO payments (job_id, amount, payment_status) VALUES (?, ?, 'PENDING')",
                  [jobId, amount],
                  (err) => {
                    if (err) return res.status(500).json(err);
                    res.send("Order completed + payment created");
                  }
                );
              } else {
                res.send("Order completed (payment already exists)");
              }
            }
          );
        }
      );
    }
  );
});
/* ================= UPDATE STATUS ================= */
app.put("/update-status/:job_id", (req, res) => {
  const jobId = req.params.job_id;
  const { status } = req.body;

  db.query(
    "UPDATE print_jobs SET status=? WHERE job_id=?",
    [status, jobId],
    (err) => {
      if (err) {
        console.log("❌ STATUS UPDATE ERROR:", err);
        return res.status(500).json(err);
      }
      res.send("Status updated");
    }
  );
});

/* ================= CHOOSE PAYMENT METHOD ================= */
app.post("/choose-payment", (req, res) => {
  const { job_id, method } = req.body;

  db.query(
    "SELECT total_price FROM print_jobs WHERE job_id=?",
    [job_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const amount = result[0].total_price;

      if (method === "CASH") {
        // 🔥 PAY AT SHOP
        db.query(
          "UPDATE payments SET method=?, amount=?, payment_status='PENDING', paid_at=NULL WHERE job_id=?",
          [method, amount, job_id],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.send("Cash selected");
          }
        );
      } else {
        // ONLINE CASE
        db.query(
          "UPDATE payments SET method=?, amount=?, payment_status='PENDING', paid_at=NULL WHERE job_id=?",
          [method, amount, job_id],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.send("Online selected");
          }
        );
      }
    }
  );
});
/* ================= ONLINE PAYMENT (🔥 FIXED) ================= */
app.post("/pay-online", (req, res) => {
  const { job_id } = req.body;

  // 🔥 GET ACTUAL PRICE FROM print_jobs
  db.query(
    "SELECT total_price FROM print_jobs WHERE job_id=?",
    [job_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const amount = result[0].total_price;

      // 🔥 UPDATE PAYMENT WITH CORRECT AMOUNT
      db.query(
        "UPDATE payments SET payment_status='PAID', method='ONLINE', amount=?, paid_at=NOW() WHERE job_id=?",
        [amount, job_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.send("Payment successful");
        }
      );
    }
  );
});

/* ================= CASH PAYMENT (🔥 FIXED) ================= */
app.post("/confirm-cash/:job_id", (req, res) => {
  const jobId = req.params.job_id;

  db.query(
    "UPDATE payments SET payment_status='PAID', paid_at=NOW() WHERE job_id=?",
    [jobId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Cash payment confirmed");
    }
  );
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT u.*, s.shop_id, s.shop_name
    FROM users u
    LEFT JOIN shops s ON u.user_id = s.owner_id
    WHERE u.email = ? AND u.password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (result.length > 0) {
      const user = result[0];

      res.json({
        success: true,
        user: {
          user_id: user.user_id,
          name: user.name,
          role: user.role,
          shop:
            user.role === "owner"
              ? {
                  shop_id: user.shop_id,
                  shop_name: user.shop_name,
                }
              : null,
        },
      });
    } else {
      res.json({ success: false });
    }
  });
});

/* ================= SERVER START ================= */
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});