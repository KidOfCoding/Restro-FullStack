import React, { useEffect, useState } from 'react'
import './Delivery.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Delivery = ({ URl }) => {

    const [points, setPoints] = useState([]);
    const [name, setName] = useState("");
    const [dist, setDist] = useState("");
    const [cost, setCost] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchPoints = async () => {
        try {
            const response = await axios.get(URl + "/api/delivery/list");
            if (response.data.success) {
                setPoints(response.data.data);
            } else {
                toast.error("Error fetching points");
            }
        } catch (error) {
            toast.error("Error fetching points");
        }
    }

    const addPoint = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(URl + "/api/delivery/add", {
                name,
                defaultDistance: Number(dist),
                baseCost: Number(cost)
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setName("");
                setDist("");
                setCost("");
                fetchPoints();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error adding point");
        }
        setLoading(false);
    }

    const removePoint = async (id) => {
        try {
            const response = await axios.post(URl + "/api/delivery/remove", { id });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchPoints();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error removing point");
        }
    }

    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [boyName, setBoyName] = useState("");
    const [boyPhone, setBoyPhone] = useState("");
    const [loadingBoy, setLoadingBoy] = useState(false);

    const fetchDeliveryBoys = async () => {
        try {
            const response = await axios.get(URl + "/api/deliveryBoy/list");
            if (response.data.success) {
                setDeliveryBoys(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching delivery boys");
        }
    }

    const addDeliveryBoy = async () => {
        if (!boyName || !boyPhone) return toast.error("Please fill all fields");
        setLoadingBoy(true);
        try {
            const response = await axios.post(URl + "/api/deliveryBoy/add", {
                name: boyName,
                phone: boyPhone
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setBoyName("");
                setBoyPhone("");
                fetchDeliveryBoys();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error adding delivery boy");
        }
        setLoadingBoy(false);
    }

    const removeDeliveryBoy = async (id) => {
        try {
            const response = await axios.post(URl + "/api/deliveryBoy/remove", { id });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchDeliveryBoys();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error removing delivery boy");
        }
    }

    useEffect(() => {
        fetchPoints();
        fetchDeliveryBoys();
    }, []);

    return (
        <div className='delivery add flex-col'>
            <h2>Delivery Settings</h2>

            <form className='flex-col' onSubmit={addPoint}>
                <div className="add-product-name flex-col">
                    <p>Landmark Name</p>
                    <input
                        type="text"
                        placeholder='e.g. Near KV Hostel'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="add-product-description flex-col">
                    <div className="flex-row gap-20">
                        <div className="flex-col">
                            <p>Base Distance (km)</p>
                            <input
                                type="number"
                                placeholder='5'
                                required
                                value={dist}
                                onChange={(e) => setDist(e.target.value)}
                            />
                        </div>
                        <div className="flex-col">
                            <p>Base Cost (₹)</p>
                            <input
                                type="number"
                                placeholder='20'
                                required
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <button type='submit' className='add-btn' disabled={loading}>
                    {loading ? "Adding..." : "Add Delivery Point"}
                </button>
            </form>

            <div className="list-table format title">
                <b>Name</b>
                <b>Base Dist</b>
                <b>Base Cost</b>
                <b>Action</b>
            </div>
            {points.map((item, index) => {
                return (
                    <div key={index} className='list-table format'>
                        <p>{item.name}</p>
                        <p>{item.defaultDistance} km</p>
                        <p>₹{item.baseCost}</p>
                        <p onClick={() => removePoint(item._id)} className='cursor'>X</p>
                    </div>
                )
            })}
            {/* Existing Landmark Logic Ends Here */}

            <hr style={{ margin: "30px 0", border: "1px solid #444" }} />

            <h2>Manage Delivery Boys</h2>
            <div className='flex-col'>
                <div className="add-product-name flex-col">
                    <div className="flex-row gap-20">
                        <div className="flex-col">
                            <p>Name</p>
                            <input type="text" placeholder='Driver Name' value={boyName} onChange={(e) => setBoyName(e.target.value)} />
                        </div>
                        <div className="flex-col">
                            <p>Phone</p>
                            <input type="number" placeholder='Phone Number' value={boyPhone} onChange={(e) => setBoyPhone(e.target.value)} />
                        </div>
                        <button onClick={addDeliveryBoy} className='add-btn' style={{ marginTop: '24px', width: '120px' }} disabled={loadingBoy}>
                            {loadingBoy ? "Adding..." : "Add Boy"}
                        </button>
                    </div>
                </div>

                <div className="list-table format title" style={{ marginTop: '20px' }}>
                    <b>Name</b>
                    <b>Phone</b>
                    <b>Action</b>
                </div>
                {deliveryBoys.map((boy, index) => {
                    return (
                        <div key={index} className='list-table format'>
                            <p>{boy.name}</p>
                            <p>{boy.phone}</p>
                            <p onClick={() => removeDeliveryBoy(boy._id)} className='cursor'>X</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Delivery
