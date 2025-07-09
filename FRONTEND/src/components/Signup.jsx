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
        setInput({ ...input, [e.target.name]: [e.target.value] });
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
            const res = await fetch("https://loopin-839q.onrender.com/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: input.username[0],
                    email: input.email[0],
                    password: input.password[0]
                }),
                withCredentials: true
            });
            const data = await res.json();
            if (data.success) {
                navigate('/login');

                console.log(data);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            } else {
                // console.log(data);
                //Toast
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 px-4">
                <form onSubmit={signupHandler} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-pink-600 mb-2">🚀</div>
                        <p className="text-gray-700 text-sm">Explore a new world here!</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={input.username}
                                onChange={changeEventHandler}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

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
                                    <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                                        Please wait...
                                    </button>
                                ) : (
                                    <button type='submit' className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                                        Sign Up
                                    </button>
                                )
                            }
                            <div className='text-center mt-3'>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signup;