import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChiTietSach.module.scss';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);
const PhotoPath = "https://localhost:44315/Photos/";

function ChiTietSach() {
    let { id } = useParams(); // Lấy id sách từ URL
    let jwttoken = sessionStorage.getItem('jwttoken');

    const [userActive, setUserActive] = useState(false);
    const [numberOfBorrowReceipts_Off, setNumberOfBorrowReceipts_Off] = useState(0);
    const [numberOfBorrowReceipts_Onl, setNumberOfBorrowReceipts_Onl] = useState(0);

    const [maxBorrowingsPerMonth, setMaxBorrowingsPerMonth] = useState(5);

    const [sach, setSach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tacgias, setTacgias] = useState([]);
    const [theloais, setTheLoais] = useState([]);
    const [nxbs, setNxbs] = useState([]);
    const [kes, setKes] = useState([]);
    const [os, setOs] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [hmhList, setHmhList] = useState([]);

    const [isBookAvailable, setIsBookAvailable] = useState(false);
    const [isBookBorrowed, setIsBookBorrowed] = useState(false);

    const decodedToken = jwtDecode(jwttoken);
    const userId = decodedToken.nameid;

    const [selectedImage, setSelectedImage] = useState(hmhList.length > 0 ? hmhList[0].hmh_HinhAnhMaHoa : null);

    // Fetch dữ liệu sách và người dùng
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kiểm tra hoặc tạo giỏ hàng
                const checkOrCreateCartResponse = await fetch(`https://localhost:44315/api/Cart/CheckOrCreateUserCart?userId=${userId}`);
                const cartId = await checkOrCreateCartResponse.json();
                setCartId(cartId);  // Lưu lại cartId

                // Lấy dữ liệu sách
                const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
                const bookData = await response.json();
                setSach(bookData[0]);

                // Lấy danh sách hình minh họa
                const hmhResponse = await fetch(`https://localhost:44315/api/HinhMinhHoa/${id}`);
                const hmhData = await hmhResponse.json();
                setHmhList(hmhData); // Save list of images

                // Hiển thị mặc định hình đầu tiên
                if (hmhData.length > 0) {
                    setSelectedImage(hmhData[0].hmh_HinhAnhMaHoa);
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, userId]);

    // Kiểm tra sách có trong giỏ hàng không
    useEffect(() => {
        const checkBookAvailability = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/Cart/CheckBookAvailability?sId=${id}&userId=${userId}`);
                const isAvailable = await response.json();
                setIsBookAvailable(isAvailable);
            } catch (error) {
                console.error('Error checking book availability:', error);
            }
        };

        checkBookAvailability();
    }, [id, userId]);

    const handleAddToCart = async () => {
        try {
            const response = await fetch('https://localhost:44315/api/Cart/AddToCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ghId: cartId,  // Sử dụng cartId vừa lấy
                    sId: id
                })
            });

            if (response.ok) {
                alert('Sách đã được thêm vào giỏ hàng.');
                window.location.reload();
            } else {
                throw new Error('Failed to add book to cart');
            }
        } catch (error) {
            alert('Lỗi khi thêm sách vào giỏ hàng.');
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Existing code to fetch book details
                const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
                const bookData = await response.json();
                setSach(bookData[0]);

                // Check if the book is already borrowed (offline)
                const checkBorrowStatus = await fetch(`https://localhost:44315/api/QuanLyPhieuMuon/CheckMuon/${userId}/${id}`);
                if (checkBorrowStatus.ok) {
                    const result = await checkBorrowStatus.json();
                    if (result === 'Chờ xét duyệt' || result === 'Đang mượn' || result === 'Đã trả') {
                        setIsBookBorrowed(true);
                    }
                }

                // Check if the book is borrowed online with status "Chờ xử lý"
                const checkOnlineBorrowStatus = await fetch(`https://localhost:44315/api/PhieuMuonOnline/CheckMuonOnl/${userId}/${id}`);
                if (checkOnlineBorrowStatus.ok) {
                    const onlineResult = await checkOnlineBorrowStatus.json();
                    if (onlineResult === 'Chờ xử lý') {
                        setIsBookBorrowed(true);
                    }
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, userId]);



    useEffect(() => {
        const decodedToken = jwtDecode(jwttoken);
        const userId = decodedToken.nameid;

        const fetchUser = async () => {

            try {
                // Gửi yêu cầu để lấy trạng thái của NguoiDung từ nd_Id lấy từ token
                const response = await fetch(`https://localhost:44315/api/NguoiDung/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUserActive(userData[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

        };

        const fetchNumberOfBorrowReceipts_Off = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/PhieuMuon/Count/${userId}`);
                if (response.ok) {
                    const count = await response.json();
                    setNumberOfBorrowReceipts_Off(count);
                } else {
                    throw new Error('Failed to fetch number of borrow receipts');
                }
            } catch (error) {
                console.error('Error fetching number of borrow receipts:', error);
            }
        };


        const fetchNumberOfBorrowReceipts_Onl = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/PhieuMuonOnline/Count/${userId}`);
                if (response.ok) {
                    const count = await response.json();
                    setNumberOfBorrowReceipts_Onl(count);
                } else {
                    throw new Error('Failed to fetch number of borrow receipts');
                }
            } catch (error) {
                console.error('Error fetching number of borrow receipts:', error);
            }
        };

        const fetchSach = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSach(data[0]); // Dữ liệu trả về là một mảng, chọn phần tử đầu tiên
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchTacGia = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/TacGium");
                if (response.ok) {
                    const data = await response.json();
                    setTacgias(data);
                } else {
                    throw new Error('Failed to fetch authors');
                }
            } catch (error) {
                console.error('Error fetching authors:', error);
            }
        };

        const fetchTheLoai = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/TheLoai");
                if (response.ok) {
                    const data = await response.json();
                    setTheLoais(data);
                } else {
                    throw new Error('Failed to fetch the loai');
                }
            } catch (error) {
                console.error('Error fetching theloais:', error);
            }
        };

        const fetchNXB = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/NhaXuatBan");
                if (response.ok) {
                    const data = await response.json();
                    setNxbs(data);
                } else {
                    throw new Error('Failed to fetch nxb');
                }
            } catch (error) {
                console.error('Error fetching nxbs:', error);
            }
        };

        const fetchKe = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/KeSach");
                if (response.ok) {
                    const data = await response.json();
                    setKes(data);
                } else {
                    throw new Error('Failed to fetch ke');
                }
            } catch (error) {
                console.error('Error fetching kes:', error);
            }
        };
        const fetchO = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/OSach");
                if (response.ok) {
                    const data = await response.json();
                    setOs(data);
                } else {
                    throw new Error('Failed to fetch o');
                }
            } catch (error) {
                console.error('Error fetching os:', error);
            }
        };

        fetchUser();
        fetchSach();
        fetchTheLoai();
        fetchTacGia();
        fetchNXB();
        fetchKe();
        fetchO();
        fetchNumberOfBorrowReceipts_Off();
        fetchNumberOfBorrowReceipts_Onl();
        setMaxBorrowingsPerMonth(5);
    }, [jwttoken, id]);

    // Fetch dữ liệu sách và người dùng
    // useEffect(() => {
    //     const decodedToken = jwtDecode(jwttoken);
    //     const userId = decodedToken.nameid;

    //     const fetchData = async () => {
    //         try {
    //             // Kiểm tra hoặc tạo giỏ hàng
    //             const checkOrCreateCartResponse = await fetch(`https://localhost:44315/api/Cart/CheckOrCreateUserCart?userId=${userId}`);
    //             const cartId = await checkOrCreateCartResponse.json();
    //             setCartId(cartId);  // Lưu lại cartId

    //             // Lấy dữ liệu sách
    //             const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
    //             const bookData = await response.json();
    //             setSach(bookData[0]);              

    //             setLoading(false);
    //         } catch (error) {
    //             setError(error.message);
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [jwttoken, id]);



    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const getAuthorNameById = (tg_Id) => {
        const author = tacgias.find(author => author.tg_Id === tg_Id);
        return author ? author.tg_TenTacGia : "Unknown Author";
    };
    const getNXBNameById = (nxb_Id) => {
        const nxb = nxbs.find(nxb => nxb.nxb_Id === nxb_Id);
        return nxb ? nxb.nxb_TenNhaXuatBan : "Unknown NXB";
    };
    const getKeById = (ks_Id) => {
        const k = kes.find(k => k.ks_Id === ks_Id);
        return k ? k.ks_TenKe : "Unknown Ke";
    };
    const getOById = (os_Id) => {
        const o = os.find(o => o.os_Id === os_Id);
        return o ? o.os_TenO : "Unknown O";
    };

    const getTheLoaiById = (tl_Id) => {
        const tl = theloais.find(tl => tl.tl_Id === tl_Id);
        return tl ? tl.tl_TenTheLoai : "Không xác định";
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx("container")}>
                <div className="row justify-content-center mt-5 ">
                    <div className={cx("row d-flex justify-content-center")}>
                        <div className="col-10">
                            <div className={cx("row d-flex justify-content-around", "board-item",)}>
                                <div className='col-1'>
                                    {hmhList && hmhList.length > 0 && hmhList.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${PhotoPath}${image.hmh_HinhAnhMaHoa}`}
                                            alt={`${index + 1}`}
                                            className={cx("list-book-cover")}
                                            width="20px"
                                            height="30px"
                                            onClick={() => setSelectedImage(image.hmh_HinhAnhMaHoa)}  // Khi click sẽ chọn hình ảnh này
                                        />
                                    ))}
                                </div>


                                <div className='col-5'>
                                    {selectedImage && (
                                        <img
                                            src={`${PhotoPath}${selectedImage}`}
                                            alt="Selected"
                                            className={cx("book-cover")}
                                            width="150px"
                                            height="200px"
                                        />
                                    )}

                                </div>



                                <div className='col-5'>
                                    <div className='text-start '>
                                        {sach && (
                                            <>
                                                <h1>
                                                    <span className={cx('title-book')}> {sach?.s_TenSach}
                                                        {!sach?.s_TrangThaiMuon && (
                                                            <div className={cx("btn rounded-pill bg-danger-subtle text-danger fw-bold mx-2")}>
                                                                <p className='mb-0 fw-bold fs-4'>Đã ẩn</p>
                                                            </div>
                                                        )}
                                                    </span>

                                                </h1>

                                                <h2 className={cx('name-author')}>
                                                    <span className=''> {getAuthorNameById(sach?.tg_Id)}</span>
                                                </h2 >


                                                <div className={cx("btn  rounded-pill bg-success-subtle text-success fw-bold")}>
                                                    <p className="mb-0 fs-4">{getTheLoaiById(sach?.tl_Id)}</p>
                                                </div>

                                                <br />

                                                <div className={cx("btn rounded-pill bg-primary-subtle text-primary fw-bold mt-5 me-3")}>
                                                    <p className='mb-0 fw-bold fs-4'>
                                                        {sach?.s_SoLuong > 1
                                                            ? "Trong kho sẵn sàng"
                                                            : "Chưa sẵn sàng"}
                                                    </p>

                                                </div>

                                                <span className={cx("btn rounded-pill bg-primary-subtle text-primary fw-bold mt-5")}>
                                                    <p className='mb-0 fw-bold fs-4'>{sach?.s_ChiDoc === true ? "Chỉ được đọc tại thư viện" : sach?.s_ChiDoc === false ? "Được mượn về nhà" : "Trạng thái không xác định"}</p>
                                                </span>

                                                <div className={cx("btn rounded-pill bg-primary-subtle text-primary-emphasis fw-bold mt-4 mb-3")}>
                                                    <p className='mb-0 fw-bold fs-4'>Số lượng thực tế sách có thể mượn: {sach?.s_SoLuong - 1}</p>
                                                </div>

                                                <br />

                                                <div className="d-flex align-items-center mt-5">
                                                    <p className="text-danger fw-bold mb-0 me-2">Lưu ý:</p>
                                                    <span className={cx("btn rounded-pill bg-danger-subtle text-danger fw-bold")}>
                                                        {!userActive.nd_active && (
                                                            <p className="mb-0 fw-bold fs-3">
                                                                Tài khoản của bạn đã bị khóa do vi phạm quy định của thư viện nên tạm thời bạn không thể mượn sách
                                                            </p>
                                                        )}
                                                        {userActive.nd_active && (
                                                            (numberOfBorrowReceipts_Off + numberOfBorrowReceipts_Onl) >= maxBorrowingsPerMonth ? (
                                                                <p className="mb-0 fw-bold fs-3 pe-auto">Bạn đã mượn đủ số lần cho phép của tháng này</p>
                                                            ) : (
                                                                <p className="mb-0 fw-bold fs-3">Bạn còn {maxBorrowingsPerMonth - (numberOfBorrowReceipts_Off + numberOfBorrowReceipts_Onl)} lần mượn sách trong tháng này</p>
                                                            )
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Hiển thị nút "Tiến hành mượn sách" nếu sách có sẵn để mượn */}
                                                {userActive.nd_active && sach?.s_TrangThaiMuon && (
                                                    <>
                                                        <div className='d-flex justify-content-end me-4'>
                                                            <span className={cx("btn rounded-pill bg-danger-subtle text-danger fw-bold mt-3 ")}>
                                                                {(numberOfBorrowReceipts_Off + numberOfBorrowReceipts_Onl) >= maxBorrowingsPerMonth && (
                                                                    <p className="mb-0 fw-bold fs-3 pe-auto">Bạn không thể mượn sách về nhà</p>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {(sach?.s_ChiDoc === false && sach?.s_SoLuong > 1) ? (
                                                            <div className="row d-flex justify-content-between mt-5">
                                                                {/* Nút "Thêm vào giỏ sách" */}
                                                                {!isBookAvailable ? (
                                                                    <button
                                                                        type="button"
                                                                        className={cx('col', 'btn-existed', 'me-5')}
                                                                        disabled
                                                                    >
                                                                        Sách đã có trong giỏ sách
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className={cx('col', 'btn-continue', 'me-5')}
                                                                        onClick={handleAddToCart}
                                                                    >
                                                                        Thêm vào giỏ sách
                                                                    </button>
                                                                )
                                                                }

                                                                {/* Nút "Mượn sách ngay" chỉ hiển thị khi chưa mượn sách */}
                                                                {!isBookBorrowed && (numberOfBorrowReceipts_Off + numberOfBorrowReceipts_Onl) < maxBorrowingsPerMonth ? (
                                                                    <Link to={`/chitietsach/formphieumuon/${sach?.s_Id}`}
                                                                        className={cx('col', 'btn-return')}
                                                                    >
                                                                        Mượn sách ngay
                                                                    </Link>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className={cx('col', 'btn-disable')}
                                                                        disabled
                                                                    >
                                                                        Bạn đã mượn sách này
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className='row d-flex justify-content-between mt-5'>
                                                                <button
                                                                    type="button"
                                                                    className={cx('col', 'btn-disable')}
                                                                    disabled
                                                                >
                                                                    Bạn không thể mượn sách về nhà
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}







                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx("row d-flex justify-content-center")}>
                        <div className="col-10">
                            <div className={cx("row d-flex justify-content-center", "board-item")}>
                                {sach && (
                                    <>
                                        <h2 className='fw-bold mb-5'>Thông tin chi tiết</h2>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th className='fw-medium w-50'>Tên sách</th>
                                                    <td>{sach?.s_TenSach}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Tác giả</th>
                                                    <td>{getAuthorNameById(sach?.tg_Id)}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Thể loại</th>
                                                    <td>{getNXBNameById(sach?.nxb_Id)}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Ngày xuất bản</th>
                                                    <td>{new Date(sach?.s_NamXuatBan).toLocaleDateString('en-GB')}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Nhà xuất bản</th>
                                                    <td>{getNXBNameById(sach?.nxb_Id)}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Số lượng sách thực có tại thư viện</th>
                                                    <td>{sach?.s_SoLuong}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Số lượng sách có thể sử dụng</th>
                                                    <td>{sach?.s_SoLuong - 1}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Vị trí sách tại thư viện</th>
                                                    <td>{getKeById(sach?.ks_Id)} - {getOById(sach?.os_Id)}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Trạng thái mượn</th>
                                                    <td>{sach?.s_TrangThaiMuon === true ? "Trong kho sẵn sàng" : sach?.s_TrangThaiMuon === false ? "Chưa sẵn sàng" : "Trạng thái không xác định"}</td>
                                                </tr>
                                                <tr>
                                                    <th className='fw-medium w-50'>Cho phép mượn về</th>
                                                    <td>{sach?.s_ChiDoc === true ? "Chỉ được đọc tại thư viện" : sach?.s_ChiDoc === false ? "Được mượn về nhà" : "Trạng thái không xác định"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={cx("row d-flex justify-content-center")}>
                        <div className="col-10">
                            <div className={cx("row d-flex justify-content-center", "board-item",)}>
                                {sach && (
                                    <>
                                        <h2 className='fw-bold mb-2'>Mô tả</h2>
                                        <h3 className='fw-normal mb-3'>Tóm tắt nội dung</h3>
                                        <p>{sach?.s_MoTa}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default ChiTietSach;
