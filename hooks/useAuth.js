import { useRouter } from "next/router";
import React from "react";

const AuthContext = React.createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    } else {
      setUser(user);
      router.push("/maps");
    }
  }, []);

  function signup(username, password) {
    fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        router.push("/maps");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function login(username, password) {
    await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Wrong username or password");
          Promise.reject();
        }
      })
      .then((data) => {
        if (!data) return;
        console.log(data);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        router.push("/maps");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  const value = {
    signup,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
