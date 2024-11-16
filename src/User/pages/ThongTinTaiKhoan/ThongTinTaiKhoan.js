import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './ThongTinTaiKhoan.module.scss';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';


const cx = classNames.bind(styles);

export class ThongTinTaiKhoan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taikhoans: [],
        }
    }


    refreshList() {
        const token = sessionStorage.getItem('jwttoken');

        // Kiểm tra nếu token tồn tại
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const nd_id = decodedToken.nameid;

            // Gọi API để lấy danh sách phiếu mượn của người dùng với nd_id này
            fetch(`https://localhost:44315/api/NguoiDung/${nd_id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        thongtins: data[0],
                    });
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            // Xử lý khi không có token
            console.error('Access token not found');
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    handlePasswordChange = () => {
        console.log("Đổi mật khẩu button clicked");
        // Add any functionality for password change here
    }

    render() {
        const {
            thongtins
        } = this.state;
        //console.log(thongtins)
        return (
            <div className={cx('wrapper')}>
                <div className={cx("container")}>
                    <div className={cx('content-body')} >
                        <div className="card border border-0">
                            <div >
                                <h2 className={cx('card-header')}>Thông tin tài khoản người dùng</h2>
                            </div>
                            <hr />

                            <div className="row d-flex justify-content-between mt-5">

                                {thongtins && (
                                    <>
                                        <div className='col-1'>
                                            <img
                                                width="120px"
                                                height="180px"
                                                style={{ borderRadius: "10px" }}
                                                alt=""
                                                src={
                                                    thongtins?.nd_HinhThe
                                                        ? `https://localhost:44315/Photos/${thongtins?.nd_HinhThe}`
                                                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                }
                                            />
                                        </div>
                                        <div className="col-4 ">
                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Usename</label>
                                                : {thongtins?.nd_Username}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Họ tên</label>
                                                : {thongtins?.nd_HoTen}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Ngày sinh</label>
                                                : {new Date(thongtins?.nd_NgaySinh).toLocaleDateString('en-GB')}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Giới tính</label>
                                                : {thongtins?.nd_GioiTinh}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Số CCCD</label>
                                                : {thongtins?.nd_CCCD}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Số điện thoại</label>
                                                : {thongtins?.nd_SoDienThoai}
                                            </div>


                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Email</label>
                                                : {thongtins?.nd_Email}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Địa chỉ</label>
                                                : {thongtins?.nd_DiaChi}
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Ngày đăng ký hội viên</label>
                                                : {new Date(thongtins?.nd_NgayDangKy).toLocaleDateString('en-GB')}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Thời gian sử dụng</label>
                                                : {thongtins?.nd_ThoiGianSuDung}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="fw-medium">Thuộc đối tượng người dùng</label>
                                                : {thongtins?.lnd_LoaiNguoiDung === 1 ? "Sinh viên của trường" : "Bạn đọc ngoài nhà trường"}
                                            </div>

                                            <div className="form-group mb-3 text-success fw-bold">
                                                <label className="fw-medium text-black">Trạng thái hoạt động tài khoản</label>
                                                : {thongtins.nd_active === true ? "Đang hoạt động" : thongtins.nd_active === false ? "Đã bị khóa" : "Trạng thái không xác định"}
                                            </div>

                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="row d-flex justify-content-end mt-3">
                                <div className='col-4 '>
                                    <div className="row flex">
                                        <div className="col-5">
                                            <Link to="/userhome" type="submit" className={cx('btn-return')}>
                                                <p className="pt-3">Quay lại</p>
                                            </Link>
                                        </div>
                                        <div className="col-7 ">
                                            <button
                                                type="button"
                                                className={cx('btn-continue')}
                                                onClick={this.handlePasswordChange}
                                            >
                                                Đổi mật khẩu
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}