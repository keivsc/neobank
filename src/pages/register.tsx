import { useState } from "react";
import { register as registerUser } from "../controllers/registerController";
import { navigateTo } from "../utils/navigate";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { GlassButton, SignUpForm } from "../components/ui";

interface TOTPRegisterProps {
  otpAuthUrl: string;
}

function Register() {
    const navigate = useNavigate();

    const loginRedirect = () =>{
      navigateTo(navigate, '/login');
    }

    const [_, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showTOTP, setShowTOTP] = useState(false);
    const [OTPauthURL, setOtpAuthUrl] = useState<string | null>(null);

    const registerButtonClicked = async () => {
      setShowTOTP(true);
    setLoading(true);
    setMessage("");

    const firstName = (document.getElementById("firstname") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastname") as HTMLInputElement).value;
    const fullName = `${firstName} ${lastName}`
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!firstName || !lastName || !email || !password) {
      setMessage("Please enter all fields!");
      return;
    }
    try {
        const result = await registerUser(fullName, email, password);

        if (result.code == 200) {
            setOtpAuthUrl(result.data?.otpauthURL);
            setShowTOTP(true);
        } else {
            if(!result.message){
              return setMessage("Server error, please try again later.")
            }
            setMessage(`${result.message}`);
        }
    } catch (err) {
        console.error(err);
        setMessage("Unexpected error occurred.");
    } finally {
        setLoading(false);
    }
    };


    if (showTOTP && OTPauthURL) {
        return <TOTPRegister otpAuthUrl={OTPauthURL} />;
    }

    if (message){
      const paragraphEl = document.getElementById('message') as HTMLParagraphElement
      paragraphEl.textContent = message
    }

    return (
    <div>
       {/* Top logo container */}
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "50%" }}>
        <img 
          src="/logo/logo_rectangle.png" 
          style={{ width: "100%" }}
        />
      </div>
      <div className="flex flex-col items-center mt-10">
        <SignUpForm onSubmit={registerButtonClicked} redirect={loginRedirect} message={message}/>
    </div>
    </div>

    );
}


function TOTPRegister({ otpAuthUrl }: TOTPRegisterProps) {
  const navigate = useNavigate();

  const continueButton = () =>{
    
    navigateTo(navigate, '/login')
  }

  return (
    <div style={{marginTop:"50%"}}>
      <p style={{ fontSize: '2rem', color:"rgb(44, 127, 196)" }} id="text">Scan this QR code with your authenticator app:</p>
      {otpAuthUrl && <QRCodeSVG value={otpAuthUrl} size={200} />}
      <p
        id="text"
        style={{
          fontSize: "2rem",
          color: "rgb(44, 127, 196)",
          maxWidth: "90%",
          marginLeft:"5%",
          overflowWrap: "anywhere",
        }}
      >
        Enter code manually instead:{" "}
        {otpAuthUrl ? otpAuthUrl.split("secret=")[1].split("&")[0] : ""}
      </p>

      <br></br>
      <GlassButton style={{width:"80%"}} text="Continue" onClick={continueButton}/>
    </div>
  );
}


export default Register;
