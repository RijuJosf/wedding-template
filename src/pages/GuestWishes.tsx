import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase-client";

function GuestWishes() {
  const location = useLocation();
  const { selectedUser } = location.state || { selectedUser: "" };

  const [guestWishes, setGuestWishes] = useState<any[]>([]);

  const getGuestWishes = async () => {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("user-id", selectedUser);
    if (error) {
      console.error("Error fetching guest wishes:", error);
    } else {
      setGuestWishes(data);
    }
  };

  useEffect(() => {
    getGuestWishes();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fafafa",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontFamily: "'Georgia', serif",
          color: "#9f1239",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Guest Wishes
      </h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        {guestWishes.map((wish: any, idx: number) => (
          <div
            key={wish.id || idx}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: "20px 24px",
              minWidth: "220px",
              maxWidth: "300px",
              textAlign: "center",
              flex: "1 1 220px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#4b5563",
                marginBottom: "12px",
              }}
            >
              {wish.data || "No wish message"}
            </div>
            <div style={{ fontWeight: 600, color: "#be123c" }}>
              — {wish["guest-name"] || "Guest"}
            </div>
          </div>
        ))}
      </div>
      <footer
        style={{
          textAlign: "center",
          marginTop: "32px",
          color: "#888",
          marginBottom: "32px",
        }}
      >
        &copy; {new Date().getFullYear()} Matson Wedding Templates
      </footer>
    </div>
  );
}

export default GuestWishes;
