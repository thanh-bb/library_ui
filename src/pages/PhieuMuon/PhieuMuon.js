import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './PhieuMuon.module.scss';


const cx = classNames.bind(styles);

export class PhieuMuon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phieumuons: [],
            nguoidungs: [],
            modalTitle: "",
            pm_NgayMuon: "",
            pm_HanTra: "",
            pm_Id: 0,

            pm_HanTraFilter: "",
            pm_NgayMuonFilter: "",
            phieumuonsWithoutFilter: []
        }
    }

    FilterFn() {
        var pm_HanTraFilter = this.state.pm_HanTraFilter;
        var pm_NgayMuonFilter = this.state.pm_NgayMuonFilter;

        var filteredData = this.state.phieumuonsWithoutFilter.filter(
            function (el) {
                return (
                    el.pm_HanTra?.toString().toLowerCase().includes(
                        pm_HanTraFilter.toString().trim().toLowerCase()
                    ) &&
                    el.pm_NgayMuon?.toString().toLowerCase().includes(
                        pm_NgayMuonFilter.toString().trim().toLowerCase()
                    )
                );
            }
        );
        this.setState({ phieumuons: filteredData });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.phieumuonsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ phieumuons: sortedData });
    }


    changepm_NgayMuonFilter = (e) => {
        this.setState({ pm_NgayMuonFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }
    changepm_HanTraFilter = (e) => {
        this.setState({ pm_HanTraFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    refreshList() {
        fetch("https://localhost:44315/api/PhieuMuon")
            .then(response => response.json())
            .then(data => {
                // Sắp xếp dữ liệu theo ngày mượn giảm dần
                data.sort((a, b) => new Date(b.pm_NgayMuon) - new Date(a.pm_NgayMuon));

                this.setState({
                    phieumuons: data,
                    phieumuonsWithoutFilter: data  // Update phieumuonsWithoutFilter with fetched data
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });

        fetch("https://localhost:44315/api/NguoiDung")
            .then(response => response.json())
            .then(data => {
                this.setState({ nguoidungs: data });
            });
    }


    componentDidMount() {
        this.refreshList();
    }

    changepm_TrangThai = (e) => {
        this.setState({ pm_TrangThai: e.target.value });
    }

    addClick() {
        this.setState({
            modalTitle: "Add PhieuMuon",
            pm_Id: 0,
            pm_TenPhieuMuon: ""
        });
    }

    editClick(dep) {
        this.setState({
            modalTitle: "Chỉnh sửa trạng thái phiếu mượn",
            pm_Id: dep.pm_Id,
            pm_TrangThai: dep.pm_TrangThai,
            nd_Id: dep.nd_Id
        });
    }

    createClick() {
        fetch("https://localhost:44315/api/PhieuMuon", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmTenPhieuMuon: this.state.pm_TenPhieuMuon // Thay pm_TenPhieuMuon thành pmTenPhieuMuon
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }

    updateClick() {
        fetch("https://localhost:44315/api/PhieuMuon", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmId: this.state.pm_Id,
                pmTrangThai: this.state.pm_TrangThai // Thay dm_TenDanhMuc thành dmTenDanhMuc
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });

        if (this.state.pm_TrangThai === "Đã trả") {
            const nd_Id = this.state.nd_Id;
            const pm_Id = this.state.pm_Id; // Get the pm_Id from the state

            // Fetch ChiTietPhieuMuon data for the specific pm_Id
            fetch(`https://localhost:44315/api/ChiTietPhieuMuon/${pm_Id}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((data) => {
                    // Check if data is not empty
                    if (data && data.length > 0) {
                        // Lấy thông tin cần thiết từ phản hồi
                        const s_Id = data[0].s_Id;
                        const ctpt_SoLuongSachTra = data[0].ctpm_SoLuongSachMuon;
                        console.log(ctpt_SoLuongSachTra);


                        // Sau khi lấy thông tin, gửi yêu cầu POST để tạo phiếu trả
                        fetch("https://localhost:44315/api/PhieuTra", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ptNgayTra: new Date(), // Lấy ngày và giờ hiện tại
                                ndId: nd_Id, // Sử dụng nd_Id từ trạng thái đang được chọn
                                chiTietPhieuTras: [
                                    {
                                        sId: s_Id,
                                        ctptSoLuongSachTra: ctpt_SoLuongSachTra
                                    }
                                ]
                            })
                        })
                            .then(res => res.json())
                            .then((result) => {
                                alert(result);
                                this.refreshList(); // Sau khi thêm thành công, làm mới danh sách
                            })
                            .catch((error) => {
                                console.error('Failed to create PhieuTra: ', error);
                                alert('Failed to create PhieuTra');
                            });
                    } else {
                        alert("No ChiTietPhieuMuon data found for the provided pm_Id");
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch ChiTietPhieuMuon data: ', error);
                    alert('Failed to fetch ChiTietPhieuMuon data');
                });
        } else {
            // Nếu không phải là "Đã trả", hiển thị thông báo và không thực hiện thêm phiếu trả
            alert("Chỉ có thể tạo phiếu trả khi trạng thái là 'Đã trả'");
        }
    }








    deleteClick(id) {
        if (window.confirm("Ban co chac chan muon xoa?")) {
            fetch("https://localhost:44315/api/PhieuMuon/" + id, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    alert(result);
                    this.refreshList();
                }, (error) => {
                    alert('Failed');
                })
        }
    }


    render() {
        const {
            phieumuons,
            modalTitle,
            pm_Id,
            pm_TrangThai,
            nguoidungs

        } = this.state;

        return (
            <div className={cx('wrapper')}>
                <button type="button"
                    className={cx('btn-grad')}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Gửi mail
                </button>
                <table className="table table-hover"  >
                    <thead className="table-danger">
                        <tr >
                            <th className="text-start">
                                ID Phiếu
                            </th>
                            <th className="text-start">
                                Người mượn
                            </th>
                            <th className="text-start w-25">
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2 fs-4"
                                        onChange={this.changepm_NgayMuonFilter}
                                        placeholder="Tìm theo ngày mượn" />

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pm_NgayMuon', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pm_NgayMuon', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>
                                </div >
                                Ngày Mượn
                            </th>
                            <th className="text-start w-25">
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2 fs-4"
                                        onChange={this.changepm_HanTraFilter}
                                        placeholder="Tìm theo hạn trả" />

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pm_HanTra', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pm_HanTra', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>
                                </div >
                                Hạn Trả
                            </th>
                            <th className="text-start">
                                Trạng Thái
                            </th>
                            <th className="text-start">
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieumuons.map(dep =>
                            <tr key={dep.pm_Id}>
                                <td className="text-start">{dep.pm_Id}</td>
                                <td className="text-start">
                                    {nguoidungs.find(ng => ng.nd_Id === dep.nd_Id)?.nd_Username}
                                </td>
                                <td className="text-start">{new Date(dep.pm_NgayMuon).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{new Date(dep.pm_HanTra).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{dep.pm_TrangThai}</td>
                                <td className="position-relative">
                                    <button type="button"
                                        className="btn btn-light mr-1 "
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(dep)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>

                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        onClick={() => this.deleteClick(dep.pm_Id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>

                                </td>

                            </tr>)}
                    </tbody>
                </table>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text">Trạng thái</span>
                                    <select className="form-select"
                                        onChange={this.changepm_TrangThai}
                                        value={pm_TrangThai}>
                                        <option value="">Chọn trạng thái</option>
                                        <option value={"Đang mượn"}>Đang mượn</option>
                                        <option value={"Đã trả"}>Đã trả</option>
                                        <option value={"Quá hạn trả"}>Quá hạn trả</option>
                                    </select>
                                </div>


                                {pm_Id === 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.createClick()}>
                                        Create
                                    </button> : null}

                                {pm_Id !== 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.updateClick()}>
                                        Update
                                    </button> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}