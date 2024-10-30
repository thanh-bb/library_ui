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


            // list delivery address
            fetch(`https://localhost:44315/api/DiaChiGiaoHang/${userId}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        listAddress: data,
                        // Nếu danh sách có ít nhất một địa chỉ, đặt địa chỉ đầu tiên làm mặc định
                        selectedAddress: data.length > 0 ? data[0] : null
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

    fetchBookPromiment() {
        fetch("https://localhost:44315/api/ThongKe/SachNoiBat")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    listsachnoibats: data
                });

                // Fetch images for each prominent book
                data.forEach(book => {
                    this.fetchBookImages(book.s_Id); // Lấy ảnh cho sách nổi bật
                });
            })
            .catch(error => {
                console.error('Error fetching prominent books:', error);
            });
    }

    fetchRankingData() {
        fetch("https://localhost:44315/api/ThongKe/TopReaders")  // Adjust the endpoint as needed
            .then(response => response.json())
            .then(data => {
                this.setState({ ranking: data });
            })
            .catch(error => {
                console.error('Error fetching ranking data:', error);
            });
    }

    componentDidMount() {
        this.refreshList();
        this.fetchRankingData();
    }

    // Function to set the selected category
    setSelectedCategory = (tl_Id) => {
        this.setState({ selectedCategory: tl_Id });
    };

    // input form 
    changes_HoTenNguoiNhan = (e) => {
        this.setState({ dcgh_TenNguoiNhan: e.target.value });
    }

    changes_DiaChiNguoiNhan = (e) => {
        this.setState({ dcgh_DiaChi: e.target.value });
    }

    changes_SoDienThoaiNguoiNhan = (e) => {
        this.setState({ dcgh_SoDienThoai: e.target.value });
    }


    // Handle change for delivery method
    handleDeliveryChange = (e) => {
        this.setState({
            deliveryMethod: e.target.value,
            paymentMethod: e.target.value === 'Giao sách tận nơi' ? 'COD' : '', // Chọn mặc định COD khi giao hàng tận nơi
        });
    };


    // Handle change for payment method
    handlePaymentChange = (e) => {
        this.setState({
            paymentMethod: e.target.value,
        });
    };

    handleSelectAddress = (address) => {
        this.setState({
            selectedAddress: address  // Cập nhật selectedAddress khi người dùng chọn

        });
        const addAddressModal = document.getElementById('exampleModal');
        const modalInstance = window.bootstrap.Modal.getInstance(addAddressModal);
        modalInstance.hide();
    };

    addClick = () => {
        this.setState({
            nd_Id: 0,
            dcgh_Id: 0,
            dcgh_TenNguoiNhan: "",
            dcgh_SoDienThoai: "",
            dcgh_DiaChi: ""
        });
    }

    editClick(dep) {
        this.setState({
            dcgh_Id: dep.dcgh_Id,
            dcgh_TenNguoiNhan: dep.dcgh_TenNguoiNhan,
            dcgh_SoDienThoai: dep.dcgh_SoDienThoai,
            dcgh_DiaChi: dep.dcgh_DiaChi
        });
    }


    createClick = () => {
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            fetch("https://localhost:44315/api/DiaChiGiaoHang", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ndId: userId,
                    dcghTenNguoiNhan: this.state.dcgh_TenNguoiNhan,
                    dcghSoDienThoai: this.state.dcgh_SoDienThoai,
                    dcghDiaChi: this.state.dcgh_DiaChi

                })
            })
                .then(res => res.json())
                .then((result) => {
                    alert("Thêm địa chỉ thành công"); this.refreshList();


                    // Đóng modal thêm địa chỉ
                    const addAddressModal = document.getElementById('exampleModal1');
                    const modalInstance = window.bootstrap.Modal.getInstance(addAddressModal);
                    modalInstance.hide();

                    // Mở lại modal chọn địa chỉ
                    const selectAddressModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
                    selectAddressModal.show();
                }, (error) => {
                    alert('Failed');
                })
        }
    }

    updateClick() {
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            fetch("https://localhost:44315/api/DiaChiGiaoHang", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dcghId: this.state.dcgh_Id,
                    ndId: userId,
                    dcghTenNguoiNhan: this.state.dcgh_TenNguoiNhan,
                    dcghSoDienThoai: this.state.dcgh_SoDienThoai,
                    dcghDiaChi: this.state.dcgh_DiaChi
                })
            })
                .then(res => res.json())
                .then((result) => {
                    alert("Cập nhật địa chỉ thành công");
                    this.refreshList();
                    // Đóng modal thêm địa chỉ
                    const addAddressModal = document.getElementById('exampleModal1');
                    const modalInstance = window.bootstrap.Modal.getInstance(addAddressModal);
                    modalInstance.hide();

                    // Mở lại modal chọn địa chỉ
                    const selectAddressModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
                    selectAddressModal.show();
                }, (error) => {
                    alert('Failed');
                })
        }
    }


    deleteClick(id) {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            fetch("https://localhost:44315/api/DiaChiGiaoHang/" + id, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    this.refreshList();
                    const selectAddressModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
                    selectAddressModal.show();
                    // Ensure toast element is available
                    setTimeout(() => {
                        const toastEl = document.getElementById('successToast');
                        if (toastEl) {
                            const toast = new window.bootstrap.Toast(toastEl);  // Initialize toast
                            toast.show();  // Show the toast
                        }
                    }, 0);  // Delay to ensure the element is available
                }, (error) => {
                    alert('Failed');
                });
        }
    }

    handleOrderSubmit = () => {
        if (this.state.deliveryMethod === "Giao sách tận nơi" && !this.state.selectedAddress) {
            alert("Vui lòng cung cấp địa chỉ giao sách.");
            return;
        }

        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            // Get current date
            const currentDate = new Date();

            // Calculate due date (2 weeks later)
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14); // Add 14 days

            const orderData = {
                ndId: userId,
                pmoNgayDat: currentDate.toISOString(), // Current date in ISO format
                pmoLoaiGiaoHang: this.state.deliveryMethod,
                pmoPhuongThucThanhToan: this.state.paymentMethod,
                dcghId: this.state.selectedAddress ? this.state.selectedAddress.dcgh_Id : null,
                // Set the status based on the delivery method
                pmoTrangThai: this.state.deliveryMethod === "Giao sách tận nơi" ? "Đang chuẩn bị giao sách từ thư viện" : "Chờ nhận sách",
                pmoHanTra: dueDate.toISOString(), // Due date in ISO format

                ChiTietPhieuMuonOnlines: selectedBooks.map(book => ({
                    SId: book.s_Id,
                    CtpmoSoLuongSachMuon: 1
                }))
            };


            fetch("https://localhost:44315/api/CTPMOnline", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
                .then(response => response.json()) // Chuyển đổi phản hồi sang JSON
                .then(result => {
                    console.log("Phản hồi từ backend:", result);  // Kiểm tra xem result có chứa pmo_Id không

                    if (result) {
                        // Lưu pmo_Id vào localStorage khi tạo phiếu mượn thành công
                        localStorage.setItem("pmo_Id", result);

                        // Thêm thời gian chờ trước khi chuyển hướng để đảm bảo pmo_Id được lưu trước
                        if (this.state.paymentMethod === "VNPAY") {
                            const customerName = this.state.selectedAddress.dcgh_TenNguoiNhan;
                            const amount = this.state.amount || 30000;
                            const orderDescription = "Thanh toán cho đơn hàng";

                            const paymentUrl = `https://localhost:44393/?customerName=${encodeURIComponent(customerName)}&amount=${encodeURIComponent(amount)}&description=${encodeURIComponent(orderDescription)}&orderId=${result.pmo_Id}`;

                            setTimeout(() => {
                                window.location.href = paymentUrl;
                            }, 500); // Chờ 0.5 giây để đảm bảo pmo_Id đã được lưu
                        } else {
                            alert("Đặt sách thành công!");
                            window.location.href = '/quanlyphieumuon';
                        }
                    } else {
                        console.error("Không nhận được pmo_Id từ backend.");
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

        const { deliveryMethod, paymentMethod } = this.state;

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
                                        <h2>Thông tin nhận sách</h2>
                                        {this.state.selectedAddress ? (
                                            <div className="row d-flex justify-content-start mt-5">
                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Họ tên<span className="text-danger">*</span></label>
                                                    <input
                                                        value={this.state.selectedAddress ? this.state.selectedAddress.dcgh_TenNguoiNhan : ""}
                                                        className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                                        disabled
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Số điện thoại<span className="text-danger">*</span></label>
                                                    <input
                                                        value={this.state.selectedAddress ? this.state.selectedAddress.dcgh_SoDienThoai : ""}
                                                        className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                                        disabled
                                                    />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Địa chỉ<span className="text-danger">*</span></label>
                                                    <textarea
                                                        value={this.state.selectedAddress ? this.state.selectedAddress.dcgh_DiaChi : ""}
                                                        className="form-control p-2  fs-3 bg-body-secondary border-0"
                                                        disabled
                                                    />
                                                </div>

                                            </div>

                                        ) : (
                                            <p>Không có địa chỉ nào được chọn.</p>
                                        )}
                                        <div className="col-4 float-end">

                                            <button type="button"
                                                className={cx('btn-continue')}
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal">
                                                Thay đổi
                                            </button>


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


                                            {/* Separate Modal for Adding New Address */}
                                            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-hidden="true">
                                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                                    <div className="modal-content w-75 position-absolute top-50 start-50 translate-middle">

                                                        <div className="modal-header">
                                                            <h5 className="modal-title fs-2">Thêm Địa Chỉ Mới</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>

                                                        <div className="modal-body">
                                                            <div className="input-group mb-3 input-group-lg">
                                                                <span className="input-group-text fw-bold">Họ tên người nhận</span>
                                                                <input type="text" className="form-control fs-4"
                                                                    value={dcgh_TenNguoiNhan}
                                                                    onChange={this.changes_HoTenNguoiNhan} />
                                                            </div>

                                                            <div className="input-group mb-3 input-group-lg">
                                                                <span className="input-group-text fw-bold">Số điện thoại</span>
                                                                <input type="text" className="form-control fs-4"
                                                                    value={dcgh_SoDienThoai}
                                                                    onChange={this.changes_SoDienThoaiNguoiNhan} />
                                                            </div>
                                                            <div className="input-group mb-3 input-group-lg">
                                                                <span className="input-group-text fw-bold">Địa chỉ</span>
                                                                <textarea
                                                                    type="text"
                                                                    className="form-control fs-4"
                                                                    style={{ height: "40px" }}
                                                                    value={dcgh_DiaChi}
                                                                    maxLength={2000} // Giới hạn độ dài tại đây
                                                                    onChange={this.changes_DiaChiNguoiNhan}
                                                                />
                                                            </div>


                                                            {dcgh_Id === 0 ?
                                                                <button type="button"
                                                                    className={cx('btn-edit')}
                                                                    onClick={() => this.createClick()}>
                                                                    Thêm
                                                                </button> : null}

                                                            {dcgh_Id !== 0 ?
                                                                <button type="button"
                                                                    className={cx('btn-edit')}
                                                                    onClick={() => this.updateClick()}>
                                                                    Cập nhật
                                                                </button> : null}
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

                                {/* Giao sách tận nơi */}
                                <div className="form-check" onClick={() => document.getElementById('flexRadioDefault2').click()}>
                                    <input
                                        value="Giao sách tận nơi"
                                        checked={deliveryMethod === "Giao sách tận nơi"}
                                        className="form-check-input mt-4"
                                        type="radio"
                                        name="deliveryMethod"
                                        id="flexRadioDefault2"
                                        onChange={this.handleDeliveryChange}
                                    />
                                    <p
                                        role="button"
                                        tabIndex="0"
                                        className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center fw-bold"
                                        htmlFor="flexRadioDefault2"
                                    >
                                        Giao sách tận nơi

                                    </p>
                                </div>

                                {/* Show additional radio options only when 'Giao sách tận nơi' is selected */}
                                {deliveryMethod === 'Giao sách tận nơi' && (
                                    <div>
                                        <div className="form-check mx-5" onClick={() => document.getElementById('flexRadioCOD').click()}>
                                            <input
                                                data-che="true"
                                                value="COD"
                                                checked={paymentMethod === "COD"}
                                                className="form-check-input mt-4"
                                                type="radio"
                                                name="paymentMethod"
                                                id="flexRadioCOD"
                                                onChange={this.handlePaymentChange}
                                            />

                                            <p
                                                role="button"
                                                tabIndex="0"
                                                className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center"
                                                htmlFor="flexRadioCOD"
                                            >
                                                Thanh toán COD
                                            </p>
                                        </div>

                                        <div className="form-check mx-5" onClick={() => document.getElementById('flexRadioVNPAY').click()}>
                                            <input
                                                value="VNPAY"
                                                checked={paymentMethod === "VNPAY"}
                                                className="form-check-input mt-4"
                                                type="radio"
                                                name="paymentMethod"
                                                id="flexRadioVNPAY"
                                                onChange={this.handlePaymentChange}
                                            />
                                            <p
                                                role="button"
                                                tabIndex="0"
                                                className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center"
                                                htmlFor="flexRadioVNPAY"
                                            >
                                                Thanh toán VNPAY
                                                <img
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                                    alt="VNPAY Logo"
                                                    style={{ height: '20px', verticalAlign: 'middle', marginLeft: '5px' }}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                )}
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