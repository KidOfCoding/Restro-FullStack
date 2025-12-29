import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Login.css'

const Login = ({ setToken, URl }) => {
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(URl + "/api/user/admin/login", { password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Welcome Admin!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login Failed");
        }
    }

    return (
        <div className='login-container'>
            <div className="login-box">
                <h2>Admin Panel</h2>
                <form onSubmit={onSubmitHandler}>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
