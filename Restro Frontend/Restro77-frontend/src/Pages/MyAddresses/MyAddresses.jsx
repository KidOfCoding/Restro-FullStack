import React, { useContext, useEffect, useState } from 'react'
import './MyAddresses.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

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

    return (
        <div className='my-addresses'>
            <h2>Saved Addresses</h2>
            <div className="address-form">
                <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter full address details (Street, City, Zip, etc.)"
                    required
                ></textarea>
                <select value={label} onChange={(e) => setLabel(e.target.value)}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                </select>
                <button onClick={addAddress}>Save Address</button>
            </div>

            <div className="address-list">
                {addresses.map((addr, index) => (
                    <div key={index} className="address-card">
                        <div className="address-header">
                            <b>{addr.label}</b>
                            <button onClick={() => removeAddress(addr._id)}>Delete</button>
                        </div>
                        <p>{addr.address}</p>
                    </div>
                ))}
                {addresses.length === 0 && <p>No saved addresses.</p>}
            </div>
        </div>
    )
}

export default MyAddresses
