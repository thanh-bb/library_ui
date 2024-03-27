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
            phieudongphatsWithoutFilter: []
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
    render() {
        const { phieudongphats, nguoiDongPhatMap } = this.state;

        return (
            <div className={cx('wrapper')}>
                <table className="table table-hover">
                    <thead className="table-danger">
                        <tr>
                            <th className="text-start">ID Phiếu Phạt</th>
                            <th className="text-start">Tổng Tiền Phạt</th>
                            <th className="text-start">
                                <div className="d-flex flex-row">
                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pdp_NgayDong', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pdp_NgayDong', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>
                                </div >
                                Ngày Đóng
                            </th>
                            <th className="text-center" style={{ width: "20%" }}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <input
                                        className="form-control m-2 fs-4"
                                        onChange={this.changepm_IdFilter}
                                        placeholder="Tìm theo ID phiếu mượn"
                                    />
                                </div>
                                Số phiếu mượn
                            </th>
                            <th className="text-center">Trạng Thái Đóng</th>
                            <th className="text-start">Người Đóng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieudongphats.map(dep => (
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
            </div>
        );


    }
}
