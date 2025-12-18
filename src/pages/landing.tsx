import { useNavigate } from "react-router-dom";
import { GlassButton } from "../components/ui";
import { navigateTo } from "../utils/navigate"; // make sure the path is correct

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100%", position: "relative" }}>
      
      {/* Top logo container */}
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "50%" }}>
        <img 
          src="./logo/logo_rectangle.png" 
          style={{ width: "100%" }}
        />
      </div>

      {/* Bottom buttons container */}
      <div 
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height:"15%",
          display: "flex",
          flexDirection: "column", // stack vertically
          alignItems: "center",
          gap: "2rem"              // vertical gap between buttons
        }}
      >
        <GlassButton text="Login" onClick={() => navigateTo(navigate, "/login")} />
        <GlassButton text="Sign Up" onClick={() => navigateTo(navigate, "/register")} />
      </div>

    </div>
  );
}



export default Landing;