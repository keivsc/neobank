import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GlassButton } from "../components/ui";
import { navigateTo } from "../utils/navigate";
import { sendRequest } from "../controllers/sendRequestController";
import { getName } from "../controllers/sendController";
import { formatAmount } from "../utils/utils";

export default function SendRequestPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();

  const [requestPayload, setRequestPayload] = useState<any>(null);
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Parse Base64 payload & signature from URL
  useEffect(() => {
    const data = searchParams.get("data");
    if (!data || !requestId) {
      navigateTo(navigate, "/home");
      return;
    }

    try {
      // Decode Base64 -> string -> JSON object
      const decoded = atob(decodeURIComponent(data));
      const parsed = JSON.parse(decoded);
      setRequestPayload(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to parse request data.");
    }
  }, [searchParams, navigate, requestId]);

  // Fetch recipient name from bank number
  useEffect(() => {
    const fetchRecipient = async () => {
      if (!requestPayload?.toBankNumber) return;
      try {
        const name = await getName(requestPayload.toBankNumber);
        setRecipientName(name || "Unknown");
      } catch {
        setRecipientName("Unknown");
      }
    };
    fetchRecipient();
  }, [requestPayload]);

  const handleConfirm = async () => {
    if (!requestPayload || !requestId) {
      setError("Invalid request ID or payload.");
      return;
    }
    setSending(true);
    setError(null);

    try {
      const result = await sendRequest(requestId, requestPayload, requestPayload.signature);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send money.");
      }
    } catch {
      setError("Request failed.");
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <p style={{ color: "red" }}>{error}</p>
        <GlassButton text="Back to Home" onClick={() => navigateTo(navigate, "/home")} />
      </div>
    );
  }

  if (!requestPayload) {
    return <p style={{ textAlign: "center", marginTop: "5rem" }}>Loading...</p>;
  }

  return (
    <div>
              {/* Header */}
      <div style={{ width: "100%", backgroundColor: "rgb(87, 180, 255)", paddingTop: "10%" }}>
        <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <img src="/logo/logo_circle.png" width="15%" alt="Logo" />
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>NeoBank</h1>
        </div>
      </div>
      <h2 style={{color:"black"}}>Confirm Send Money</h2>

      <div style={{ margin: "2rem 0", fontSize: "1.2rem", textAlign: "left", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
        <p style={{color:"black"}}><strong>Amount:</strong> ${formatAmount(requestPayload.amount)}</p>
        <p style={{color:"black"}}><strong>Recipient Name:</strong> {recipientName}</p>
        <p style={{color:"black"}}><strong>Bank Number:</strong> {requestPayload.toBankNumber}</p>
      </div>

      {success ? (
        <p style={{ color: "green", margin: "1rem 0" }}>Money sent successfully!</p>
      ) : (
        <GlassButton
          text={sending ? "Sending..." : "Confirm"}
          onClick={handleConfirm}
          style={{ marginTop: "1rem", width: "50%" }}
        />
      )}

        <GlassButton text="Back to Home" onClick={() => navigateTo(navigate, "/home")} style={{ width: "50%" }} />
    </div>
  );
}
