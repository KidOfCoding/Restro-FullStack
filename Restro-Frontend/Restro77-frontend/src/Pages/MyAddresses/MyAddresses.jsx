import React, { useContext, useEffect, useState } from 'react'
import './MyAddresses.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

import { FaBriefcase, FaHome, FaMapMarkerAlt, FaPlus, FaTrash } from "react-icons/fa";

const MyAddresses = () => {

    const { URl, token } = useContext(StoreContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [label, setLabel] = useState("Home");

    const fetchAddresses = async () => {
        if (token) {
            const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
            if (response.data.success) {
                setAddresses(response.data.userData.addresses || []);
            }
        }
    }

    const addAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(URl + "/api/user/save-address", { address: newAddress, label }, { headers: { token } });
            if (response.data.success) {
                setAddresses(response.data.addresses);
                setNewAddress("");
                toast.success("Address Saved");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error saving address");
        }
    }

    const removeAddress = async (addressId) => {
        try {
            const response = await axios.post(URl + "/api/user/delete-address", { addressId }, { headers: { token } });
            if (response.data.success) {
                setAddresses(response.data.addresses);
                toast.success("Address Deleted");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting address");
        }
    }

    useEffect(() => {
        fetchAddresses();
    }, [token])

    const getIcon = (lbl) => {
        switch (lbl) {
            case "Home": return <FaHome />;
            case "Work": return <FaBriefcase />;
            default: return <FaMapMarkerAlt />;
        }
    }

    return (
        <div className='my-addresses'>
            <h2><FaMapMarkerAlt style={{ color: '#ff6b4a' }} /> Saved Addresses</h2>

            <div className="address-form">
                <h3>Add New Address</h3>
                <div className="form-group">
                    <textarea
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter full address details (Street, City, Zip, etc.)"
                        required
                    ></textarea>
                </div>

                <div className="form-actions">
                    <div className="select-wrapper">
                        <select value={label} onChange={(e) => setLabel(e.target.value)}>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button onClick={addAddress} className="save-btn"><FaPlus /> Save Address</button>
                </div>
            </div>

            <div className="address-list">
                <h3>Your Locations</h3>
                <div className="address-grid">
                    {addresses.map((addr, index) => (
                        <div key={index} className="address-card">
                            <div className="address-icon">
                                {getIcon(addr.label)}
                            </div>
                            <div className="address-content">
                                <div className="address-header">
                                    <b>{addr.label}</b>
                                    <button onClick={() => removeAddress(addr._id)} className="delete-btn" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                                <p>{addr.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {addresses.length === 0 && (
                    <div className="empty-state">
                        <p>No saved addresses found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyAddresses

