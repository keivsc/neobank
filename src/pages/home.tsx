import { useEffect, useState } from "react";
import { GlassButton } from "../components/ui";
import { getMyBank, getMyName } from "../utils/api";
import { navigateTo } from "../utils/navigate";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "../utils/utils";

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const RepeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m17 2 4 4-4 4"/>
    <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
    <path d="m7 22-4-4 4-4"/>
    <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
  </svg>
);

function lightenColor(color: string, percent: number) {
  let [r, g, b] = color
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(Number);
  
  r = Math.min(255, r + (255 - r) * (percent / 100));
  g = Math.min(255, g + (255 - g) * (percent / 100));
  b = Math.min(255, b + (255 - b) * (percent / 100));

  return `rgb(${r}, ${g}, ${b})`;
}


export default function Home(){
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const bankRes = await getMyBank();
        const bankInfo = await bankRes.json();

        const nameRes = await getMyName();
        const nameInfo = await nameRes.json();

        setUsername(nameInfo.username || "John Smith");          // fallback if API fails
        setBalance(bankInfo.balance || 0);
        setAccountNumber(bankInfo.accountNumber || "0000");
      } catch (err) {
        console.error("Failed to fetch bank info or name:", err);
      }
    })();
  }, []);

const transactions = [
  { id: 1, name: "Netflix Subscription", amount: -15.99, date: "Today", type: "expense" },
  { id: 2, name: "Salary Deposit", amount: 3500.0, date: "Yesterday", type: "income" },
  { id: 3, name: "Grocery Store", amount: -87.32, date: "Dec 13", type: "expense" },
  { id: 4, name: "Electricity Bill", amount: -120.45, date: "Dec 12", type: "expense" },
  { id: 5, name: "Grab Ride", amount: -18.5, date: "Dec 12", type: "expense" },
  { id: 6, name: "Freelance Payment", amount: 850.0, date: "Dec 11", type: "income" },
  { id: 7, name: "Coffee Shop", amount: -6.8, date: "Dec 11", type: "expense" },
  { id: 8, name: "Shopee Refund", amount: 42.0, date: "Dec 10", type: "income" },
  { id: 9, name: "Internet Bill", amount: -99.0, date: "Dec 9", type: "expense" },
  { id: 10, name: "Restaurant", amount: -54.6, date: "Dec 8", type: "expense" },
];

  return(
    <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      <div style={{ width: "100%", backgroundColor: "rgb(87, 180, 255)", paddingTop:"10%" }}>
        <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <img src="./logo/logo_circle.png" width="15%" alt="Logo" />
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>NeoBank</h1>
        </div>
      </div>


      <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
        <div style={{
          width: "90%",
          backgroundColor: "rgb(87, 180, 255)",
          borderRadius: "2em",
          padding: ".6rem",
          textAlign: "left",
          overflow: "hidden"
        }}>
          <p style={{ fontSize: "1.3rem", margin: 0 }}>Total Balance</p>
          <h1 style={{ fontSize: "1.3rem", margin: "0.1rem 0" }}>${formatAmount(balance.toString())}</h1>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: ".5rem"
          }}>
            <GlassButton
              text="Savings Account"
              onClick={() => {}}
              style={{ background: "rgba(133, 190, 236, 1)", width: "30%", fontSize: ".8rem" }}
            />
            <p style={{ fontSize: "1.3rem", margin: 0 }}>{accountNumber}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0rem",
          marginLeft:"1.2em",
          justifyContent: "center", 
        }}
      >
        {[
          { icon: <SendIcon />, label: "Send", color: "rgb(87, 180, 255)" },       // blue
          { icon: <DownloadIcon />, label: "Request", color: "rgb(34, 197, 94)" },   // green
          { icon: <CreditCardIcon />, label: "Cards", color: "rgb(251, 191, 36)" },  // yellow
          { icon: <RepeatIcon />, label: "Transfer", color: "rgb(239, 68, 68)" },   // red
        ].map((item, idx) => (
          <button
            key={idx}
            style={{
              backgroundColor: item.color,
              padding: ".7rem",
              borderRadius: "1.5rem",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: "none",
              height: "5rem",
              width:"5rem",
              justifyContent:"center"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = lightenColor(item.color, 30); // lighten by 20%
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = item.color;
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
            }}
            onClick={() => {
              switch (item.label) {
                case "Send":
                  navigateTo(navigate, "/people");
                  break;
                case "Request":
                  navigateTo(navigate, "/request");
                  break;
                case "Cards":
                  break;
                case "Transfer":
                  break;
              }
            }}
          >
            <div
              style={{
                padding: "0.2rem",
                borderRadius: "1rem",
              }}
            >
              {item.icon}
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 500, color: "white" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div style={{marginTop: "0rem" }}>
        <h1 style={{ color: "gray", textAlign: "left", fontSize:"1.4rem", marginLeft:"5%" }}>My Cards</h1>

        <div style={{ display: "flex", justifyContent: "center"}}>
          <div style={{
            width: "90%",
            backgroundColor:"#0f172a",
            borderRadius: "2em",
            padding: "2%",
            textAlign: "left",
            overflow: "hidden"
          }}>
            <p style={{ fontSize: "1rem", marginTop:".5rem", marginBottom:0, color:"gray" }}>Debit Card</p>
            <h1 style={{ fontSize: "1rem", margin: 0 }}>MasterCard</h1>
            <h1 style={{ fontSize: "1.3rem", margin: "0.5rem 0" }}>•••• •••• •••• 4582</h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "1rem", color: "gray", margin: 0 }}>Name</p>
              <p style={{ fontSize: "1rem", color: "gray", margin: 0 }}>Expiry</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontSize: "1rem", margin: 0 }}>{username}</h1>
              <h1 style={{ fontSize: "1rem", margin: 0 }}>12/32</h1>
            </div>

          </div>
        </div>
      </div>

      <div style={{marginTop: ".1rem" }}>
        <h1 style={{ color: "gray", textAlign: "left", fontSize:"1.4rem", marginLeft:"5%" }}>My Transactions</h1>

        <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "90%",
            borderWidth: ".2rem",
            borderStyle: "solid",
            borderColor: "rgba(185, 183, 183, 1)",
            borderRadius: "2rem",
            padding: ".5rem",
            maxHeight: "13rem",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.4) transparent",
          }}
        >
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 2%",
                  marginBottom: ".3rem",
                  borderRadius: "1rem",
                  backgroundColor: "#1e293b", // dark card background
                  color: "white",
                  marginLeft:".5rem"
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: 500, textAlign:"left" }}>{tx.name}</p>
                  <p style={{ margin: 0, fontSize: ".8rem", color: "gray", textAlign:"left" }}>{tx.date}</p>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      color: tx.type === "income" ? "rgb(34,197,94)" : "rgb(239,68,68)",
                      fontWeight: 500,
                    }}
                  >
                    {tx.amount < 0 ? "-" : "+"}${formatAmount(Math.abs(tx.amount).toFixed(2))}
                  </p>
                </div>
              </div>
            ))}
            <p style={{color:"gray", fontSize:"1rem", margin:0}}>End of Transactions</p>
          </div>
        </div>

      </div>

    </div>
  )

}