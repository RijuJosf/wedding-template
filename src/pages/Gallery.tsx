import React, { use, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Gallery() {
  const location = useLocation();
  const { galleryData } = location.state || { galleryData: [] };

  useEffect(() => {
    console.log("Gallery Data:", galleryData);
  });
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
      <h2 style={{ textAlign: "center", margin: "24px 0" }}>Our Gallery</h2>
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
              {item.title && (
                <p style={{ marginTop: "8px", textAlign: "center" }}>
                  {"uiuiuiui"}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No images to display.</p>
        )}
      </div>
      <footer style={{ textAlign: "center", marginTop: "32px", color: "#888" }}>
        &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Gallery;
