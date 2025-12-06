import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-10 max-w-3xl text-center border border-white/20">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
          Welcome to <span className="text-yellow-300">TaskFlow</span>
        </h1>

        <p className="text-lg text-gray-200 mb-10 max-w-xl mx-auto leading-relaxed">
          Manage your tasks smartly with a seamless dashboard, secure login, and easy workflow.
        </p>

        <div className="flex gap-6 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-xl transition transform hover:scale-105"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-xl transition transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>

      <footer className="mt-10 text-white/80 text-sm">
        © {new Date().getFullYear()} done by VJ
      </footer>
    </div>
  );
}
