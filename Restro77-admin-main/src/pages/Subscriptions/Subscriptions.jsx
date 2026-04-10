import React, { useEffect, useState } from 'react'
import './Subscriptions.css'
import axios from "axios"
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

const Subscriptions = ({ URl }) => {
  const [subs, setSubs] = useState([]);
  const [activeTab, setActiveTab] = useState('Active');

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

  const handleExport = () => {
    const activeSubs = subs.filter(sub => sub.status === 'Active');
    const exportData = activeSubs.map(sub => {
      const addressDetails = sub.address || {};
      return {
        "Name": sub.userId?.name || addressDetails.name || 'N/A',
        "Phone": sub.userId?.phone || addressDetails.phone || 'N/A',
        "Address": addressDetails.address || 'N/A',
        "Plan Name": sub.customPlan?.name || sub.planId?.name || 'N/A',
        "Starts On": new Date(sub.startDate).toLocaleDateString(),
        "Ends On": new Date(sub.endDate).toLocaleDateString()
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Active Subscribers");
    XLSX.writeFile(workbook, "Active_Subscribers.xlsx");
  }

  const filteredSubs = subs.filter(sub => activeTab === 'Active' ? sub.status === 'Active' : (sub.status === 'Expired' || sub.status === 'Cancelled'));

  return (
    <div className='subs-admin-container'>
      <div className="subs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Meal Plan Subscriptions</h3>
          <p>Overview of meal plan subscribers</p>
        </div>
        {activeTab === 'Active' && (
          <button onClick={handleExport} className="export-btn" style={{ padding: '10px 20px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Export Excel
          </button>
        )}
      </div>

      <div className="subs-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('Active')} 
          style={{ background: 'transparent', color: activeTab === 'Active' ? '#ff6b4a' : '#fff', border: 'none', borderBottom: activeTab === 'Active' ? '2px solid #ff6b4a' : 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '5px 10px' }}
        >
          Active
        </button>
        <button 
          onClick={() => setActiveTab('Expired')} 
          style={{ background: 'transparent', color: activeTab === 'Expired' ? '#ff6b4a' : '#fff', border: 'none', borderBottom: activeTab === 'Expired' ? '2px solid #ff6b4a' : 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '5px 10px' }}
        >
          Expired
        </button>
      </div>

      <div className="subs-list">
        {filteredSubs.length === 0 ? (
          <div className="no-data">No {activeTab.toLowerCase()} subscriptions found.</div>
        ) : (
          filteredSubs.map((sub, index) => {
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
