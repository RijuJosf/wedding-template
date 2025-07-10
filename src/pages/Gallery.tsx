import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase-client";

function Gallery() {
  const location = useLocation();
  const { selectedUser } = location.state || { selectedUser: "" };
  const [galleryData, setGalleryData] = useState<any[]>([]);

  const getGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("user-id", selectedUser);
    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    } else {
      setGalleryData(data || []);
    }
  };

  useEffect(() => {
    getGalleryImages();
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
        Our Gallery
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {galleryData && galleryData.length > 0 ? (
          galleryData.map((item: any, idx: number) => (
            <div
              key={idx}
              style={{
                border: "1px solid #eee",
                padding: "8px",
                borderRadius: "8px",
                background: "#fafafa",
              }}
            >
              <img
                src={item.path}
                alt={`Gallery Image ${idx + 1}`}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
            </div>
          ))
        ) : (
          <p>No images to display.</p>
        )}
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

export default Gallery;
