import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPhieuMuonOnline.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

export class QuanLyPhieuMuonOnline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chitietpmos: [],
            tenSachFilter: '',
            tensachWithoutFilter: [],// Khởi tạo mảng chitietpmsWithoutFilter
            selectedTag: "Chờ nhận sách",
            phieumuonWithoutFilter: [],
            phieumuononls: [],
            PmoLoaiGiaoHang: "",
            PmoPhuongThucThanhToan: "",
            PmoTrangThai: "",
            countdowns: {}
        }
    }

    handleTenSachFilterChange = (e) => {
        this.setState({ tenSachFilter: e.target.value });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.tensachWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ chitietpmos: sortedData });
    }

    componentWillUnmount() {
        Object.values(this.state.countdowns).forEach(intervalId => clearInterval(intervalId));
    }

    refreshList() {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const nd_id = decodedToken.nameid;

            fetch(`https://localhost:44315/api/PhieuMuonOnline/${nd_id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        chitietpmos: data.filter(pm => pm.PmoTrangThai === this.state.selectedTag || pm.PmoLoaiGiaoHang === this.state.selectedTag || pm.PmoPhuongThucThanhToan === this.state.selectedTag),
                        tensachWithoutFilter: data,
                    }, () => {
                        // Lọc danh sách dựa trên trạng thái đã chọn
                        this.FilterFn();
                        this.startCountdowns(data);
                    });
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            console.error('Access token not found');
        }
    }

    calculateWorkingHoursLeft = (startDate, endDate) => {
        let remainingHours = 48;
        let current = new Date(startDate);

        while (current < endDate && remainingHours > 0) {
            // Bỏ qua thứ Bảy và Chủ Nhật
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                remainingHours -= 1;
            }
            current = new Date(current.getTime() + (1000 * 60 * 60)); // Cộng thêm 1 giờ
        }

        return remainingHours;
    }


    startCountdowns(data) {
        data.forEach(dep => {
            const orderDate = new Date(dep.PmoNgayDat);
            const countdownId = `countdown-${dep.PmoId}`;

            if (this.state.countdowns[countdownId]) {
                clearInterval(this.state.countdowns[countdownId]);
            }

            const intervalId = setInterval(() => {
                const now = new Date();
                const hoursLeft = this.calculateWorkingHoursLeft(orderDate, now);

                if (hoursLeft > 0) {
                    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
                    if (isWeekend) {
                        this.setState(prevState => ({
                            countdowns: {
                                ...prevState.countdowns,
                                [countdownId]: "Tạm ngưng đếm ngược vào cuối tuần" // Thông báo cho người dùng
                            }
                        }));
                        return; // Ngừng đếm ngược vào cuối tuần
                    }
                }

                if (hoursLeft <= 0) {
                    clearInterval(intervalId);

                    if (dep.PmoTrangThai === "Chờ nhận sách") {
                        this.updateOrderStatus();
                    }

                    this.setState(prevState => ({
                        countdowns: {
                            ...prevState.countdowns,
                            [countdownId]: "Expired"
                        }
                    }));
                } else {
                    const hours = Math.floor(hoursLeft);
                    const minutes = Math.floor((hoursLeft % 1) * 60);

                    this.setState(prevState => ({
                        countdowns: {
                            ...prevState.countdowns,
                            [countdownId]: `${hours}h ${minutes}m`
                        }
                    }));
                }
            }, 1000);

            this.setState(prevState => ({
                countdowns: {
                    ...prevState.countdowns,
                    [countdownId]: intervalId
                }
            }));
        });
    }

    updateOrderStatus() {
        fetch(`https://localhost:44315/api/CTPMOnline/CapNhatTrangThaiQuaHan`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.ok) {
                    console.log("Order status updated to 'Quá hạn nhận sách'");
                    this.refreshList(); // Refresh list to get updated data from backend
                } else {
                    return response.text().then(text => { // Lấy chi tiết phản hồi
                        console.error("Failed to update order status:", text);
                    });
                }
            })
            .catch(error => console.error("Error updating status:", error));
    }



    componentDidMount() {
        this.refreshList();
    }

    FilterFn() {
        const { selectedTag, tensachWithoutFilter } = this.state;

        // Lọc dựa trên selectedTag
        const filteredData = tensachWithoutFilter.filter(el => {
            return (
                el.PmoTrangThai === selectedTag || el.PmoPhuongThucThanhToan === selectedTag || el.PmoLoaiGiaoHang === selectedTag
            );
        });

        console.log("Dữ liệu sau khi lọc:", filteredData); // Kiểm tra dữ liệu sau khi lọc
        this.setState({ phieumuononls: filteredData });
    }

    // Phân loại trạng thái
    handleTagSelection = (tag) => {
        this.setState({ selectedTag: tag }, () => {
            this.FilterFn();
        });
    }




    render() {

        const { phieumuononls, tenSachFilter } = this.state;

        // const filteredChitietpms = chitietpms.filter(pm =>
        //     pm.TenSach.toLowerCase().includes(tenSachFilter.toLowerCase())
        // );

        const { selectedTag } = this.state;
        const { countdowns } = this.state;

        // Nhóm dữ liệu theo PmoId để tính số lượng hàng cần gộp
        const groupedData = phieumuononls.reduce((acc, item) => {
            if (!acc[item.PmoId]) {
                acc[item.PmoId] = [];
            }
            acc[item.PmoId].push(item);
            return acc;
        }, {});

        return (
            <div className={cx('wrapper')}>
                <div className="row d-flex justify-content-end mb-3">
                    <h1 className="fw-bold mt-5 mb-5 ">Phiếu Mượn Sách Online</h1>
                    <hr></hr>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Chờ nhận sách" })}
                            onClick={() => this.handleTagSelection("Chờ nhận sách")}

                        >
                            Chờ nhận sách
                        </button>
                    </div>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đã nhận sách" })}
                            onClick={() => this.handleTagSelection("Đã nhận sách")}

                        >
                            Đã nhận sách
                        </button>
                    </div>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đã hoàn thành" })}
                            onClick={() => this.handleTagSelection("Đã hoàn thành")}
                        >
                            Đã hoàn thành
                        </button>
                    </div>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Quá hạn nhận sách" })}
                            onClick={() => this.handleTagSelection("Quá hạn nhận sách")}
                        >
                            Quá hạn nhận sách
                        </button>
                    </div>
                </div>

                {/* <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="d-flex flex-row w-100 mb-2">
                        <input className="form-control m-2 fs-3 p-2 w-100"
                            type="text"
                            placeholder="Tìm kiếm theo tên sách"
                            value={tenSachFilter}
                            onChange={this.handleTenSachFilterChange}
                        />
                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('TenSach', true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('TenSach', false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </button>
                    </div>
                </div> */}


                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5 mt-5">
                    <thead >
                        <tr>
                            <th className="text-start">ID PMO</th>
                            <th className="text-start">Tên sách</th>
                            <th className="text-center">Số lượng</th>
                            <th className="text-center">
                                Ngày đặt
                            </th>
                            <th className="text-center ">Hạn Trả</th>
                            <th className="text-center ">Phương thức nhận sách</th>
                            <th className="text-center">Trạng Thái Nhận Sách</th>
                            <th className="text-center">Thời gian giữ sách còn lại</th>
                            <th className="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(groupedData).map((items, index) => {
                            return items.map((dep, idx) => {
                                const countdownId = `countdown-${dep.PmoId}`;
                                return (
                                    <tr key={`${dep.PmoId}-${idx}`}>
                                        {/* Gộp ô ID đơn hàng nếu là dòng đầu tiên trong nhóm */}
                                        {idx === 0 && (
                                            <td className="text-center fw-bold text-primary" rowSpan={items.length}>
                                                {dep.PmoId}
                                            </td>
                                        )}
                                        <td className="text-start">{dep.TenSach}</td>
                                        <td className="text-center">{dep.SoLuongSach}</td>
                                        <td className="text-center">{new Date(dep.PmoNgayDat).toLocaleDateString('en-GB')}</td>
                                        <td className="text-center">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>
                                        <td className="text-center">{dep.PmoLoaiGiaoHang}</td>
                                        <td className="text-center">{dep.PmoTrangThai}</td>
                                        <td className="text-center fw-bold text-danger">
                                            {countdowns[countdownId] ? countdowns[countdownId] : "Calculating..."}
                                        </td>
                                        <td className="text-center">
                                            <Link type="button" to={`/chitietphieutra/${dep.Id_PhieuMuon}`} className="btn btn-link fs-4">
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>

                </table>
            </div>
        )
    }
}
