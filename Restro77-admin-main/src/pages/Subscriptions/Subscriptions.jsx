import React, { useEffect, useState } from 'react'
import './Subscriptions.css'
import axios from "axios"
import { toast } from 'react-toastify'

const Subscriptions = ({ URl }) => {
  const [subs, setSubs] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${URl}/api/mealplan/all-subscriptions`);
      if (response.data.success) {
        setSubs(response.data.data);
      } else {
        toast.error("Error fetching subscriptions");
      }
    } catch (error) {
      toast.error("Error fetching subscriptions");
    }
  }

  useEffect(() => {
    fetchSubscriptions();
  }, [])

  return (
    <div className='subs-admin-container'>
      <div className="subs-header">
        <h3>Meal Plan Subscriptions</h3>
        <p>Overview of active meal plan subscribers</p>
      </div>

      <div className="subs-list">
        {subs.length === 0 ? (
          <div className="no-data">No active subscriptions found.</div>
        ) : (
          subs.map((sub, index) => {
            const plan = sub.customPlan || sub.planId || { name: "Unknown", price: 0, planType: "N/A" };
            const addressDetails = sub.address || {};
            
            return (
              <div key={index} className='sub-item-card'>
                <div className="card-section info">
                  <div className="plan-meta">
                    <span className="type-tag">{plan.planType}</span>
                    <h4>{plan.name}</h4>
                    <p className="price-label">₹{plan.price}</p>
                  </div>
                  
                  <div className="user-meta">
                    <label>Subscriber</label>
                    <p className="user-name">{sub.userId?.name || addressDetails.name}</p>
                    <p className="user-contact">{sub.userId?.phone || addressDetails.phone}</p>
                  </div>
                </div>

                <div className="card-section address">
                  <label>Delivery Details</label>
                  <div className="address-box">
                    <p>{addressDetails.name}</p>
                    <p>{addressDetails.phone}</p>
                    <p className="full-address">{addressDetails.address}</p>
                  </div>
                </div>

                <div className="card-section timeline">
                  <div className="date-group">
                    <div className="date-box">
                      <label>Starts</label>
                      <span>{new Date(sub.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="date-arrow">→</div>
                    <div className="date-box">
                      <label>Ends</label>
                      <span>{new Date(sub.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="status-container">
                    <span className={`status-badge ${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Subscriptions
