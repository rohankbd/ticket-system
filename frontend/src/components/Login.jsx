import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await loginApi(username, password);
      login(data.access);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
  //     <div className="text-center">
  //       <h1 className="mt-3 text-6xl font-extrabold text-white">
  //         Ticket Management System
  //       </h1>
  //       <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
  //         <div>
  //           <h2 className="text-3xl font-extrabold text-gray-900">
  //             Sign in to your account
  //           </h2>
  //           <p className="mt-2 text-sm text-gray-600">
  //             Or{" "}
  //             <a
  //               href="/register"
  //               className="font-medium text-indigo-600 hover:text-indigo-500"
  //             >
  //               register a new account
  //             </a>
  //           </p>
  //         </div>
  //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
  //           <div className="rounded-md shadow-sm -space-y-px">
  //             <div>
  //               <label htmlFor="username" className="sr-only">
  //                 Username
  //               </label>
  //               <input
  //                 id="username"
  //                 name="username"
  //                 type="text"
  //                 required
  //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //                 placeholder="Username"
  //                 value={username}
  //                 onChange={(e) => setUsername(e.target.value)}
  //               />
  //             </div>
  //             <div>
  //               <label htmlFor="password" className="sr-only">
  //                 Password
  //               </label>
  //               <input
  //                 id="password"
  //                 name="password"
  //                 type="password"
  //                 required
  //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  //                 placeholder="Password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //               />
  //             </div>
  //           </div>

  //           {error && (
  //             <div className="text-red-500 text-sm text-center">{error}</div>
  //           )}

  //           <div>
  //             <button
  //               type="submit"
  //               disabled={isLoading}
  //               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
  //             >
  //               {isLoading ? "Signing in..." : "Sign in"}
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-lg w-full">
        <h1 className="mt-3 text-5xl font-extrabold text-white">
          Ticket Management System
        </h1>
        <div className="mt-8 bg-white p-4 rounded-xl shadow-2xl space-y-4">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-med text-gray-600">
            Or{" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              register a new account
            </a>
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
