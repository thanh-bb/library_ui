import React, { Component } from "react";
import { Link } from "react-router-dom";
// import classNames from 'classnames/bind';
// import styles from './UserHome.module.scss';


// const cx = classNames.bind(styles);

export class UserHome extends Component {
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
    }

    componentDidMount() {
        this.refreshList();
    }

    render() {
        const {
            sachs,
            PhotoPath,
            tacgias = [],
            theloais = [],

        } = this.state;
        const getAuthorNameById = (tg_Id) => {
            const author = tacgias.find(author => author.tg_Id === tg_Id);
            return author ? author.tg_TenTacGia : "Unknown Author";
        };
        const getTheLoaiById = (tl_Id) => {
            const tl = theloais.find(tl => tl.tl_Id === tl_Id);
            return tl ? tl.tl_TenTheLoai : "Không xác định";
        };
        return (

            <div className="wrapper">
                <div className="row justify-content-center mt-5 " style={{ width: "100%" }}>
                    {sachs.map(dep =>
                        <div className="col-md-2 m-4" key={dep.s_Id}>
                            <div className="bg-body-tertiary card h-100 p-3 shadow  bg-body-tertiary rounded rounded-4">
                                <div className="d-flex justify-content-center">
                                    <img alt="" className="card-img-top mt-5" src={PhotoPath + dep.s_HinhAnh} style={{ width: "100px", height: "150px" }} />
                                </div>
                                <div className="card-body ">
                                    <p className="card-title fw-bold ttext-start">{dep.s_TenSach}</p>
                                    <p className="card-text text-start fw-bolder">{getAuthorNameById(dep.tg_Id)}</p>
                                    <p className="card-text text-start fw-light text-primary">{getTheLoaiById(dep.tl_Id)}</p>
                                    <h5 className="card-text text-start"> Trạng thái:
                                        <span className="text-success fst-italic fw-bold"> {dep.s_TrangThaiMuon === true ? " Sẵn sàng" : dep.s_TrangThaiMuon === false ? "Chưa sẵn sàng" : "Trạng thái không xác định"}
                                        </span>
                                    </h5>
                                </div>
                                <div className="d-grid gap-2">
                                    <Link to={`/chitietsach/${dep.s_Id}`} className="btn fs-3 wt-100" style={{ backgroundColor: "#fe2c55", color: "#fff" }}>Xem chi tiết</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>



        )
    }
}