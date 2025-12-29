import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
    const { URl, token, fetchUserPoints } = useContext(StoreContext);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "" // We will handle address updates later if needed
    });

    const fetchProfile = async () => {
        if (!token) return;
        try {
            const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
            if (response.data.success) {
                setUserData(response.data.userData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [token])

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserData(data => ({ ...data, [name]: value }));
    }

    const onUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(URl + "/api/user/update-profile", userData, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                // Refresh context data
                fetchUserPoints(token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile");
        }
    }

    return (
        <div className='profile-container'>
            <h2>My Profile</h2>
            <form onSubmit={onUpdate} className='profile-form'>
                <div className='form-group'>
                    <label>Name</label>
                    <input type="text" name="name" value={userData.name} onChange={onChangeHandler} />
                </div>
                <div className='form-group'>
                    <label>Email</label>
                    <input type="email" name="email" value={userData.email} disabled className='disabled' />
                </div>
                <div className='form-group'>
                    <label>Phone</label>
                    <input type="tel" name="phone" value={userData.phone} onChange={onChangeHandler} placeholder="Add phone number" />
                </div>
                 <div className='form-group'>
                    <label>address</label>
                    <textarea type="tel" name="address" value={userData.address} onChange={onChangeHandler} placeholder="Add Address" />
                </div>
                <button type="submit" className='save-btn'>Save Changes</button>
            </form>
        </div>
    )
}

export default Profile
