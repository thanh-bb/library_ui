import React from 'react';
import { Link } from 'react-router-dom';

function ImportFile() {
    return (
        <div>
            {/* Link sẽ chuyển hướng đến đường dẫn đã chỉ định */}
            <Link to="https://localhost:44344/Home/UploadExcel">Chuyển hướng đến trang Upload Excel</Link>
        </div>
    );
}

export default ImportFile;
