import React, { Component } from "react";

import classNames from 'classnames/bind';
import styles from './Signup.module.scss';
import { Link } from "react-router-dom";
import images from '~/assets/images';
import config from '~/config';

const cx = classNames.bind(styles);
const prices = {
    "6 tháng": 60000,
    "1 năm": 120000,
    "2 năm": 240000
};


export class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nddk_HoTen: "",
            nddk_CCCD: "",
            nddk_CCCD_MatTruoc: "",
            nddk_CCCD_MatSau: "",
            nddk_HinhThe: "",
            nddk_NgaySinh: "",
            nddk_GioiTinh: "Nam",
            nddk_Email: "",
            nddk_SoDienThoai: "",
            nddk_DiaChi: "",
            nddk_NgayDangKy: "",
            nddk_ThoiGianSuDung: "6 tháng",
            nddk_HinhThucTraPhi: "Trả phí trực tiếp bằng tiền mặt",
            nddk_TrangThaiThanhToan: "Chờ thanh toán",
            nddk_TrangThaiDuyet: "Chưa xét duyệt",
            currentStep: 1, // Step 1: Personal Information, Step 2: Payment Method
            buttonText: "Đăng ký",
            buttonColor: "btn-register", // Default color class
            errors: {}
        };

    }

    changes_HoTen = (e) => {
        this.setState({ nddk_HoTen: e.target.value });
    }

    changes_DiaChi = (e) => {
        this.setState({ nddk_DiaChi: e.target.value });
    }

    changes_NgaySinh = (e) => {
        this.setState({ nddk_NgaySinh: e.target.value });
    }

    changes_CCCD = (e) => {
        this.setState({ nddk_CCCD: e.target.value });
    }


    changes_GioiTinh = (e) => {
        this.setState({ nddk_GioiTinh: e.target.value });
    }


    changes_Email = (e) => {
        this.setState({ nddk_Email: e.target.value });
    }

    changes_SoDienThoai = (e) => {
        this.setState({ nddk_SoDienThoai: e.target.value });
    }

    changes_ThoiGianSuDung = (e) => {
        this.setState({ nddk_ThoiGianSuDung: e.target.value });
    }


    changes_HinhThucTraPhi = (e) => {
        const selectedPaymentMethod = e.target.value;
        let buttonText, buttonColor;

        if (selectedPaymentMethod === "Trả phí qua VNPAY") {
            buttonText = "Tiến hành thanh toán";
            buttonColor = "btn-payment"; // New class for blue color
        } else {
            buttonText = "Đăng ký";
            buttonColor = "btn-register"; // Default color class
        }

        this.setState({
            nddk_HinhThucTraPhi: e.target.value,
            buttonText,
            buttonColor
        });
    }

    createClick() {
        fetch("https://localhost:44315/api/NguoiDungDangKy", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nddkHoTen: this.state.nddk_HoTen,
                nddkCCCD: this.state.nddk_CCCD,
                nddkCCCDMatTruoc: this.state.nddk_CCCD_MatTruoc,
                nddkCCCDMatSau: this.state.nddk_CCCD_MatSau,
                nddkHinhThe: this.state.nddk_HinhThe,
                nddkNgaySinh: this.state.nddk_NgaySinh,
                nddkGioiTinh: this.state.nddk_GioiTinh,
                nddkEmail: this.state.nddk_Email,
                nddkSoDienThoai: this.state.nddk_SoDienThoai,
                nddkDiaChi: this.state.nddk_DiaChi,
                nddkNgayDangKy: new Date().toISOString(),
                nddkThoiGianSuDung: this.state.nddk_ThoiGianSuDung,
                nddkHinhThucTraPhi: this.state.nddk_HinhThucTraPhi,
                nddkTrangThaiThanhToan: "Chờ thanh toán",
                nddkTrangThaiDuyet: "Chưa xét duyệt",
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert("Đăng ký thành công!");

                if (result) {
                    // Lưu pmo_Id vào localStorage khi tạo phiếu mượn thành công
                    localStorage.setItem("nddk_Id", result);

                    // Kiểm tra nếu phương thức thanh toán là VNPAY, điều hướng tới URL VNPAY
                    if (this.state.nddk_HinhThucTraPhi === "Trả phí qua VNPAY") {
                        const customerName = this.state.nddk_HoTen;
                        const amount = prices[this.state.nddk_ThoiGianSuDung];  // Sử dụng giá từ gói hội viên
                        const orderDescription = "Thanh toán phí hội viên";

                        const paymentUrl = `https://localhost:44393/Home/Index1/?customerName=${encodeURIComponent(customerName)}&amount=${encodeURIComponent(amount)}&description=${encodeURIComponent(orderDescription)}&orderId=${result}`;

                        setTimeout(() => {
                            window.location.href = paymentUrl;
                        }, 500); // Thời gian chờ trước khi chuyển hướng
                    } else {
                        // Nếu không chọn VNPAY, quay lại trang chủ hoặc trang khác
                        window.location.href = '/';
                    }
                }
            }, (error) => {
                alert('Failed to register');
            });


    }

    validateFields = () => {
        const errors = {};
        if (!this.state.nddk_HoTen) errors.nddk_HoTen = "Trường này bắt buộc nhập";
        if (!this.state.nddk_CCCD) errors.nddk_CCCD = "Trường này bắt buộc nhập";
        if (!this.state.nddk_NgaySinh) errors.nddk_NgaySinh = "Bạn hãy chọn ngày sinh";
        if (!this.state.nddk_Email) errors.nddk_Email = "Trường này bắt buộc nhập";
        if (!this.state.nddk_SoDienThoai) errors.nddk_SoDienThoai = "Trường này bắt buộc nhập";
        if (!this.state.nddk_DiaChi) errors.nddk_DiaChi = "Trường này bắt buộc nhập";

        // Kiểm tra nếu chưa chọn ảnh 3x4
        if (!this.state.nddk_HinhThe) errors.nddk_HinhThe = "Bạn cần tải lên ảnh 3x4";
        // Kiểm tra nếu chưa chọn ảnh mặt trước CCCD
        if (!this.state.nddk_CCCD_MatTruoc) errors.nddk_CCCD_MatTruoc = "Bạn cần tải lên ảnh mặt trước CCCD";
        // Kiểm tra nếu chưa chọn ảnh mặt sau CCCD
        if (!this.state.nddk_CCCD_MatSau) errors.nddk_CCCD_MatSau = "Bạn cần tải lên ảnh mặt sau CCCD";

        this.setState({ errors });
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };


    nextStep = () => {
        if (this.validateFields()) {
            this.setState({ currentStep: this.state.currentStep + 1 });
        }
    };

    prevStep = () => {
        this.setState({ currentStep: this.state.currentStep - 1 });
    }

    calculateTotalPrice = () => {
        const { nddk_ThoiGianSuDung } = this.state;
        const price = prices[nddk_ThoiGianSuDung];
        return price ? `${price.toLocaleString('vi-VN')} đ` : '0 đ';
    };

    handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("https://localhost:44315/api/NguoiDungDangKy/SaveFile", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (data) {
                    this.setState({ [fieldName]: data });
                } else {
                    alert("Failed to upload the file.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    render() {
        const {
            nddk_HoTen,
            nddk_CCCD,
            nddk_CCCD_MatTruoc,
            nddk_CCCD_MatSau,
            nddk_HinhThe,
            nddk_NgaySinh,
            nddk_GioiTinh,
            nddk_Email,
            nddk_SoDienThoai,
            nddk_DiaChi,
            nddk_ThoiGianSuDung,
            currentStep,
            errors
        } = this.state;

        return (
            <div className={cx("wrapper")}>
                <Link to={config.routes.home} className={cx('logo-link position-absolute top-0 start-0 m-3')}>
                    <img src={images.logo} alt="Logo" />
                </Link>
                <div className={cx("container")}>
                    <form className={cx('form-login')} >
                        <div className="card p-5 ">
                            <div >
                                <h2 className={cx('card-header')}>Đăng ký tài khoản dành cho bạn đọc ngoài trường </h2>
                            </div>
                            <hr />

                            {currentStep === 1 && (
                                <div className="row d-flex justify-content-around">
                                    <div className="col-5 ">
                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Họ tên<span className="text-danger">*</span></label>
                                            {errors.nddk_HoTen && (
                                                <span className="text-danger fs-4 float-end">{errors.nddk_HoTen}</span>
                                            )}
                                            <input
                                                value={nddk_HoTen}
                                                onChange={this.changes_HoTen}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />

                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Ngày sinh<span className="text-danger">*</span></label>
                                            {errors.nddk_NgaySinh && (
                                                <span className="text-danger fs-4 float-end">{errors.nddk_NgaySinh}</span>
                                            )}
                                            <input
                                                type="date"
                                                value={nddk_NgaySinh}
                                                onChange={this.changes_NgaySinh}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />

                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Giới tính<span className="text-danger">*</span></label>
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_GioiTinh}
                                                value={nddk_GioiTinh}>
                                                <option value={"Nam"}>Nam</option>
                                                <option value={"Nữ"}>Nữ</option>
                                            </select>
                                        </div>


                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Email<span className="text-danger">*</span></label>
                                            {errors.nddk_Email && (
                                                <span className="text-danger fs-4 float-end">{errors.nddk_Email}</span>
                                            )}
                                            <input
                                                value={nddk_Email}
                                                onChange={this.changes_Email}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Số điện thoại<span className="text-danger">*</span></label>
                                            {errors.nddk_SoDienThoai && (
                                                <span className="text-danger fs-4 float-end">{errors.nddk_SoDienThoai}</span>
                                            )}
                                            <input
                                                value={nddk_SoDienThoai}
                                                onChange={this.changes_SoDienThoai}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="fw-medium">Địa chỉ<span className="text-danger">*</span></label>
                                            {errors.nddk_DiaChi && (
                                                <span className="text-danger fs-4 float-end">{errors.nddk_DiaChi}</span>
                                            )}
                                            <input
                                                value={nddk_DiaChi}
                                                onChange={this.changes_DiaChi}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6 ">
                                        <div className="form-group  mb-3">
                                            <label className="fw-medium">Số CCCD<span className="text-danger me-5">*</span>
                                            </label>
                                            {errors.nddk_CCCD && (
                                                <span className="text-danger fs-4 mx-5">{errors.nddk_CCCD}</span>
                                            )}
                                            <input
                                                value={nddk_CCCD}
                                                onChange={this.changes_CCCD}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0 w-75')}
                                            />
                                        </div>

                                        <div className="form-group w-75 mb-5">
                                            <label className="fw-medium">Thời gian sử dụng gói hội viên<span className="text-danger">*</span></label>
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_ThoiGianSuDung}
                                                value={nddk_ThoiGianSuDung}>
                                                <option value={"6 tháng"}>6 tháng (60.000đ)</option>
                                                <option value={"1 năm"}>1 năm (120.000đ)</option>
                                                <option value={"2 năm"}>2 năm (240.000đ)</option>

                                            </select>
                                        </div>

                                        <div className="row mt-3 text-center ">
                                            <div className="col">
                                                <p className="mb-0 fw-medium fs-4">Ảnh 3x4</p>
                                                <div className="bd-highlight rounded-2">
                                                    <label style={{ cursor: "pointer" }}>
                                                        <img
                                                            width="65px"
                                                            height="77px"
                                                            style={{ borderRadius: "10%" }}
                                                            alt=""
                                                            src={
                                                                nddk_HinhThe
                                                                    ? `https://localhost:44315/Photos/${nddk_HinhThe}`
                                                                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                            }
                                                        />
                                                        <input
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => this.handleFileChange(e, "nddk_HinhThe")}
                                                        />
                                                    </label>
                                                </div>
                                                {errors.nddk_HinhThe && (
                                                    <span className="text-danger fs-4 float-end">{errors.nddk_HinhThe}</span>
                                                )}
                                            </div>

                                            <div className="col">
                                                <p className="mb-0 fw-medium fs-4">Mặt trước CCCD</p>
                                                <div className="bd-highlight rounded-2">
                                                    <label style={{ cursor: "pointer" }}>
                                                        <img

                                                            width="143px"
                                                            height="77px"
                                                            style={{ borderRadius: "10%" }}
                                                            alt=""
                                                            src={
                                                                nddk_CCCD_MatTruoc
                                                                    ? `https://localhost:44315/Photos/${nddk_CCCD_MatTruoc}`
                                                                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                            } />
                                                        <input
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => this.handleFileChange(e, "nddk_CCCD_MatTruoc")}

                                                        />
                                                    </label>
                                                </div>
                                                {errors.nddk_CCCD_MatTruoc && (
                                                    <span className="text-danger fs-4 float-end">{errors.nddk_CCCD_MatTruoc}</span>
                                                )}
                                            </div>

                                            <div className="col">
                                                <p className="mb-0 fw-medium fs-4">Mặt sau CCCD</p>
                                                <div className="bd-highlight rounded-2">
                                                    <label style={{ cursor: "pointer" }}>

                                                        <img
                                                            width="143px"
                                                            height="77px"
                                                            padding="1000px"
                                                            style={{ borderRadius: "10%" }}
                                                            alt=""
                                                            src={
                                                                nddk_CCCD_MatSau
                                                                    ? `https://localhost:44315/Photos/${nddk_CCCD_MatSau}`
                                                                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                            }
                                                        />
                                                        <input
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => this.handleFileChange(e, "nddk_CCCD_MatSau")}
                                                        />
                                                    </label>
                                                </div>
                                                {errors.nddk_CCCD_MatSau && (
                                                    <span className="text-danger fs-4 float-end">{errors.nddk_CCCD_MatSau}</span>
                                                )}
                                            </div>

                                        </div>


                                        <div className="row d-flex justify-content-end mt-5">
                                            <div className="col-4 mt-5">
                                                <Link to="/" type="submit" className={cx('btn-return')}>
                                                    <p className="pt-2">Quay lại</p>
                                                </Link>
                                            </div>
                                            <div className="col-4 mt-5">
                                                <button type="button"
                                                    className={cx('btn-continue')}
                                                    onClick={this.nextStep}>
                                                    Tiếp tục
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}


                            {currentStep === 2 && (
                                <div>
                                    {/* Your payment method section */}
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-6">
                                                <label className="fw-medium mb-3">Phương thức thanh toán</label>
                                                <div className="form-check" onClick={() => document.getElementById('flexRadioDefault1').click()}>
                                                    <input
                                                        value={"Trả phí trực tiếp bằng tiền mặt"}
                                                        defaultChecked
                                                        className="form-check-input mt-4"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        onChange={this.changes_HinhThucTraPhi}
                                                    />
                                                    <p role="button" tabIndex="0" className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center" htmlFor="flexRadioDefault1">
                                                        Trả phí trực tiếp bằng tiền mặt
                                                    </p>
                                                </div>

                                                <div className="form-check" onClick={() => document.getElementById('flexRadioDefault2').click()}>
                                                    <input
                                                        value={"Trả phí qua VNPAY"}
                                                        className="form-check-input mt-4"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                        onChange={this.changes_HinhThucTraPhi}
                                                    />
                                                    <p role="button" tabIndex="0" className="form-check-label border border-dark-subtle p-3 rounded-4 w-75 text-center" htmlFor="flexRadioDefault2">
                                                        Thanh toán online qua VNPAY
                                                        <img
                                                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                                            alt="VNPAY Logo"
                                                            style={{ height: '20px', verticalAlign: 'middle', marginLeft: '5px' }}
                                                        />
                                                    </p>
                                                </div>

                                                <p className="fw-bold fs-2 mt-5">Tổng số tiền cần thanh toán:<span className="text-danger"> {this.calculateTotalPrice()}</span></p>
                                            </div>
                                            <div className="col-6">
                                                <p className="fw-bold mb-0" >Lưu ý:</p>
                                                <p className="fs-4"> Khi chọn <span className="fst-italic fw-bold">Trả phí trực tiếp bằng tiền mặt</span> bạn cần đến thư viện trả phí trực tiếp để hoàn thành thủ tục đăng ký</p>
                                                <div className="row d-flex justify-content-center align-items-center ">
                                                    <div className="col text-center mt-5">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                <button type="button" className={cx('btn-return')} onClick={this.prevStep}>
                                                                    <p className="pt-2 ">Quay lại</p>
                                                                </button>
                                                            </div>
                                                            <div className="col-8">
                                                                <button
                                                                    type="button"
                                                                    className={cx(this.state.buttonColor)}
                                                                    onClick={() => this.createClick()}
                                                                >
                                                                    {this.state.buttonText}
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </div>

                                </div>
                            )}


                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
