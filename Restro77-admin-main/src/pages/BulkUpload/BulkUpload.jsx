
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
        <div className='add'>
            <div style={{ maxWidth: "600px" }}>
                <h2>Bulk Menu Upload</h2>
                <p>Upload the <b>Excel (.xlsx)</b> file to update the menu items.</p>
                <br />

                <form onSubmit={handleUpload} className='flex-col'>
                    <div className='add-product-name flex-col'>
                        <p>Select Excel File</p>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            required
                            style={{ padding: "10px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <button type='submit' className='add-btn' style={{ marginTop: "20px" }}>
                        {status === "Uploading..." ? "Processing..." : "Upload Menu"}
                    </button>

                    {status && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{status}</p>}
                </form>

                <div style={{ marginTop: "30px", background: "#f0f0f0", padding: "15px", listStyle: "none" }}>
                    <h4>Instructions:</h4>
                    <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
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
