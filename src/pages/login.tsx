import { useNavigate } from "react-router-dom";
import { navigateTo } from "../utils/navigate";
import { useEffect, useState, useRef } from "react";
import { LoginForm } from "../components/ui";
import { login as loginUser } from "../controllers/loginController";
import { verifyTOTP } from "../utils/api";

interface TOTPInputProps{
    TOTPExpiry: number;
    userId: string;
}

function Login(){
    const [_, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showTOTPInput, setTOTPInput] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);

    const navigate = useNavigate();

    const signUpRedirect = () =>{
        navigateTo(navigate, '/register');
    }

    const loginButtonClicked = async ()=>{
        setLoading(true);
        setMessage("");

        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const loginRes = await loginUser(email, password);
        switch (loginRes.code) {
          case 401:
            setUserId(loginRes.userId);
            setExpiresAt(loginRes.expiresAt);
            setTOTPInput(true);
            break;

          case 200:
            navigateTo(navigate, '/home');
            break;

          default:
            setMessage(loginRes.message);
            break;
        }
    }

    if (showTOTPInput && expiresAt && userId) {
        return <TOTPInput TOTPExpiry={expiresAt} userId={userId}  />;
    }


    return (
    <div>
      {/* Top logo container */}
      <div style={{ position: "absolute", top: "2%", left: "50%", transform: "translateX(-50%)", width: "50%" }}>
        <img 
          src="./logo/logo_rectangle.png" 
          style={{ width: "100%" }}
        />
      </div>
        <LoginForm onSubmit={loginButtonClicked} redirect={signUpRedirect} message={message}/>
    </div>
    );
}


export function TOTPInput({ TOTPExpiry, userId }: TOTPInputProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, TOTPExpiry - now);
      setTimeLeft(Math.floor(diff / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [TOTPExpiry]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

const handleChange = async (index: number, value: string) => {
  if (!/^\d?$/.test(value)) return; // only digits
  const newCode = [...code];
  newCode[index] = value;
  setCode(newCode);
  setError(null);

  // move forward if value entered
  if (value && index < code.length - 1) {
    inputRefs.current[index + 1]?.focus();
  }

  // If all 6 digits entered, automatically verify
  if (newCode.every(d => d !== "")) {
    const fullCode = newCode.join("");
    const resTOTP = await verifyTOTP(userId, Number(fullCode));

    if (resTOTP.status === 200) {
      navigateTo(navigate, "/home");
    } else {
      const data = await resTOTP.json();
      setError(data.error);
      // clear all inputs
      setCode(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  }
};


  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // move focus back if current box empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "75%",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          fontFamily: "monospace",
          fontSize: "2rem",
          color: "rgb(44, 127, 196)",
          textAlign: "center",
        }}
      >
        Enter the code shown in your authenticator app.
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "12px",
          justifyContent: "center",
        }}
      >
      {code.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          style={{
            width: "10%",
            height: "4vh",
            textAlign: "center",
            fontSize: "2rem",
            borderRadius: ".5em",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
      ))}

      </div>

      {error && (
        <div
          style={{
            color: "red",
            fontSize: "2rem",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginBottom: "12px",
          fontFamily: "monospace",
          fontSize: "2rem",
          color: "rgb(44, 127, 196)",
        }}
      >
        Expires in: {formatTime(timeLeft)}
      </div>

    </div>
  );
}





export default Login;