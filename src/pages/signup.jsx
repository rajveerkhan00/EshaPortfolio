import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-black via-gray-900 to-black animate-bg-pan bg-[length:400%_400%]">
      <form
        onSubmit={handleSignup}
        className="backdrop-blur-sm bg-white/5 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition duration-300 py-3 rounded-lg font-semibold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
