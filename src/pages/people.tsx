import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navigateTo } from "../utils/navigate";
import { getPeople } from "../controllers/peopleController"; // your async fetch function

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

export default function People() {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState<{name: string, accountNumber: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<{[key: string]: {name: string, accountNumber: string}[]}>({}); // cache previous results
  const debounceRef = useRef<number | null>(null);

    useEffect(() => {
    if (!search || search.length < 10) {
        setPeople([]);
        return;
    }

    // Check if we can reuse previous results
    const cachedKeys = Object.keys(cacheRef.current).filter(key => search.startsWith(key));
    if (cachedKeys.length > 0) {
        const longestKey = cachedKeys.sort((a,b) => b.length - a.length)[0];
        const filtered = cacheRef.current[longestKey].filter(p => p.accountNumber.startsWith(search));
        setPeople(filtered);
        return;
    }

    // Debounce API call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
        const res = await getPeople(Number(search));
        cacheRef.current[search] = res;
        setPeople(res);
        } catch (_) {
        setPeople([]);
        } finally {
        setLoading(false);
        }
    }, 400); // 400ms delay
    }, [search]);


  return (
    <div>
      <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
        <div style={{ width: "100%", backgroundColor: "rgb(87, 180, 255)", paddingTop:"10%" }}>
          <div style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <img src="./logo/logo_circle.png" width="15%" alt="Logo" />
            <h1 style={{ fontSize: "2.5rem", margin: 0 }}>NeoBank</h1>
          </div>
        </div>
      </div>

      {/* Back Icon */}
      <div style={{ position: "absolute", left: ".1rem", top: "9rem" }} onClick={()=>{navigateTo(navigate, "/home")}}>
        <BackIcon />
      </div>

      {/* Search Input */}
      <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          style={{
            width: "90%",
            height: "1.2rem",
            fontSize: "1.8rem",
            borderRadius: ".8rem",
            background: "white",
            borderColor: "rgba(0,0,0,0.5)",
            padding: ".5rem",
            color:"black"
          }}
          id="accountNumber"
          placeholder="Account Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <hr style={{ border: "2px solid rgba(87,180,255,0.5)", marginTop: "1rem", width: "90%" }} />
      </div>

      {/* People list */}
      <div style={{ marginTop: "1rem", width: "90%", marginLeft: "5%", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {loading && <p style={{color:"black", fontSize:"2rem"}}>Loading...</p>}
        {people.map((person, idx) => (
          <div key={idx} className="person-card" onClick={()=>{navigateTo(navigate, `/send?account=${person.accountNumber}`)}}>
            <span>{person.name}</span>
            <span>{person.accountNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
