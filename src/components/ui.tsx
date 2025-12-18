
interface FormProps {
  onSubmit: () => void;
  redirect: () => void;
  message: string;
}

export function GlassButton({ text, onClick, style }: { text: string; onClick: () => void; style?:React.CSSProperties }) {
  if (style){
    return (
      <button style={style} className="btn-glass" onClick={onClick}>
        {text}
      </button>
    );
  }
  return (
    <button className="btn-glass" onClick={onClick}>
      {text}
    </button>
  );
}

export function SignUpForm({ onSubmit, redirect, message }: FormProps) {
  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",     // horizontally center
      width: "100%",
      marginTop:"2rem"
    }}
  >
    <div className="form-card">
      <label>First Name</label>
      <input id="firstname" type="text" placeholder="John" required />
      <label>Last Name</label>
      <input id="lastname" type="text" placeholder="Doe" required />
      <label>Email</label>
      <input id="email" type="email" placeholder="example@example.com" required />
      <label>Password</label>
      <input id="password" type="password" placeholder="Password" required />
      <p id="message" style={{ fontSize: '1rem', color:"rgb(44, 127, 196)" }} className="mt-4 text-center">{message}</p>
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
        <GlassButton text="Login" onClick={redirect} />
        <GlassButton text="Sign Up" onClick={onSubmit} />
      </div>
    </div>
    </div>
  );
}

export function LoginForm({ onSubmit, redirect, message }: FormProps) {
  return (
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",     // horizontally center
    width: "100%",
  }}
>
      <div className="form-card">
        <label>Email</label>
        <input id="email" type="email" placeholder="example@example.com" required />
        <label>Password</label>
        <input id="password" type="password" placeholder="Password" required />
        <p id="message" className="mt-4 text-center" style={{ fontSize: '1rem', color:"rgb(44, 127, 196)" }}>
          {message}
        </p>
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
        <GlassButton text="Login" onClick={onSubmit} />
        <GlassButton text="Sign Up" onClick={redirect} />
      </div>
    </div>
  );
}


