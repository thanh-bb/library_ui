import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './CTPMOnline.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
const cx = classNames.bind(styles);

const token = sessionStorage.getItem('jwttoken');
const selectedBooks = JSON.parse(sessionStorage.getItem('selectedBooks'));

export class CTPMOnline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sachs: [],
            danhmucs: [],
            tacgias: [],
            theloais: [],
            loaisachs: [],
            hinhminhhoas: [],
            sachsWithoutFilter: [],
            nhaxuatbans: [],
            kesach: [],
            osach: [],
            selectedImages: [],
            listsachnoibats: [],
            sachnoibats: [],
            ranking: [],
            listcarts: [],
            listAddress: [],
            selectedAddress: null,
            modalTitle: "",
            s_TenSach: "",
            s_Id: 0,
            dm_Id: 0,
            s_IdFilter: "",
            s_TenSachFilter: "",
            s_SoLuong: 0,
            s_MoTa: "",
            s_TrongLuong: "",
            s_NamXuatBan: 0,
            s_TrangThaiMuon: true,
            s_ChiDoc: true,
            tg_Id: 0,
            nxb_Id: 0,
            tl_Id: 0,
            ls_Id: 0,
            ks_Id: 0,
            os_Id: 0,
            s_HinhAnh: "",
            PhotoFileName: "hello.png",
            PhotoPath: "https://localhost:44315/Photos/",
            selectedCategories: null,
            bookImages: {},
            nd_Id: 0,
            nd_HoTen: "",
            nd_CCCD: "",
            nd_CCCD_MatTruoc: "",
            nd_CCCD_MatSau: "",
            nd_HinhThe: "",
            nd_NgaySinh: "",
            nd_GioiTinh: "Nam",
            nd_Email: "",
            nd_SoDienThoai: "",
            nd_DiaChi: "",
            deliveryMethod: 'Nhận trực tiếp tại thư viện', // Default method
            paymentMethod: '', // Separate state for payment method,
            dcgh_Id: 0,
            dcgh_TenNguoiNhan: "",
            dcgh_SoDienThoai: "",
            dcgh_DiaChi: ""
        };
    }


    refreshList() {


        // Kiểm tra nếu token tồn tại
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            fetch(`https://localhost:44315/api/Cart/GetListCart/${userId}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        listcarts: data,
                    });
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });

        }

        // Fetch list of books
        fetch("https://localhost:44315/api/Sach")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    sachs: data,
                    sachsWithoutFilter: data
                });

                // Fetch images for each book after the book list is loaded
                data.forEach(book => {
                    this.fetchBookImages(book.s_Id); // Call fetchBookImages with s_Id                  
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });


        fetch("https://localhost:44315/api/TacGium")
            .then(response => response.json())
            .then(data => {
                this.setState({ tacgias: data });
            });

        fetch("https://localhost:44315/api/TheLoai")
            .then(response => response.json())
            .then(data => {
                this.setState({ theloais: data });
            });

        fetch("https://localhost:44315/api/ThongKe/SachNoiBat")
            .then(response => response.json())
            .then(data => {
                this.setState({ listsachnoibats: data });
            });


    }

    fetchBookImages = (sId) => {
        fetch(`https://localhost:44315/api/HinhMinhHoa/${sId}`)
            .then(response => response.json())
            .then(images => {
                this.setState(prevState => ({
                    bookImages: {
                        ...prevState.bookImages,
                        [sId]: images.map(image => ({
                            hmh_Id: image.hmh_Id,
                            hmh_HinhAnhMaHoa: image.hmh_HinhAnhMaHoa
                        }))
                    }
                }));
            })
            .catch(error => {
                console.error('Error fetching book images:', error);
            });
    };

    componentDidMount() {
        this.refreshList();
    }


    handleOrderSubmit = () => {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            // Set the current date and due date for reservation
            const currentDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14); // Book is reserved for 14 days

            // Build order data with LoaiMuon as "Đặt online"
            const orderData = {
                ndId: userId,
                pmNgayMuon: currentDate.toISOString(), // Current date in ISO format
                pmHanTra: dueDate.toISOString(),
                ttmId: 3,  // Reservation duration
                pmLoaiMuon: "Đặt online", // Type of reservation
                pmTrangThaiXetDuyet: "", // Waiting for approval
                chiTietPhieuMuons: selectedBooks.map(book => ({
                    sId: book.s_Id,
                    ctpmSoLuongSachMuon: 1 // Assuming 1 copy per book
                }))
            };

            // Send the request to create a reservation order
            fetch("https://localhost:44315/api/PhieuMuon", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
                .then(response => response.json())
                .then(result => {
                    if (result) {
                        alert("Đặt sách thành công! Vui lòng đến thư viện để nhận sách.");
                        window.location.href = '/quanlyphieumuononline';
                    } else {
                        console.error("Failed to receive response from backend.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Đặt sách thất bại, vui lòng thử lại.");
                });
        }
    }





    render() {
        const {
            PhotoPath,
            dcgh_Id,
            dcgh_TenNguoiNhan,
            dcgh_SoDienThoai,
            dcgh_DiaChi

        } = this.state;

        const { deliveryMethod } = this.state;

        return (
            <div className={cx('wrapper')}>
                <div className={cx("container")}>
                    <div className="row justify-content-center mt-5 ">
                        {/* notification & news */}
                        <h1 className="text-center"> Phiếu Mượn Online</h1>
                        <hr></hr>

                        <div className={cx("row d-flex justify-content-center mt-5 mb-5")} >
                            <div className="col-4 mt-5">
                                <p className="fs-4">Sách bạn đã chọn :</p>

                                {selectedBooks.map(dep => (
                                    <div className={cx("")} key={dep.s_Id}>
                                        <div className="row ">
                                            <div className="row d-flex justify-content-start  ">
                                                <div className="col-2">
                                                    {this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa ? (
                                                        <img
                                                            src={`${PhotoPath}${this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa}`}
                                                            alt={dep.s_TenSach}
                                                            className={cx("book-cover")}
                                                        />
                                                    ) : (
                                                        <img
                                                            alt="Không có hình ảnh"
                                                            src="https://via.placeholder.com/150"  // Đường dẫn ảnh mặc định nếu không có hình
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-8  mx-5">
                                                    <h4 className="mt-4">{dep.s_TenSach}</h4>
                                                    <h4>x1</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="bg-dark mt-3" style={{ height: 2 }} />

                                    </div>
                                ))}
                            </div>

                            <div className="col-6">
                                <div className="row d-flex justify-content-center p-5 ">
                                    <div className="col border border border-dark-subtle p-5 pt-3">
                                        <h2>Thông tin địa chỉ nhận sách</h2>

                                        <p>Thư viện Trường Đại học Cần Thơ,  Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
                                        <div className="col-4 float-end">

                                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                                                <div className="modal-dialog modal-lg modal-dialog-centered">

                                                    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
                                                        style={{
                                                            zIndex: 1060,  // High z-index to bring it above other elements
                                                            position: 'fixed',
                                                        }}>
                                                        <div id="successToast" className="toast align-items-center bg-info bg-gradient border-0"
                                                            role="alert" aria-live="assertive" aria-atomic="true"
                                                            style={{
                                                                fontSize: '1.5rem',   // Larger text for visibility
                                                                fontWeight: 'bold',   // Bold text
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',  // Drop shadow to elevate it
                                                                borderRadius: '10px',  // Rounded 

                                                            }}>
                                                            <div className="d-flex">
                                                                <div className="toast-body text-white p-lg-5 fs-3">
                                                                    Xóa thành công!
                                                                </div>
                                                                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modal-content w-75 position-absolute top-50 start-50 translate-middle">

                                                        <div className="modal-header">
                                                            <h5 className="modal-title fs-2">Địa chỉ của bạn</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>

                                                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}> {/* Thêm style tại đây */}
                                                            <div className="border border-dark-subtle rounded-2 p-3 text-center mb-3">
                                                                <button type="button"
                                                                    className={cx('btn-grad')}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal1"
                                                                    onClick={this.addClick}>
                                                                    +
                                                                </button>
                                                            </div>

                                                            {this.state.listAddress.length === 0 ? (
                                                                <p>Không có địa chỉ nào.</p>
                                                            ) : (
                                                                this.state.listAddress.map((dep) => (
                                                                    <div
                                                                        className="border border-dark-subtle rounded-2 p-3 mb-3"
                                                                        key={dep.dcgh_Id}
                                                                        onClick={() => this.handleSelectAddress(dep)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >

                                                                        <p className="fs-4 fw-bold mb-0">{dep.dcgh_TenNguoiNhan}</p>
                                                                        <p className="fs-4 mb-0">{dep.dcgh_SoDienThoai}</p>
                                                                        <p className="fs-4">{dep.dcgh_DiaChi}</p>

                                                                        <button
                                                                            type="button"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#exampleModal1"
                                                                            className={cx('btn-update')}
                                                                            onClick={() => this.editClick(dep)}  // Hàm xử lý khi nhấn "Cập nhật"
                                                                            data-bs-dismiss="modal"
                                                                        >
                                                                            Cập nhật
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className={cx('btn-delete', 'mx-2')}
                                                                            onClick={() => this.deleteClick(dep.dcgh_Id)}
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={cx("row d-flex justify-content-center mt-5 method-payment")}>
                            <div className="col-5">
                                <label className="fw-medium mb-3">Phương thức nhận sách</label>

                                {/* Nhận trực tiếp tại thư viện */}
                                <div className="form-check" onClick={() => document.getElementById('flexRadioDefault1').click()}>
                                    <input
                                        value="Nhận trực tiếp tại thư viện"
                                        checked={deliveryMethod === "Nhận trực tiếp tại thư viện"}
                                        className="form-check-input mt-4"
                                        type="radio"
                                        name="deliveryMethod"
                                        id="flexRadioDefault1"
                                        onChange={this.handleDeliveryChange}
                                    />
                                    <p
                                        role="button"
                                        tabIndex="0"
                                        className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center fw-bold"
                                        htmlFor="flexRadioDefault1"
                                    >
                                        Nhận trực tiếp tại thư viện
                                    </p>
                                </div>

                            </div>

                            <div className="col-6">
                                <p className="fw-bold mb-0">Lưu ý:</p>
                                <p className="fs-4">
                                    Khi chọn phương thức <span className="fst-italic fw-bold">Nhận trực tiếp tại thư viện</span> bạn cần đến thư viện
                                    trường để nhận sách. Sách sẽ được giữ trong vòng 48h kể từ ngày bạn tạo phiếu mượn online thành công.
                                </p>
                            </div>
                        </div>

                        <div className={cx("row d-flex justify-content-end mt-2 mb-5 w-50 me-5 m-auto")}>
                            <div className="col-4 ">
                                <Link to="/giosach" type="submit" className={cx('btn-return')}>
                                    <p className="pt-2">Quay lại</p>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button type="button" className={cx('btn-continue')} onClick={this.handleOrderSubmit}>
                                    <p className="pt-2">Xác nhận đặt sách</p>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}