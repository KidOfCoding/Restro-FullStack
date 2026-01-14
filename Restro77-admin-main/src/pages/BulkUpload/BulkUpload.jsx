import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './BulkUpload.css';

const BulkUpload = ({ url }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setStatus("Uploading...");

        try {
            const response = await axios.post(`${url}/api/food/bulk-upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setStatus("Upload Successful!");
                setFile(null);
                // Clear input manually if needed
                document.getElementById('fileInput').value = "";
            } else {
                toast.error("Upload Failed: " + response.data.message);
                setStatus("Upload Failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during upload.");
            setStatus("Error.");
        }
    };

    return (
        <div className='bulk-upload add'>
            <div className="bulk-card">
                <h2>Bulk Menu Upload</h2>
                <div className="bulk-info">
                    <p>Upload the <b>Excel (.xlsx)</b> file to update the menu items.</p>
                </div>

                <form onSubmit={handleUpload} className='flex-col'>
                    <div className='bulk-input-group'>
                        <label>Select Excel File</label>
                        <input
                            className="bulk-file-input"
                            id="fileInput"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <button type='submit' className='bulk-btn'>
                        {status === "Uploading..." ? "Processing..." : "Upload Menu"}
                    </button>

                    {status && <p className={`status-msg ${status.includes("Success") ? "success" : "error"}`}>{status}</p>}
                </form>

                <div className="bulk-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                        <li>File must be .xlsx format.</li>
                        <li>Column 1: Section (Category)</li>
                        <li>Column 2: Item Name (Unique Key)</li>
                        <li>Column 3: Price (or Half Price)</li>
                        <li>Column 4: Full Price (Optional, for variants)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BulkUpload;
