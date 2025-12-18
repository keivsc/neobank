import { useState, useEffect } from "react";
import { GlassButton } from "../components/ui";
import { useNavigate, useLocation } from "react-router-dom";
import { navigateTo } from "../utils/navigate";
import { getName, sendButtonClicked } from "../controllers/sendController"; // your function
import { formatAmount } from "../utils/utils";

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgb(87, 180, 255)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);


export default function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [amount, setAmount] = useState("0");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>("Recipient");

  // Get account from URL and fetch name
useEffect(() => {
  const acc = params.get("account");
  if (!acc) {
    navigateTo(navigate, "/home");
    return;
  }

  setAccountNumber(acc);

  getName(Number(acc))
    .then((name) => {
      // ✅ Reject invalid responses
      if (!name || typeof name !== "string") {
        navigateTo(navigate, "/home");
        return;
      }
      setRecipientName(name);
    })
    .catch(() => {
      navigateTo(navigate, "/home");
    });
}, [params, navigate]);




  const handleKeyPress = (key: string) => {
    setAmount((prev) => {
      let numeric = prev.replace(/\D/g, "") || "0";
      if (key === "back") {
        numeric = numeric.slice(0, -1) || "0";
      } else if (key !== "" && numeric.length < 9) {
        numeric += key;
      }
      return numeric;
    });
  };

    const handleSend = async () => {
    if (!accountNumber) return;

    setSending(true);
    setError(null);

    const numeric = parseInt(amount.replace(/\D/g, ""), 10);
    const dollars = numeric / 100;

    const result = await sendButtonClicked(Number(accountNumber), dollars);

    setSending(false);

    if (result === "success") {
        setShowSuccess(true);
    } else if (typeof result === "object" && result.error) {
        setError(result.error); // Display error message from API
    } else {
        setError(result); // Fallback for string errors
    }
    };


  return (
    <div>
      {/* Header */}
      <div style={{ width: "100%", backgroundColor: "rgb(87, 180, 255)", paddingTop: "10%" }}>
        <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <img src="/logo/logo_circle.png" width="15%" alt="Logo" />
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>NeoBank</h1>
        </div>
      </div>

      {/* Back Icon */}
      <div
        style={{ position: "absolute", left: ".1rem", top: "9rem" }}
        onClick={() => navigateTo(navigate, "/people?type=send")}
      >
        <BackIcon />
      </div>

      <p
        style={{
          color: "black",
          fontSize: "1.5rem",
          marginBottom: ".5rem",
          textAlign: "left",
          marginLeft: "1.3rem",
          marginTop: "3rem",
        }}
      >
        Sending to
      </p>

      {/* Recipient box */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div
          style={{
            width: "90%",
            maxWidth: "400px",
            padding: ".5rem",
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid black",
            borderRadius: ".5rem",
            fontSize: "1.5rem",
            background: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            color: "gray",
          }}
        >
          <span>{recipientName}</span>
          <span>{accountNumber ?? "Number"}</span>
        </div>
      </div>

      <hr style={{ border: "2px solid rgba(87,180,255,0.5)", marginTop: "1rem", width: "90%", marginBottom: "1rem" }} />

      {/* Amount input with $ */}
      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          height: "3rem",
          border: "2px solid rgba(87,180,255)",
          borderRadius: ".5rem",
          background: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 .5rem",
          margin: "0 auto 1rem auto",
        }}
      >
        <span style={{ fontSize: "1.5rem", color: "black", marginRight: ".3rem" }}>$</span>
        <input
        id="amount"
        placeholder="0.00"
        value={formatAmount(parseInt(amount.replace(/\D/g, ""), 10) / 100)} // convert cents to dollars
        readOnly
        style={{
            border: "none",
            outline: "none",
            width: "100%",
            height: "100%",
            fontSize: "1.5rem",
            color: "black",
            textAlign: "right",
            background: "transparent",
        }}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Numeric keypad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: ".5rem",
          width: "90%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key, idx) => (
          <button
            key={idx}
            onClick={() => key && handleKeyPress(key)}
            style={{
              padding: "1rem",
              fontSize: "1.5rem",
              borderRadius: ".5rem",
              border: "2px solid rgba(87,180,255)",
              background: key === "back" ? "red" : "white",
              color: key === "back" ? "white" : "black",
              cursor: key ? "pointer" : "default",
              visibility: key ? "visible" : "hidden",
            }}
          >
            {key === "back" ? "⌫" : key}
          </button>
        ))}
      </div>

      {/* Send button */}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <GlassButton style={{ borderRadius: "1.5rem" }} text={sending ? "Sending..." : "Send"} onClick={handleSend} />
      </div>

      {/* Success popup */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center",
              width: "80%",
              maxWidth: "300px",
            }}
          >
            <h2 style={{ marginBottom: "1rem", color:"black" }}>${formatAmount(parseInt(amount.replace(/\D/g, ""), 10) / 100)} sent to {recipientName}!</h2>
            <GlassButton text="Back to Home" onClick={() => navigateTo(navigate, "/home")} />
          </div>
        </div>
      )}
    </div>
  );
}
