import { useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Header from "./Header";
import Footer from "./Footer";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    //login
    // const {error,data} = await supabase.from('login').insert([{email:email,password:password}]);
    console.log(data);

    if (error) {
      console.error("ERROR while fetching Login credentials");
      setIsLoading(false);
      return;
    } else {
      const isValid = checkCredentials(data, email, password);
      if (isValid) {
        setIsLoading(false);

        navigate("/template", { state: { Editable: true } });
      } else {
        setIsLoading(false);

        setError("userName or password is incorrect");
      }
    }
  };

  return (
    <div id="RootContainer">
      <Header />

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
              // onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Sign In"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
