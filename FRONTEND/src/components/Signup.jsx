import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: input.username,
                    email: input.email,
                    password: input.password
                })
            });

            const data = await res.json();
            if (data.success) {
                navigate('/login');
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
  <>
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="w-[35%] min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-8">
        <form
          onSubmit={signupHandler}
          className="w-full max-w-md text-white"
        >
          {/* Branding */}
          <div className="mb-10 flex flex-col items-center">
            <img src='/LoopIn_brand_logo.png' className='w-2xs'/>
            <p className="text-gray-400 mt-2 text-sm">
              Create your account and get started.
            </p>
          </div>

          <div className="space-y-2">

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
              />
            </div>

            {/* Button */}
            <div className="pt-4">
              {
                loading ? (
                  <button
                    className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Please wait...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Sign Up
                  </button>
                )
              }

              {/* Links */}
              <div className="text-sm text-gray-400 mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* RIGHT PANEL (Different Image) */}
      <div className="w-[65%] hidden md:block">
        <img
          src="https://cdn6.dissolve.com/p/D2012_182_060/D2012_182_060_1200.jpg"
          alt="People connecting"
          className="w-full h-screen object-cover"
        />
      </div>

    </div>
  </>
);
}

export default Signup;