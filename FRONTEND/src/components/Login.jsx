import React, { useEffect, useState } from 'react';
import { setAuthUser } from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(import.meta.env.VITE_BACKEND_BASE_URL);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password
        }),
        credentials: 'include'
      });

      const data = await res.json();
      if (data.success) {
        dispatch(setAuthUser(data.user));
        navigate('/');
        setInput({
          email: "",
          password: ""
        });
      } else {
        // Toast
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

        {/* LEFT PANEL (Login Form) */}
        <div className="w-[35vw] min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-8">
          <form
            onSubmit={loginHandler}
            className="w-full max-w-md text-white"
          >
            {/* Branding */}
            <div className="mb-10 flex flex-col items-center">
              <img src='/LoopIn_brand_logo.png' className='w-2xs'/>
              <p className="text-gray-400 mt-2 text-sm">
                Welcome back! Login to continue.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
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
                  placeholder="Enter your password"
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
                      Login
                    </button>
                  )
                }

                {/* Links */}
                <div className='flex items-center justify-around'>
                  <div className="text-sm text-gray-400 mt-4 text-center">
                    <Link to="/signup" className="hover:text-white">
                      Create account
                    </Link>
                  </div>
                  <div className="text-sm text-gray-400 mt-4 text-center">
                    <Link to="/forgot-password" className="hover:text-white">
                      Forgot Password
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL (Image Section) */}
        <div className="w-[65%] hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
            alt="Happy people"
            className="w-full h-screen object-cover"
          />
        </div>
      </div>
    </>
  );
}

export default Login;