import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserFromToken = () => {
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLogin(true);
      } else {
        setUser(null);
        setIsLogin(false);
      }
    };

    fetchUserFromToken();
  }, [token]);


  const refreshToken = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5002/refresh-token", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, setError) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5002/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setIsLogin(true);
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, isTeam, setError) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5002/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, isTeam }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLogin(false);
  };

  const deleteUser = async (id, setError) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLogin,
        deleteUser,
        loading,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
