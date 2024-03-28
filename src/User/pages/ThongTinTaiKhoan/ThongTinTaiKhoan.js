import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './ThongTinTaiKhoan.module.scss';
import { jwtDecode } from 'jwt-decode';

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


    render() {
        const {
            thongtins
        } = this.state;
        console.log(thongtins)
        return (
            <div className={cx('wrapper')}>
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className='text-start'>
                            {thongtins && (
                                <> <h1 className='text-center fw-bold'>Thông tin tài khoản</h1>
                                    <table className="table table-bordered fs-3 mt-5">
                                        <tbody>
                                            <tr >
                                                <th scope="row">ID</th>
                                                <td > {thongtins.nd_Id}</td>

                                            </tr >
                                            <tr >
                                                <th scope="row">Username: </th>
                                                <td>{thongtins.nd_Username}</td>

                                            </tr>
                                            <tr >
                                                <th scope="row">Họ tên: </th>
                                                <td>{thongtins.nd_HoTen}</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Giới tính:</th>
                                                <td>{thongtins.nd_GioiTinh}</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Ngày sinh:</th>
                                                <td > {new Date(thongtins.nd_NgaySinh).toLocaleDateString('en-GB')}</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Địa chỉ:</th>
                                                <td>{thongtins.nd_DiaChi}</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Ngày đăng ký:</th>
                                                <td > {new Date(thongtins.nd_NgayDangKy).toLocaleDateString('en-GB')}</td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Email:</th>
                                                <td >{thongtins.nd_Email}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" >Trạng thái tài khoản:</th>
                                                <td className="text-success fw-bold"> {thongtins.nd_active === true ? "Đang hoạt động" : thongtins.nd_active === false ? "Đã bị khóa" : "Trạng thái không xác định"}
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}