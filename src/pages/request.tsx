import { useState, useEffect } from "react";
import { GlassButton } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { navigateTo } from "../utils/navigate";
import { formatAmount } from "../utils/utils";
import { getBankNumber, requestMoney } from "../controllers/requestController";
import { QRCodeSVG } from "qrcode.react"; // React QR component

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

export default function RequestMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("0");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankNumber, setBankNumber] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string | null>(null); // added
  const [qrValue, setQrValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankNumberAndName = async () => {
      try {
        const account = await getBankNumber();
        setBankNumber(account.accountNumber);

        setRecipientName(account.username); // fallback to number if name not found
      } catch {
        setBankNumber("UNKNOWN");
        setRecipientName("UNKNOWN");
      }
    };
    fetchBankNumberAndName();
  }, []);
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

  const handleRequest = async () => {
    if (!bankNumber) return;

    setSending(true);
    setError(null);

    const numeric = parseInt(amount.replace(/\D/g, ""), 10);
    const dollars = numeric / 100;

    try {
      const result = await requestMoney(Number(bankNumber), dollars);

      if (result.success) {
        // Create a URL for the QR code including redirect to your site
        const urlPayload = btoa(result.qr);
        const qrUrl = `https://keivsc.github.io/neobank/send/${result.requestId}?data=${urlPayload}`;
        setQrValue(qrUrl);
        setShowSuccess(true);
      } else {
        setError(result.error || "Unknown error occurred");
      }
    } catch {
      setError("Request failed");
    } finally {
      setSending(false);
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
        onClick={() => navigateTo(navigate, "/home")}
      >
        <BackIcon />
      </div>

      <p style={{ color: "black", fontSize: "1.5rem", marginBottom: ".5rem", textAlign: "left", marginLeft: "1.3rem", marginTop: "3rem" }}>
        Requesting to {bankNumber}
      </p>

      {/* Amount input */}
      <div style={{ width: "90%", maxWidth: "400px", height: "3rem", border: "2px solid rgba(87,180,255)", borderRadius: ".5rem", background: "white", display: "flex", alignItems: "center", padding: "0 .5rem", margin: "0 auto 1rem auto" }}>
        <span style={{ fontSize: "1.5rem", color: "black", marginRight: ".3rem" }}>$</span>
        <input
          placeholder="0.00"
          value={formatAmount(Number(amount) / 100)}
          readOnly
          style={{ border: "none", outline: "none", width: "100%", height: "100%", fontSize: "1.5rem", color: "black", textAlign: "right", background: "transparent" }}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Numeric keypad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem", width: "90%", maxWidth: "400px", margin: "0 auto" }}>
        {["1","2","3","4","5","6","7","8","9","","0","back"].map((key, idx) => (
          <button
            key={idx}
            onClick={() => key && handleKeyPress(key)}
            style={{ padding: "1rem", fontSize: "1.5rem", borderRadius: ".5rem", border: "2px solid rgba(87,180,255)", background: key === "back" ? "red" : "white", color: key === "back" ? "white" : "black", cursor: key ? "pointer" : "default", visibility: key ? "visible" : "hidden" }}
          >
            {key === "back" ? "⌫" : key}
          </button>
        ))}
      </div>

      {/* Request button */}
      <div style={{ position: "absolute", bottom: "3%", left: "50%", transform: "translateX(-50%)", width: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GlassButton style={{ borderRadius: "1.5rem" }} text={sending ? "Requesting..." : "Request"} onClick={handleRequest} />
      </div>

      {/* Success popup with inline QR */}
      {showSuccess && qrValue && (
        <div style={{ position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 }}>
          <div style={{ background:"white", borderRadius:"1rem", padding:"2rem", textAlign:"center", width:"80%", maxWidth:"300px" }}>
            <div style={{ position: "relative", textAlign: "center", backgroundColor:"rgb(87, 180, 255)", marginBottom:"2rem", borderRadius:"1rem", paddingTop:"1rem" }}>
            <img 
                src="/logo/logo_rectangle.png"
                style={{
                position: "absolute", // make it absolute
                top: "-2rem",         // adjust vertical position
                left: "50%",          // center horizontally
                transform: "translateX(-50%)", // truly center
                width: "60%",
                zIndex: 10            // keep it in front
                }}
            />
            <h2 style={{ marginTop: "80px", marginBottom:"1rem", color:"white" }}>
                ${formatAmount(parseInt(amount.replace(/\D/g, ""), 10)/100)} request from {recipientName}!
            </h2>
            <QRCodeSVG value={qrValue} size={200} style={{marginBottom:"2rem"}} />
            </div>
            <GlassButton text="Back to Home" onClick={() => navigateTo(navigate, "/home")} />
          </div>
        </div>
      )}
    </div>
  );
}
