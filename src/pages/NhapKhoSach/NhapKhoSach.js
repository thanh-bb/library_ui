import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './NhapKhoSach.module.scss';


const cx = classNames.bind(styles);


export class NhapKhoSach extends Component {
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
            s_SoLuong: 1,
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
            soLuongNhap: 0,
            errors: {
                s_TenSach: '',
                s_MoTa: '',
                tg_Id: '',
                s_NamXuatBan: '',
                nxb_Id: '',
                s_SoLuong: '',
                tl_Id: '',
                ks_Id: '',
                os_Id: '',
                ls_Id: '',
                s_TrangThaiMuon: '',
                s_ChiDoc: '',
                soLuongNhap: ''
            }
        };
        // Bind this cho các phương thức
        this.changes_SoLuongNhap = this.changes_SoLuongNhap.bind(this);
        this.nhapKho = this.nhapKho.bind(this);

    }
    // Xử lý thay đổi số lượng nhập
    changes_SoLuongNhap(e) {
        this.setState({
            soLuongNhap: e.target.value
        });
    }



    // Xử lý nhập kho
    nhapKho(id) {
        if (this.state.soLuongNhap <= 0) {
            this.setState({ errors: { soLuongNhap: 'Số lượng nhập phải là một số dương lớn hơn 0' } });
            return;
        }

        fetch(`https://localhost:44315/api/Sach/NhapKho/${id}?soLuongNhap=${this.state.soLuongNhap}`, {
            method: 'PUT'
        })
            .then(response => response.json())
            .then(data => {
                alert(data); // Hiển thị thông báo nhập kho thành công
                // Sau khi nhập kho thành công, cập nhật lại danh sách sách
                this.refreshList();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi nhập kho');
            });
    }


    validateForm() {
        let isValid = true;
        let errors = {};
        if (!this.state.s_SoLuong || this.state.s_SoLuong <= 0) {
            isValid = false;
            errors['s_SoLuong'] = 'Số lượng phải là một số dương lớn hơn 0';
        }

        this.setState({ errors: errors });
        return isValid;
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
            s_SoLuong: 1,
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
        if (this.validateForm()) {
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
        } else {
            alert('Vui lòng kiểm tra và điền đầy đủ thông tin');
        }
    }



    changes_SoLuong = (e) => {
        // Kiểm tra nếu giá trị nhập vào không phải là số hoặc nhỏ hơn 0, thì không cho phép cập nhật state
        if (!isNaN(e.target.value) && parseInt(e.target.value) >= 1) {
            this.setState({ s_SoLuong: e.target.value });
        } else {
            // Nếu giá trị nhập vào không hợp lệ, bạn có thể thông báo cho người dùng hoặc xử lý theo cách khác tùy ý
            alert("Số lượng không hợp lệ!");
        }
    }



    updateClick() {
        if (this.validateForm()) {
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
        } else {
            alert('Vui lòng kiểm tra và điền đầy đủ thông tin');
        }
    }



    render() {
        const {
            sachs,
            PhotoPath,
            s_SoLuong
        } = this.state;
        const { soLuongNhap, errors } = this.state;


        return (
            <div className={cx('wrapper')}>

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
                                Số lượng hiện có
                            </th>
                            <th>
                                Nhập kho
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sachs?.map(dep =>
                            <tr key={dep.s_Id}>
                                <td className="text-start">{dep.s_Id}</td>
                                <td className="text-start">
                                    <img width="50px" height="50px"
                                        alt=""
                                        src={PhotoPath + dep.s_HinhAnh} />
                                </td>
                                <td className="text-start">{dep.s_TenSach}</td>
                                <td className="text-start">{dep.s_SoLuong}</td>
                                <td className="position-relative">
                                    <div className="input-group mb-3 input-group-lg input-group-lg">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`soLuongNhap_${dep.s_Id}`} // Thêm id ở đây
                                            value={this.state[`soLuongNhap_${dep.s_Id}`]} // Sử dụng id để xác định giá trị trong state
                                            onChange={(e) => this.changes_SoLuongNhap(e, dep.s_Id)} // Truyền s_Id vào hàm xử lý sự kiện
                                            min={1}
                                            max={100}
                                        />

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.nhapKho(dep.s_Id)}
                                        >
                                            Nhập
                                        </button>
                                    </div>

                                </td>

                            </tr>)}
                    </tbody>
                </table>


            </div>
        )
    }
}