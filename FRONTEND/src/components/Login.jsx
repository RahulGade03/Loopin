import { setAuthUser } from '@/redux/authSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [input, setInput] = useState({
    username: "",
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
    setInput({ ...input, [e.target.name]: [e.target.value] });
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("https://loopin-839q.onrender.com/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: input.username[0],
          email: input.email[0],
          password: input.password[0]
        }),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setAuthUser(data.user));
        navigate('/');
        setInput({
          username: "",
          email: "",
          password: ""
        });
      } else {
        // Toast
      }
      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-300 to-purple-500 bg-[length:200%_200%] animate-gradientMove z-0"></div>

        {/* Login Form */}
        <form
          onSubmit={loginHandler}
          className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-pink-600 mb-2">🚀</div>
            <p className="text-gray-700 text-sm">Login to the new World!!</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="pt-3">
              {
                loading ? (
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 cursor-not-allowed" disabled>
                    Please wait...
                  </button>
                ) : (
                  <button type='submit' className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    Login
                  </button>
                )
              }
              <div className='text-center mt-3'> <Link to={'/signup'} className='text-blue-400'>Create account</Link></div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;