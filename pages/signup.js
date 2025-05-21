import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    location: "",
    bio: "",
    services: "",
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from("masseur_profiles").insert({
        user_id: user.id,
        name: form.name,
        location: form.location,
        bio: form.bio,
        services: form.services,
        approved: false,
      });

      if (profileError) {
        setErrorMsg(profileError.message);
      } else {
        setSuccess(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl max-w-xl w-full p-10">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 text-center">
          Join MasseurTouch
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your masseur profile and reach new clients.
        </p>

        {success ? (
          <div className="text-center text-green-600 text-xl font-semibold">
            ✅ Signup successful! Please check your email and wait for admin approval.
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {["email", "password", "name", "location", "services"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={
                  field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")
                }
                value={form[field]}
                onChange={handleChange}
                required={field !== "location"}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ))}
            <textarea
              name="bio"
              placeholder="Short Bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="w-full bg-pink-500 text-white font-semibold p-3 rounded-lg hover:bg-pink-600 transition"
            >
              Sign Up
            </button>

            {errorMsg && (
              <p className="text-red-500 text-center mt-2">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
