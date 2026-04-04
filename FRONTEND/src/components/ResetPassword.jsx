import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
    const params = useParams();
    const userId = params.userId
    const navigate = useNavigate();

    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const checkResetLink = async () => {
            setIsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/reset-password-initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            });    
            const data = await response.json();
            setIsValid(data?.success || false)
            setIsLoading(false);
        }
        checkResetLink();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    password: password
                })
            });
            const data = await result.json();
            if (data.success) {
                navigate('/login');
                return;
            }
            throw new Error(data.message);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        {
            isLoading ? 
            (
                <div className="text-center text-white text-lg font-semibold animate-pulse">
                    ...Validating...Please Wait...
                </div>
            )
            : (
                isValid ? 
                <div className="w-full max-w-md bg-slate-800 shadow-2xl rounded-2xl p-8 border border-slate-700">
                    
                    <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Reset Your Password
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input 
                            type="password" 
                            placeholder='Reset password here...' 
                            value={password} 
                            onChange={(e) => {setPassword(e.target.value.trim());}}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        />
                        <button 
                            type='submit'
                            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition duration-200 shadow-md hover:shadow-lg"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
                :
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-xl font-semibold">
                    Invalid link
                </div>
            )
        }
        </div>
    )
}

export default ResetPassword