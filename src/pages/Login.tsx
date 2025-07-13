import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase-client";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const navigate = useNavigate();

  function checkCredentials(users: any, email: string, password: string) {
    return users.some(
      (user: any) => user.email === email && user.password === password
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    const { error, data } = await supabase.from("login").select("*");

    if (error) {
      console.error("ERROR while fetching Login credentials");
      setIsLoading(false);
      return;
    } else {
      const isValid = checkCredentials(data, email, password);
      if (isValid) {
        setIsLoading(false);
        localStorage.setItem("user", JSON.stringify({ email }));
        localStorage.setItem("isLoggedIn", "true");
        getUsers();
        setIsLoggedIn(true);
      } else {
        setIsLoading(false);

        setError("userName or password is incorrect");
      }
    }
  };

  const getUsers = () => {
    const adminUser = localStorage.getItem("user");
    const adminEmail = adminUser ? JSON.parse(adminUser).email : "";

    supabase
      .from("users")
      .select("*")
      .eq("admin-id", adminEmail)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data);
        }
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    getUsers();
  }, []);

  const AddUserForm = ({ onUserAdded }: { onUserAdded: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [userEmail, setUserEmail] = useState<string>("");
    const adminUser = localStorage.getItem("user");
    const adminEmail = adminUser ? JSON.parse(adminUser).email : "";

    const handleAddUser = async () => {
      setError("");
      setIsLoading(true);
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(userEmail)) {
        setError("Please enter a valid email");
        setIsLoading(false);
        return;
      }

      if (!userEmail) {
        setError("Please enter a user email");
        setIsLoading(false);
        return;
      }

      const userid = `user-${uuidv4()}`;
      const { error } = await supabase
        .from("users")
        .insert([
          { "user-id": userid, email: userEmail, "admin-id": adminEmail },
        ]);

      setIsLoading(false);

      if (error) {
        console.error(error);
        if (error?.code === "23505") {
          setError("Email already exists. Please use another");
          return;
        }
        setError("Failed to add user");
      } else {
        onUserAdded();
      }
    };

    return (
      <div className="add-user-form">
        <h4>Add User</h4>
        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="User Email"
          value={userEmail}
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
          required
        />
        <button onClick={handleAddUser} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add User"}
        </button>
      </div>
    );
  };

  return (
    <div id="RootContainer">
      <Header />

      {!isLoggedIn ? (
        <div className="login-container">
          <h2 className="login-text">Login</h2>

          {error && <div className="">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="form-input">
                <label htmlFor="email" className="input-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-input">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? <span className="loader" /> : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="users-list-container">
          <h3>Users</h3>
          <ul className="users-list">
            {users.map((user, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate("/template", {
                    state: { Editable: true, selectedUser: user["user-id"] },
                  });
                }}
              >
                {user.email}
              </li>
            ))}
          </ul>
          <AddUserForm onUserAdded={() => getUsers()} />
        </div>
      )}
     
    </div>
  );
};

export default Login;
