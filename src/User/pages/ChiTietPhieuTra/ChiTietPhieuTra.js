import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChiTietPhieuTra.module.scss';

const cx = classNames.bind(styles);

function ChiTietPhieuTra() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phieuMuonDetails, setPhieuMuonDetails] = useState([]);
    const [phieuTra, setPhieuTra] = useState(null);
    const [bookImages, setBookImages] = useState({});
    const PhotoPath = "https://localhost:44315/Photos/";

    useEffect(() => {
        const fetchPhieuMuon = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/QuanLyPhieuMuon/ByPmId/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhieuMuonDetails(data);
                    data.forEach(book => fetchBookImages(book.Id_Sach));
                } else {
                    throw new Error('Failed to fetch phiếu mượn details');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookImages = (sId) => {
            fetch(`https://localhost:44315/api/HinhMinhHoa/${sId}`)
                .then(response => response.json())
                .then(images => {
                    setBookImages(prevState => ({
                        ...prevState,
                        [sId]: images.map(image => ({
                            hmh_Id: image.hmh_Id,
                            hmh_HinhAnhMaHoa: image.hmh_HinhAnhMaHoa,
                        })),
                    }));
                })
                .catch(error => console.error(`Error fetching images for book ID ${sId}:`, error));
        };

        const fetchPhieuTra = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/QuanLyPhieuTra/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhieuTra(data[0]);
                } else {
                    throw new Error('Failed to fetch phiếu trả details');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPhieuMuon();
        fetchPhieuTra();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={cx('wrapper')}>
            <div className="row m-5">
                {/* Thông tin mượn */}
                <div className="col-md-8">
                    <h2 className="text-center mb-4">Thông tin mượn</h2>
                    <div className={cx('book-list')}>
                        {phieuMuonDetails.map((detail, index) => (
                            <div className={cx('book-card')} key={index}>
                                {/* Hình ảnh */}
                                <img
                                    src={
                                        bookImages[detail.Id_Sach]?.[0]?.hmh_HinhAnhMaHoa
                                            ? `${PhotoPath}${bookImages[detail.Id_Sach][0].hmh_HinhAnhMaHoa}`
                                            : 'https://via.placeholder.com/70x100'
                                    }
                                    alt={detail.TenSach}
                                />

                                {/* Thông tin sách */}
                                <div className={cx('book-details')}>
                                    <h3>{detail.TenSach}</h3>
                                    <p>Số lượng: {detail.SoLuongSach}</p>
                                    <p>Ngày mượn: {new Date(detail.NgayMuon).toLocaleDateString('en-GB')}</p>
                                    <p>Hạn trả: {new Date(detail.HanTra).toLocaleDateString('en-GB')}</p>
                                </div>

                                {/* Nút mượn lại */}
                                <Link to={`/chitietsach/${detail.Id_Sach}`} className={cx('btn-return')}>
                                    Mượn lại
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thông tin trả */}
                <div className="col-md-4">
                    {phieuTra && (
                        <div className={cx('return-info')}>
                            <h2 className="text-center mb-4">Thông tin trả</h2>
                            <table className="table table-bordered fs-3">
                                <tbody>
                                    <tr>
                                        <th scope="row">Số phiếu trả</th>
                                        <td>{phieuTra.PtId}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Ngày trả</th>
                                        <td>{new Date(phieuTra.PtNgayTra).toLocaleDateString('en-GB')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Số lượng sách trả</th>
                                        <td>{phieuTra.CtptSoLuongSachTra}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Số ngày trễ hạn</th>
                                        <td className="text-danger fw-bold">
                                            {phieuTra.SoNgayTre <= 0 ? "Đúng hạn" : `${phieuTra.SoNgayTre} ngày (Trễ hạn)`}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChiTietPhieuTra;
