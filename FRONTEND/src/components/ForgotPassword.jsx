import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                })
            });

            const data = await res.json();
            if (data.success) {
                setIsSuccess(true);
                setEmail("");
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

                {/* LEFT PANEL */}
                <div className="w-[35%] min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-8">
                    <form
                        onSubmit={submitHandler}
                        className="w-full max-w-md text-white"
                    >
                        {/* Branding */}
                        <div className="mb-10 flex flex-col items-center">
                            <img src='/LoopIn_brand_logo.png' className='w-2xs'/>
                            <p className="text-gray-400 mt-2 text-sm">
                                Reset your password
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                    placeholder="Enter your email"
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
                                            Send Email
                                        </button>
                                    )
                                }

                                {/* Links */}
                                <div className="flex justify-center text-sm text-gray-400 mt-4 text-center">
                                    <p>Surf through the world! <Link to="/login" className="transition hover:text-white">Login</Link></p>
                                </div>

                                {/* Success Message */}
                                {isSuccess && (
                                    <p className="text-green-400 text-sm text-center mt-4">
                                        Email sent to your mail address!
                                    </p>
                                )}
                            </div>

                        </div>
                    </form>
                </div>

                {/* RIGHT PANEL (Same bright energetic image) */}
                <div className="relative w-[65%] hidden md:block">
                    <img
                        src="https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg"
                        alt="Friends celebrating"
                        className="w-full h-screen object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

            </div>
        </>
    );
}

export default ForgotPassword;