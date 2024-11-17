import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPDP.module.scss';

const cx = classNames.bind(styles);

export class QuanLyPDP extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phieudongphats: [],
            nguoiDongPhatMap: {}, // to store user information associated with pm_Id
            pm_IdFilter: "",
            phieudongphatsWithoutFilter: [],

            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 0
        };
    }

    async componentDidMount() {
        try {
            // Fetch PhieuDongPhat data
            const pdpDataResponse = await fetch("https://localhost:44315/api/PhieuDongPhat");
            if (!pdpDataResponse.ok) {
                throw new Error('Failed to fetch PhieuDongPhat data');
            }
            const pdpData = await pdpDataResponse.json();

            // Fetch user information for each pm_Id
            const nguoiDongPhatMap = {};
            for (const pdp of pdpData) {
                const pmId = pdp.pm_Id;
                if (!nguoiDongPhatMap[pmId]) {
                    const userInfoResponse = await fetch(`https://localhost:44315/api/NguoiDung/FindByPmId/${pmId}`);
                    if (!userInfoResponse.ok) {
                        throw new Error(`Failed to fetch user information for pm_Id ${pmId}`);
                    }
                    const userData = await userInfoResponse.json();
                    if (userData.length > 0) {
                        const userName = userData[0].nd_HoTen;
                        nguoiDongPhatMap[pmId] = userName;
                    }
                }
            }

            this.setState({
                phieudongphats: pdpData,
                phieudongphatsWithoutFilter: pdpData,
                nguoiDongPhatMap: nguoiDongPhatMap
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    FilterFn = () => {
        const { pm_IdFilter, phieudongphatsWithoutFilter } = this.state;

        const filteredData = phieudongphatsWithoutFilter.filter(el =>
            el.pm_Id?.toString().toLowerCase().includes(pm_IdFilter.toString().trim().toLowerCase())
        );
        this.setState({ phieudongphats: filteredData });
    }

    changepm_IdFilter = (e) => {
        this.setState({ pm_IdFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.phieudongphatsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ phieudongphats: sortedData });
    }


    // Chuyển trang trước
    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
        }));
    }

    // Chuyển sang trang kế tiếp
    nextPage = () => {
        const { currentPage } = this.state;
        const totalPages = Math.ceil(this.state.phieudongphats.length / this.state.itemsPerPage);
        this.setState({
            currentPage: currentPage < totalPages ? currentPage + 1 : currentPage
        });
    }

    // Chuyển đến trang cụ thể
    goToPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    render() {
        const { phieudongphats, nguoiDongPhatMap } = this.state;


        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(phieudongphats.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = phieudongphats.slice(indexOfFirstItem, indexOfLastItem);


        return (
            <div className={cx('wrapper')}>
                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="d-flex justify-content-center align-items-center">
                        <input
                            className="form-control m-2 fs-4"
                            onChange={this.changepm_IdFilter}
                            placeholder="Tìm theo ID phiếu mượn"
                        />
                    </div>
                </div>
                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr>
                            <th className="text-start">ID Phiếu Phạt</th>
                            <th className="text-start">Tổng Tiền Phạt</th>
                            <th className="text-start">

                                Ngày Xuất PDP
                            </th>
                            <th className="text-center" style={{ width: "20%" }}>

                                Số phiếu mượn
                            </th>
                            <th className="text-center">Trạng Thái Đóng</th>
                            <th className="text-start">Người Đóng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(dep => (
                            <tr key={dep.pdp_Id}>
                                <td className="text-start">{dep.pdp_Id}</td>
                                <td className="text-start">{dep.pdp_TongTienPhat} VND</td>
                                <td className="text-start">{new Date(dep.pdp_NgayDong).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">{dep.pm_Id}</td>
                                <td className="text-center">{dep.pdp_TrangThaiDong ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                <td className="text-start">{nguoiDongPhatMap[dep.pm_Id] || 'Unknown'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Điều hướng phân trang */}
                <div className={cx('pagination-item')}>
                    <nav aria-label="Page navigation example">
                        <ul className={cx('pagination')}>
                            {/* Previous Button */}
                            <li className={cx('page-item', { disabled: currentPage === 1 })}>
                                <a className={cx('page-link')} href="#" aria-label="Previous" onClick={(e) => { e.preventDefault(); this.prevPage(); }}>
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i + 1} className={cx('page-item', { active: currentPage === i + 1 })}>
                                    <a
                                        className={cx('page-link')}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); this.goToPage(i + 1); }}
                                    >
                                        {i + 1}
                                    </a>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={cx('page-item', { disabled: currentPage === totalPages })}>
                                <a className={cx('page-link')} href="#" aria-label="Next" onClick={(e) => { e.preventDefault(); this.nextPage(); }}>
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>


        );


    }
}
