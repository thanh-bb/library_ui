import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './Sach.module.scss';


const cx = classNames.bind(styles);


export class Sach extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sachs: [],
            danhmucs: [],
            tacgias: [],
            theloais: [],
            loaisachs: [],
            sachsWithoutFilter: [],
            nhaxuatbans: [],
            kesach: [],
            osach: [],
            selectedImages: [],
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
            PhotoPath: "https://localhost:44315/Photos/"
        };

    }

    FilterFn() {
        var s_IdFilter = this.state.s_IdFilter;
        var s_TenSachFilter = this.state.s_TenSachFilter;
        var filteredData = this.state.sachsWithoutFilter.filter(
            function (el) {
                return (
                    el.s_Id?.toString().toLowerCase().includes(
                        s_IdFilter.toString().trim().toLowerCase()
                    ) &&
                    el.s_TenSach?.toString().toLowerCase().includes(
                        s_TenSachFilter.toString().trim().toLowerCase()
                    )
                );
            }
        );

        this.setState({ sachs: filteredData });

    }

    sortResult(prop, asc) {
        var sortedData = this.state.sachsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ sachs: sortedData });
    }


    changes_IdFilter = (e) => {
        this.setState({ s_IdFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    changes_TenSachFilter = (e) => {
        this.setState({ s_TenSachFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    handleImageChange = (e) => {
        const files = e.target.files;
        this.setState({ selectedImages: files });
    };


    refreshList() {
        fetch("https://localhost:44315/api/Sach")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    sachs: data,
                    sachsWithoutFilter: data
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });

        fetch("https://localhost:44315/api/DanhMuc")
            .then(response => response.json())
            .then(data => {
                this.setState({ danhmucs: data });
            });
        fetch("https://localhost:44315/api/TacGia")
            .then(response => response.json())
            .then(data => {
                this.setState({ tacgias: data });
            });

        fetch("https://localhost:44315/api/TheLoai")
            .then(response => response.json())
            .then(data => {
                this.setState({ theloais: data });
            });
        fetch("https://localhost:44315/api/LoaiSach")
            .then(response => response.json())
            .then(data => {
                this.setState({ loaisachs: data });
            });
        fetch("https://localhost:44315/api/NhaXuatBan")
            .then(response => response.json())
            .then(data => {
                this.setState({ nhaxuatbans: data });
            });

        fetch("https://localhost:44315/api/KeSach")
            .then(response => response.json())
            .then(data => {
                this.setState({ kesachs: data });
            });
        fetch("https://localhost:44315/api/OSach")
            .then(response => response.json())
            .then(data => {
                this.setState({ osachs: data });
            });
    }


    componentDidMount() {
        this.refreshList();
    }

    addClick() {
        this.setState({
            modalTitle: "Add Sach",
            s_Id: 0,
            s_TenSach: "",
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
            s_HinhAnh: ""
        });
    }

    editClick(dep) {
        this.setState({
            modalTitle: "Chỉnh sửa thông tin sách",
            s_Id: dep.s_Id,
            s_TenSach: dep.s_TenSach,
            s_SoLuong: dep.s_SoLuong,
            s_MoTa: dep.s_MoTa,
            s_TrongLuong: dep.s_TrongLuong,
            s_NamXuatBan: dep.s_NamXuatBan,
            s_TrangThaiMuon: dep.s_TrangThaiMuon,
            s_ChiDoc: dep.s_ChiDoc,
            tg_Id: dep.tg_Id,
            nxb_Id: dep.nxb_Id,
            tl_Id: dep.tl_Id,
            ls_Id: dep.ls_Id,
            ks_Id: dep.ks_Id,
            os_Id: dep.os_Id,
            s_HinhAnh: dep.s_HinhAnh,
            PhotoFileName: dep.s_HinhAnh // Thêm dòng này để cập nhật ảnh
        });

    }

    createClick() {
        fetch("https://localhost:44315/api/Sach", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sTenSach: this.state.s_TenSach,
                sSoLuong: this.state.s_SoLuong,
                sMoTa: this.state.s_MoTa,
                sTrongLuong: this.state.s_TrongLuong,
                sNamXuatBan: this.state.s_NamXuatBan,
                sTrangThaiMuon: this.state.s_TrangThaiMuon,
                sChiDoc: this.state.s_ChiDoc,
                tgId: this.state.tg_Id,
                nxbId: this.state.nxb_Id,
                tlId: this.state.tl_Id,
                lsId: this.state.ls_Id,
                ksId: this.state.ks_Id,
                osId: this.state.os_Id,
                sHinhAnh: this.state.PhotoFileName

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

    changeDanhMuc = (e) => {
        // Update dm_Id in the state when danh muc changes
        this.setState({ dm_Id: e.target.value });
    }
    changeTenSach = (e) => {
        // Update dm_Id in the state when danh muc changes
        this.setState({ s_TenSach: e.target.value });
    }

    changeTacGia = (e) => {
        console.log("Selected author ID:", e.target.value);
        this.setState({ tg_Id: e.target.value });
    }

    changeNamXuatBan = (e) => {
        this.setState({ s_NamXuatBan: e.target.value });
    }

    changes_TenSach = (e) => {
        this.setState({ s_TenSach: e.target.value });
    }

    changes_NhaXuatBan = (e) => {
        this.setState({ nxb_Id: e.target.value });
    }

    changes_SoLuong = (e) => {
        // Kiểm tra nếu giá trị nhập vào không phải là số hoặc nhỏ hơn 0, thì không cho phép cập nhật state
        if (!isNaN(e.target.value) && parseInt(e.target.value) >= 0) {
            this.setState({ s_SoLuong: e.target.value });
        } else {
            // Nếu giá trị nhập vào không hợp lệ, bạn có thể thông báo cho người dùng hoặc xử lý theo cách khác tùy ý
            alert("Số lượng không hợp lệ!");
        }
    }

    changes_TheLoai = (e) => {
        this.setState({ tl_Id: e.target.value });
    }

    changes_LoaiSach = (e) => {
        this.setState({ ls_Id: e.target.value });
    }

    changes_MoTa = (e) => {
        this.setState({ s_MoTa: e.target.value });
    }
    changes_KeSach = (e) => {
        this.setState({ ks_Id: e.target.value });
    }

    changes_OSach = (e) => {
        this.setState({ os_Id: e.target.value });
    }

    changes_TrangThaiMuon = (e) => {
        this.setState({ s_TrangThaiMuon: e.target.value });
    }

    changes_ChiDoc = (e) => {
        this.setState({ s_ChiDoc: e.target.value });
    }

    updateClick() {
        fetch("https://localhost:44315/api/Sach", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sId: this.state.s_Id,
                sTenSach: this.state.s_TenSach,
                sSoLuong: this.state.s_SoLuong,
                sMoTa: this.state.s_MoTa,
                sTrongLuong: this.state.s_TrongLuong,
                sNamXuatBan: this.state.s_NamXuatBan,
                sTrangThaiMuon: this.state.s_TrangThaiMuon,
                sChiDoc: this.state.s_ChiDoc,
                tgId: this.state.tg_Id,
                nxbId: this.state.nxb_Id,
                tlId: this.state.tl_Id,
                lsId: this.state.ls_Id,
                ksId: this.state.ks_Id,
                osId: this.state.os_Id,
                sHinhAnh: this.state.PhotoFileName
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

    deleteClick(id) {
        if (window.confirm("Ban co chac chan muon xoa?")) {
            fetch("https://localhost:44315/api/Sach/" + id, {
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

    imageUpload = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);

        fetch("https://localhost:44315/api/Sach/SaveFile", {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ PhotoFileName: data });
            })
    }

    render() {
        const {
            modalTitle,
            tl_Id,
            s_Id,
            s_TenSach,
            sachs,
            s_NamXuatBan,
            tg_Id,
            tacgias,
            theloais,
            loaisachs,
            nhaxuatbans,
            nxb_Id,
            ls_Id,
            ks_Id,
            os_Id,
            kesachs,
            osachs,
            PhotoPath,
            PhotoFileName,
            s_TrangThaiMuon,
            s_ChiDoc,
            s_MoTa,
            s_SoLuong
        } = this.state;

        const formattedDate = new Date(s_NamXuatBan).toISOString().split("T")[0];

        return (
            <div className={cx('wrapper')}>
                <button type="button"
                    className={cx('btn-grad')}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Thêm Sách
                </button>

                <table className="table table-hover"  >
                    <thead className="table-danger">
                        <tr >
                            <th className="text-start w-25">
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2 fs-4"
                                        onChange={this.changes_IdFilter}
                                        placeholder="Tìm theo ID" />

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('s_Id', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('s_Id', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>

                                </div>
                                ID Sách
                            </th>
                            <th className="text-start">Hình Ảnh</th>
                            <th className="text-start">
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2 fs-4"
                                        onChange={this.changes_TenSachFilter}
                                        placeholder="Tìm theo ký tự" />

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('s_TenSach', true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('s_TenSach', false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>
                                </div>
                                Tên Sách
                            </th>
                            <th>
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sachs.map(dep =>
                            <tr key={dep.s_Id}>
                                <td className="text-start">{dep.s_Id}</td>
                                <td className="text-start">
                                    <img width="50px" height="50px"
                                        alt=""
                                        src={PhotoPath + dep.s_HinhAnh} />
                                </td>
                                <td className="text-start">{dep.s_TenSach}</td>

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
                                        onClick={() => this.deleteClick(dep.s_Id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>

                                </td>

                            </tr>)}
                    </tbody>
                </table>

                <div className="modal fade " id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered ">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fs-3 fw-bold">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body ">
                                <div className="d-flex flex-row bd-hightlight mb-3">

                                    <div className="p-2 w-50 bd-highlight fs-2">

                                        <div className="input-group mb-3 input-group-lg input-group-lg">
                                            <span className="input-group-text">Tên Sách</span>
                                            <input type="text" className="form-control"
                                                value={s_TenSach}
                                                onChange={this.changeTenSach} />
                                        </div>

                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Tác giả</span>
                                            <select className="form-select"
                                                onChange={this.changeTacGia}
                                                value={tg_Id}>
                                                <option value="">Chọn tác giả</option>
                                                {tacgias.map(dep => <option key={dep.tg_Id} value={dep.tg_Id}>
                                                    {dep.tg_TenTacGia}

                                                </option>)}
                                            </select>
                                        </div>

                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Năm xuất bản</span>
                                            <input type="date" className="form-control"
                                                value={formattedDate} // Sử dụng ngày tháng đã được định dạng
                                                onChange={this.changeNamXuatBan} />
                                        </div>


                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Nhà Xuất Bản</span>
                                            <select className="form-select"
                                                onChange={this.changes_NhaXuatBan}
                                                value={nxb_Id}>
                                                <option value="">Chọn nhà xuất bản</option>
                                                {nhaxuatbans.map(dep => <option key={dep.nxb_Id} value={dep.nxb_Id}>
                                                    {dep.nxb_TenNhaXuatBan}

                                                </option>)}
                                            </select>
                                        </div>

                                        <div className="input-group mb-3 input-group-lg input-group-lg">
                                            <span className="input-group-text">Số lượng</span>
                                            <input type="number" className="form-control"
                                                value={s_SoLuong}
                                                onChange={this.changes_SoLuong} />
                                        </div>

                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Thể Loại</span>
                                            <select className="form-select"
                                                onChange={this.changes_TheLoai}
                                                value={tl_Id}>
                                                <option value="">Chọn thể loại</option>
                                                {theloais?.map(dep => <option key={dep.tl_Id} value={dep.tl_Id}>
                                                    {dep.tl_TenTheLoai}

                                                </option>)}
                                            </select>
                                        </div>


                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Tóm tắt mô tả</span>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                style={{ width: "500px", height: "80px" }} // Điều chỉnh độ rộng tại đây
                                                value={s_MoTa}
                                                onChange={this.changes_MoTa}
                                                maxLength={2000} // Giới hạn độ dài tại đây
                                            />
                                        </div>



                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Kệ</span>
                                            <select className="form-select"
                                                onChange={this.changes_KeSach}
                                                value={ks_Id}>
                                                <option value="">Chọn kệ sách</option>
                                                {kesachs?.map(dep => <option key={dep.ks_Id} value={dep.ks_Id}>
                                                    {dep.ks_TenKe}

                                                </option>)}
                                            </select>
                                        </div>
                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Ô</span>
                                            <select className="form-select"
                                                onChange={this.changes_OSach}
                                                value={os_Id}>
                                                <option value="">Chọn ô sách</option>
                                                {osachs?.map(dep => <option key={dep.os_Id} value={dep.os_Id}>
                                                    {dep.os_TenO}

                                                </option>)}
                                            </select>
                                        </div>

                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Loại Sách</span>
                                            <select className="form-select"
                                                onChange={this.changes_LoaiSach}
                                                value={ls_Id}>
                                                <option value="">Chọn loại sách</option>
                                                {loaisachs?.map(dep => <option key={dep.ls_Id} value={dep.ls_Id}>
                                                    {dep.ls_TenLoaiSach}

                                                </option>)}
                                            </select>
                                        </div>
                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Trạng thái trong kho</span>
                                            <select className="form-select"
                                                onChange={this.changes_TrangThaiMuon}
                                                value={s_TrangThaiMuon}>
                                                <option value="">Chọn trạng thái</option>
                                                <option value={true}>Trong kho sẵn sàng</option>
                                                <option value={false}>Chưa sẵn sàng</option>

                                            </select>
                                        </div>
                                        <div className="input-group mb-3 input-group-lg">
                                            <span className="input-group-text">Cho phép mượn về nhà</span>
                                            <select className="form-select"
                                                onChange={this.changes_ChiDoc}
                                                value={s_ChiDoc}>
                                                <option value="">Chọn </option>
                                                <option value={true}>Chỉ được đọc tại thư viện </option>
                                                <option value={false}>Cho phép mượn về nhà</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-2 w-50 bd-highlight">
                                        <img width="250px" height="250px"
                                            alt=""
                                            src={PhotoPath + PhotoFileName} />
                                        <input className="m-2" type="file" onChange={this.imageUpload} />
                                    </div>
                                </div>

                                {s_Id === 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.createClick()}>
                                        Create
                                    </button> : null}

                                {s_Id !== 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-end fs-2"
                                        onClick={() => this.updateClick()}>
                                        Cập nhật thông tin
                                    </button> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}