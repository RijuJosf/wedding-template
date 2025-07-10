import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default-image.png";
import { supabase } from "../../supabase-client";

const userId = import.meta.env.VITE_USER_ID;

const Template = () => {
  const location = useLocation();
  const { Editable } = location.state || { Editable: false };
  const { selectedUser } = location.state || { selectedUser: userId };
  const [showAddShedule, setShowAddShedule] = useState(false);
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [guestWishes, setGuestWishes] = useState<any[]>([]);
  const [eventScheduleList, setEventScheduleList] = useState<any[]>([]);
  const [templateData, setTemplateData] = useState<{
    hero?: string | null;
    gallery1?: string | null;
    gallery2?: string | null;
    homeTitle?: string | null;
    heroSubtitle?: string | null;
    celebrationTitle?: string | null;
    celebrationContent?: string | null;
    ceremonyDate?: string | null;
    ceremonyTime?: string | null;
    ceremonyVenue?: string | null;
    receptionVenue?: string | null;
    receptionDate?: string | null;
    receptionTime?: string | null;
    OurStoryImage1?: string | null;
    ourStoryTitle?: string | null;
    ourStoryDescription?: string | null;
    phone?: string | null;
    email?: string | null;
    enterpriseName?: string | null;
    enterpriseInfo?: string | null;
    enterpriseImage?: string | null;
    enterpriseLink?: string | null;
  }>({
    hero: null,
    gallery1: null,
    gallery2: null,
    homeTitle: "",
    heroSubtitle: "",
    celebrationTitle: "",
    celebrationContent: "",
    ceremonyDate: "",
    ceremonyTime: "",
    ceremonyVenue: "",
    receptionVenue: "",
    receptionDate: "",
    receptionTime: "",
    OurStoryImage1: null,
    ourStoryTitle: "",
    ourStoryDescription: "",
    phone: "",
    email: "",
    enterpriseName: "",
    enterpriseInfo: "",
    enterpriseImage: null,
    enterpriseLink: "",
  });

  const navigate = useNavigate();

  let _sheduleTitle: string = "";
  let _sheduleContent: string = "";

  const scrollToSection = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("user-id", selectedUser)
      .limit(2);
    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    } else {
      setGalleryData(data || []);
    }
  };

  const onUploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;
    const { error, data } = await supabase.storage
      .from("template-images")
      .upload(filePath, file);
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    const { data: publicUrlData } = await supabase.storage
      .from("template-images")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const UploadGalleryImage = async (file: File) => {
    console.log("Image uploaded for position:", file);
    if (!file) return;
    const imageUrl = await onUploadImage(file);
    if (!imageUrl) return;

    const { error: insertError, data: insertData } = await supabase
      .from("gallery")
      .insert([
        {
          path: imageUrl,
          "user-id": selectedUser,
          type: "image",
        },
      ]);

    if (insertError) {
      console.error("Error inserting image URL:", insertError);
    } else {
      console.log("Image URL inserted into database:", insertData);
      getGalleryImages();
    }
  };

  const UploadImage = async (file: File, pid: number, position: string) => {
    console.log("Image uploaded for position:", position, file);
    if (!file) return;

    const imageUrl = await onUploadImage(file);
    if (!imageUrl) return;

    setTemplateData((prev) => ({
      ...prev,
      [position]: imageUrl,
    }));

    const { data: existingData, error: fetchError } = await supabase
      .from("template-data")
      .select("id")
      .eq("pid", pid)
      .eq("position", position)
      .eq("type", "image")
      .eq("user-id", selectedUser)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing image entry:", fetchError);
      return;
    }

    if (existingData) {
      const { error: updateError, data: updateData } = await supabase
        .from("template-data")
        .update({
          content: imageUrl,
          "user-id": selectedUser,
        })
        .eq("id", existingData.id);

      if (updateError) {
        console.error("Error updating image URL:", updateError);
      } else {
        console.log("Image URL updated in database:", updateData);
      }
    } else {
      const { error: insertError, data: insertData } = await supabase
        .from("template-data")
        .insert([
          {
            pid,
            content: imageUrl,
            "user-id": selectedUser,
            position,
            type: "image",
          },
        ]);

      if (insertError) {
        console.error("Error inserting image URL:", insertError);
      } else {
        console.log("Image URL inserted into database:", insertData);
      }
    }
  };

  const saveText = async (pid: number, position: string, text: string) => {
    const { data: existingData, error: fetchError } = await supabase
      .from("template-data")
      .select("id")
      .eq("pid", pid)
      .eq("position", position)
      .eq("type", "text")
      .eq("user-id", selectedUser)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing data:", fetchError);
      return;
    }

    if (existingData) {
      const { error: updateError, data: updateData } = await supabase
        .from("template-data")
        .update({
          content: text,
          "user-id": selectedUser,
        })
        .eq("id", existingData.id);

      if (updateError) {
        console.error("Error updating text:", updateError);
      } else {
        console.log("Text updated in database:", updateData);
        setTemplateData((prev) => ({
          ...prev,
          [position]: text,
        }));
      }
    } else {
      const { error: insertError, data: insertData } = await supabase
        .from("template-data")
        .insert([
          {
            pid,
            content: text,
            "user-id": selectedUser,
            position,
            type: "text",
          },
        ]);

      if (insertError) {
        console.error("Error inserting text:", insertError);
      } else {
        console.log("Text inserted into database:", insertData);
        setTemplateData((prev) => ({
          ...prev,
          [position]: text,
        }));
      }
    }
  };

  const editText = (
    pid: number,
    position: string,
    currentText: string | null
  ) => {
    const newText = prompt(
      `Enter new text for ${position}:`,
      currentText || ""
    );
    if (newText !== null && newText.trim() !== "") {
      saveText(pid, position, newText);
    }
  };

  const getGuestWishes = async () => {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("user-id", selectedUser)
      .limit(3);
    if (error) {
      console.error("Error fetching guest wishes:", error);
    } else {
      setGuestWishes(data);
    }
  };

  const saveWish = async (wish: string, name: string) => {
    const { error: insertError, data: insertData } = await supabase
      .from("wishes")
      .insert([
        {
          data: wish,
          "user-id": selectedUser,
          "guest-name": name,
        },
      ]);
    if (insertError) {
      console.error("Error inserting wish:", insertError);
    } else {
      console.log("Wish inserted into database:", insertData);
      getGuestWishes();
    }
  };

  const addWish = () => {
    const newWish = prompt(`Enter new wish:`);
    if (newWish !== null && newWish.trim() !== "") {
      const guestName = prompt(`Enter name:`);
      saveWish(newWish, guestName || "Guest");
    }
  };

  const getTemplateData = async () => {
    const { data, error } = await supabase
      .from("template-data")
      .select("*")
      .eq("user-id", selectedUser);
    if (error) {
      console.error("Error fetching template data:", error);
    } else if (data && data.length > 0) {
      const newData: typeof templateData = {};
      data.forEach((item) => {
        if (item.position) {
          newData[item.position as keyof typeof templateData] = item.content;
        }
      });
      setTemplateData((prev) => ({ ...prev, ...newData }));
    }
  };

  const onAddEventScheduleItem = () => {
    if (!_sheduleTitle || !_sheduleContent) {
      alert("Please fill in both title and content for the event schedule.");
      return;
    }
    supabase
      .from("event-shedule")
      .insert([
        {
          "user-id": selectedUser,
          "event-title": _sheduleTitle,
          "event-description": _sheduleContent,
        },
      ])
      .then(({ error }) => {
        if (error) {
          console.error("Error adding event schedule item:", error);
          alert("Failed to add event schedule item.");
        } else {
          getEventScheduleData();
          _sheduleTitle = "";
          _sheduleContent = "";
        }
      });
  };

  const getEventScheduleData = async () => {
    const { data, error } = await supabase
      .from("event-shedule")
      .select("*")
      .eq("user-id", selectedUser);
    if (error) {
      console.error("Error fetching event schedule data:", error);
    } else if (data && data.length > 0) {
      setEventScheduleList(data);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (!storedUser || !storedIsLoggedIn) {
      navigate("/login");
      return;
    }

    getTemplateData();
    getEventScheduleData();
    getGalleryImages();
    getGuestWishes();
  }, []);

  const selectImage = (pid: number, position: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        UploadImage(file, pid, position);
      }
    };
    input.click();
  };

  const selectGalleryImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        UploadGalleryImage(file);
      }
    };
    input.click();
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fff1f2, #ffffff)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Navigation */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#9f1239",
          color: "#ffffff",
          padding: "16px 0",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {[
            { name: "Home", id: "home" },
            { name: "Event Details", id: "event-details" },
            { name: "Our Story", id: "our-story" },
            { name: "Gallery", id: "gallery" },
            { name: "Contact", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily: "'Georgia', serif",
                cursor: "pointer",
                padding: "8px 16px",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => scrollToSection(item.id)}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#be123c")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Home Section */}
      <div
        id="home"
        style={{
          backgroundImage: templateData.hero
            ? `url(${templateData.hero})`
            : `url(${defaultImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          position: "relative",
          marginTop: "80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#ffffff" }}>
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "'Georgia', serif",
                animation: "fadeIn 2s ease-in",
              }}
            >
              {templateData.homeTitle || "Home Title"}
              {Editable && (
                <FaEdit
                  size={18}
                  color="#000"
                  onClick={() =>
                    editText(4, "homeTitle", templateData.homeTitle ?? null)
                  }
                />
              )}
            </h1>
            <p
              style={{ fontSize: "20px", marginTop: "16px", fontWeight: "300" }}
            >
              {templateData.heroSubtitle || "hero Subtitle"}
              {Editable && (
                <FaEdit
                  size={18}
                  color="#000"
                  onClick={() =>
                    editText(
                      5,
                      "heroSubtitle",
                      templateData.heroSubtitle ?? null
                    )
                  }
                />
              )}
            </p>
          </div>
        </div>
        {Editable && (
          <FaEdit
            color="#000"
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
            }}
            onClick={() => selectImage(1, "hero")}
          />
        )}
      </div>

      {/* Main Content */}
      <div
        style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 16px" }}
      >
        {/* Welcome Message */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontFamily: "'Georgia', serif",
              color: "#9f1239",
            }}
          >
            {templateData.celebrationTitle || "Celebration Title"}
            {Editable && (
              <FaEdit
                size={18}
                color="#000"
                onClick={() =>
                  editText(
                    6,
                    "celebrationTitle",
                    templateData.homeTitle ?? null
                  )
                }
              />
            )}
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#4b5563",
              marginTop: "16px",
              maxWidth: "640px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {templateData.celebrationContent || "Celebration content"}
            {Editable && (
              <FaEdit
                size={18}
                color="#000"
                onClick={() =>
                  editText(
                    7,
                    "celebrationContent",
                    templateData.celebrationContent ?? null
                  )
                }
              />
            )}
          </p>
        </div>

        {/* Event Details */}
        <div
          id="event-details"
          style={{ display: "flex", flexDirection: "row", gap: "24px" }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "32px",
              marginBottom: "48px",
              width: "40%",
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
              Ceremony
            </h2>
            <ul
              style={{
                color: "#4b5563",
                listStyle: "none",
                padding: 0,
                fontSize: "16px",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Date:</strong>{" "}
                {templateData.ceremonyDate || "Ceremony Date"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        8,
                        "ceremonyDate",
                        templateData.ceremonyDate ?? null
                      )
                    }
                  />
                )}
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Time:</strong>{" "}
                {templateData.ceremonyTime || "Ceremony Time"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        9,
                        "ceremonyTime",
                        templateData.ceremonyTime ?? null
                      )
                    }
                  />
                )}
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Venue:</strong>
                {templateData.ceremonyVenue || "Ceremony Venue"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        10,
                        "ceremonyVenue",
                        templateData.ceremonyVenue ?? null
                      )
                    }
                  />
                )}
              </li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "32px",
              marginBottom: "48px",
              width: "40%",
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
              Reception
            </h2>
            <ul
              style={{
                color: "#4b5563",
                listStyle: "none",
                padding: 0,
                fontSize: "16px",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Date:</strong>{" "}
                {templateData.receptionDate || "Reception Date"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        11,
                        "receptionDate",
                        templateData.receptionDate ?? null
                      )
                    }
                  />
                )}
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Time:</strong>{" "}
                {templateData.receptionTime || "Reception Time"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        12,
                        "receptionTime",
                        templateData.receptionTime ?? null
                      )
                    }
                  />
                )}
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Venue:</strong>
                {templateData.receptionVenue || "Reception Venue"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    onClick={() =>
                      editText(
                        13,
                        "receptionVenue",
                        templateData.receptionVenue ?? null
                      )
                    }
                  />
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Couple's Story */}
        <div
          id="our-story"
          style={{
            marginBottom: "48px",
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
            overflow: "hidden",
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
            Our Love Story
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            {/* Image Section */}
            <div
              style={{
                flex: "1 1 300px",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={
                    templateData.OurStoryImage1
                      ? templateData.OurStoryImage1
                      : defaultImage
                  }
                  alt="Our Love Story image"
                  style={{
                    width: "100%",
                    height: "256px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {Editable && (
                  <FaEdit
                    color="#000"
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => selectImage(14, "OurStoryImage1")}
                  />
                )}
              </div>
            </div>

            {/* Text Section */}
            <div
              style={{
                flex: "1 1 300px",
                padding: "0 12px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#be123c",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {templateData.ourStoryTitle || "Our story Title"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      editText(
                        17,
                        "ourStoryTitle",
                        templateData.ourStoryTitle ?? null
                      )
                    }
                  />
                )}
              </h3>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {templateData.ourStoryDescription || "Our story Description"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() =>
                      editText(
                        18,
                        "ourStoryDescription",
                        templateData.ourStoryDescription ?? null
                      )
                    }
                  />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Event Shedule */}
        <div
          id="event-schedule"
          style={{
            marginBottom: "48px",
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#fff0f3",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
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
            Event Schedule
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {eventScheduleList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#be123c",
                    marginBottom: "4px",
                  }}
                >
                  {item["event-title"]}
                </h3>
                <p style={{ color: "#4b5563", margin: 0 }}>
                  {item["event-description"]}
                </p>
              </div>
            ))}

            {Editable && (
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#be123c",
                    marginBottom: "12px",
                  }}
                >
                  Add Event Schedule Item
                </h3>

                {!showAddShedule && (
                  <button
                    style={{
                      backgroundColor: "#be123c",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "500",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => {
                      setShowAddShedule(true);
                    }}
                  >
                    Add Item
                  </button>
                )}

                {showAddShedule && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Event Title"
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                      }}
                      onChange={(e) => {
                        _sheduleTitle = e.target.value;
                      }}
                    />
                    <textarea
                      placeholder="Event Description"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        height: "80px",
                      }}
                      onChange={(e) => {
                        _sheduleContent = e.target.value;
                      }}
                    ></textarea>
                    <button
                      style={{
                        backgroundColor: "#be123c",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "500",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => {
                        setShowAddShedule(false);
                        console.log(
                          "Saving Event Schedule Item:",
                          _sheduleTitle,
                          _sheduleContent
                        );
                        onAddEventScheduleItem();
                      }}
                    >
                      Save Item
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}

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
          id="gallery"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {galleryData.slice(0, 2).map((image: any, idx: number) => (
            <img
              key={idx}
              src={image?.path ? image?.path ?? undefined : defaultImage}
              alt="Wedding Ceremony"
              style={{
                width: "100%",
                height: "256px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          {Editable && (
            <button
              style={{
                backgroundColor: "#be123c",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "500",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => {
                selectGalleryImage();
              }}
            >
              Add Photo
            </button>
          )}

          <button
            style={{
              backgroundColor: "#be123c",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "500",
              padding: "10px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              marginLeft: "16px",
            }}
            onClick={() => {
              navigate("/gallery", { state: { selectedUser: selectedUser } });
            }}
          >
            View All
          </button>
        </div>

        {/* Guest Wishes */}
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
          {guestWishes.slice(0, 3).map((wish: any, idx: number) => (
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          <button
            style={{
              backgroundColor: "#be123c",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "500",
              padding: "10px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              marginRight: "16px",
            }}
            onClick={() => {
              addWish();
            }}
          >
            Add wish
          </button>

          <button
            style={{
              backgroundColor: "#be123c",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "500",
              padding: "10px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onClick={() => {
              navigate("/guestWishes", {
                state: { selectedUser: selectedUser },
              });
            }}
          >
            View All
          </button>
        </div>

        {/* Contact Section */}
        <div
          id="contact"
          style={{
            textAlign: "center",
            backgroundColor: "#fff1f2",
            borderRadius: "8px",
            padding: "32px",
            marginBottom: "48px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "'Georgia', serif",
              color: "#9f1239",
              marginBottom: "16px",
            }}
          >
            Contact Us
          </h2>
          <p style={{ color: "#4b5563", marginBottom: "24px" }}>
            Have any questions or need assistance? Feel free to reach out to us!
          </p>
          <p
            style={{
              color: "#4b5563",
              fontSize: "16px",
              lineHeight: "1.6",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <strong>Phone:</strong>{" "}
            {(templateData.phone || "phone Number").substring(0, 100)}
            {Editable && (
              <FaEdit
                size={18}
                color="#000"
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() =>
                  editText(15, "phone", templateData.phone ?? null)
                }
              />
            )}
          </p>

          <p
            style={{
              color: "#4b5563",
              fontSize: "16px",
              lineHeight: "1.6",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <strong>Email:</strong>{" "}
            {(templateData.email || "Email Address").substring(0, 100)}
            {Editable && (
              <FaEdit
                size={18}
                color="#000"
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() =>
                  editText(16, "email", templateData.email ?? null)
                }
              />
            )}
          </p>
        </div>

        {/* EnterPrise  info */}
        <div
          id="our-story"
          style={{
            marginBottom: "48px",
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            {/* Image Section */}
            <div
              style={{
                flex: "1 1 300px",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={
                    templateData.enterpriseImage
                      ? templateData.enterpriseImage
                      : defaultImage
                  }
                  alt="Enterprise image"
                  style={{
                    width: "100%",
                    height: "256px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {Editable && (
                  <FaEdit
                    color="#000"
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => selectImage(21, "enterpriseImage")}
                  />
                )}
              </div>
            </div>

            {/* Text Section */}
            <div
              style={{
                flex: "1 1 300px",
                padding: "0 12px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
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
                Our Jewellery Story
              </h2>

              <p
                style={{
                  color: "#4b5563",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {(templateData.enterpriseInfo || "Enterprise Info").substring(
                  0,
                  100
                )}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() =>
                      editText(
                        19,
                        "enterpriseInfo",
                        templateData.enterpriseInfo ?? null
                      )
                    }
                  />
                )}
              </p>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#be123c",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {templateData.enterpriseName || "Our story Title"}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      editText(
                        20,
                        "enterpriseName",
                        templateData.enterpriseName ?? null
                      )
                    }
                  />
                )}
              </h3>

              {/* Enterprise Link Section */}
              <div style={{ marginTop: "24px" }}>
                {templateData.enterpriseLink ? (
                  <a
                    href={templateData.enterpriseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#be123c",
                      textDecoration: "underline",
                      wordBreak: "break-all",
                      marginLeft: "8px",
                    }}
                  >
                    View Website
                  </a>
                ) : (
                  <span style={{ color: "#888", marginLeft: "8px" }}>
                    No link provided
                  </span>
                )}
                {Editable && (
                  <FaEdit
                    size={18}
                    color="#000"
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() =>
                      editText(
                        22,
                        "enterpriseLink",
                        templateData.enterpriseLink ?? null
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
};

export default Template;
