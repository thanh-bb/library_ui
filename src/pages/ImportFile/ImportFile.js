import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './ImportFile.module.scss';

function ImportFile() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const cx = classNames.bind(styles);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://localhost:44315/api/ImportFile/UploadExcelFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data);
            window.alert(response.data); // Hiển thị thông báo
        } catch (error) {
            setMessage('Failed to upload file: ' + error.message);
            window.alert('Failed to upload file: ' + error.message); // Hiển thị thông báo
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className="container text-center ">
                <h1 className='fs-1 fw-bold '>Thêm Người Dùng</h1>
                <div className="row d-flex justify-content-around mt-5">
                    <div className="col d-flex justify-content-end mt-5">
                        <input className="mt-4 fs-3" type="file" onChange={handleFileChange} />
                    </div>
                    <div className="col d-flex justify-content-start mt-5">
                        <button onClick={handleUpload} className={cx('btn-grad')}>Upload</button>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default ImportFile;
