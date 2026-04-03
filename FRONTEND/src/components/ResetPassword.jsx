
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
        <>
        {
            isLoading ? 
            <><b>...Validating...Please Wait...</b></>
            : (
                isValid ? 
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="password" placeholder='reset password here...' value={password} onChange={(e) => {setPassword(e.target.value.trim());}}/>
                        <button type='submit'>Reset</button>
                    </form>
                </div>
                :
                <div><b>Invalid link</b></div>
            )
        }
        </>
    )
}

export default ResetPassword