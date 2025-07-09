import "./Header.css";

const Header = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return (
    <div className="HeaderContainer">
      <p id="company-name">Matson.</p>

      {isLoggedIn && (
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
