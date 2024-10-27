import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './UserHome.module.scss';
import images from "~/assets/images";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);


export class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sachs: [],
            danhmucs: [],
            tacgias: [],
            theloais: [],
            loaisachs: [],
            hinhminhhoas: [],
            sachsWithoutFilter: [],
            nhaxuatbans: [],
            kesach: [],
            osach: [],
            selectedImages: [],
            listsachnoibats: [],
            sachnoibats: [],
            ranking: [],
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
            PhotoPath: "https://localhost:44315/Photos/",
            selectedCategories: null,
            bookImages: {},

        };
    }


    refreshList() {
        // Fetch list of books
        fetch("https://localhost:44315/api/Sach")
            .then(response => response.json())
            .then(data => {
                // Lọc chỉ những sách có s_TrangThaiMuon là true
                const availableBooks = data.filter(book => book.s_TrangThaiMuon === true);

                this.setState({
                    sachs: availableBooks,
                    sachsWithoutFilter: availableBooks
                });

                // Fetch images for each book after the filtered book list is loaded
                availableBooks.forEach(book => {
                    this.fetchBookImages(book.s_Id);
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
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

        fetch("https://localhost:44315/api/ThongKe/SachNoiBat")
            .then(response => response.json())
            .then(data => {
                const availableProminentBooks = data.filter(book => book.STrangThaiMuon === true);

                this.setState({
                    listsachnoibats: availableProminentBooks
                });

            });
    }

    fetchBookImages = (sId) => {
        fetch(`https://localhost:44315/api/HinhMinhHoa/${sId}`)
            .then(response => response.json())
            .then(images => {
                this.setState(prevState => ({
                    bookImages: {
                        ...prevState.bookImages,
                        [sId]: images.map(image => ({
                            hmh_Id: image.hmh_Id,
                            hmh_HinhAnhMaHoa: image.hmh_HinhAnhMaHoa
                        }))
                    }
                }));
            })
            .catch(error => {
                console.error('Error fetching book images:', error);
            });
    };

    fetchBookPromiment() {
        fetch("https://localhost:44315/api/ThongKe/SachNoiBat")
            .then(response => response.json())
            .then(data => {
                // Lọc chỉ những sách nổi bật có s_TrangThaiMuon là true
                const availableProminentBooks = data.filter(book => book.STrangThaiMuon === true);

                this.setState({
                    listsachnoibats: availableProminentBooks
                });

                // Fetch images for each prominent book
                availableProminentBooks.forEach(book => {
                    this.fetchBookImages(book.s_Id); // Lấy ảnh cho sách nổi bật
                });
            })
            .catch(error => {
                console.error('Error fetching prominent books:', error);
            });
    }


    fetchRankingData() {
        fetch("https://localhost:44315/api/ThongKe/TopReaders")  // Adjust the endpoint as needed
            .then(response => response.json())
            .then(data => {
                this.setState({ ranking: data });
            })
            .catch(error => {
                console.error('Error fetching ranking data:', error);
            });
    }

    componentDidMount() {
        this.refreshList();
        this.fetchRankingData();
    }

    // Function to set the selected category
    setSelectedCategory = (tl_Id) => {
        this.setState({ selectedCategory: tl_Id });
    };

    render() {
        const {
            sachs,
            PhotoPath,
            tacgias = [],
            theloais = [],
            selectedCategory,
            hinhminhhoas,
            listsachnoibats,
            ranking
        } = this.state;

        const getAuthorNameById = (tg_Id) => {
            const author = tacgias.find(author => author.tg_Id === tg_Id);
            return author ? author.tg_TenTacGia : "Unknown Author";
        };
        const getTheLoaiById = (tl_Id) => {
            const tl = theloais.find(tl => tl.tl_Id === tl_Id);
            return tl ? tl.tl_TenTheLoai : "Không xác định";
        };

        // Filter books based on selected category and TrangThaiMuon
        const filteredBooks = selectedCategory
            ? sachs.filter(book => book.tl_Id === selectedCategory && book.s_TrangThaiMuon === true)
            : sachs.filter(book => book.s_TrangThaiMuon === true);


        return (
            <div className={cx('wrapper')}>
                <div className={cx("container")}>
                    <div className="row justify-content-center mt-5 ">
                        {/* notification & news */}
                        <div className="row">
                            <div className="col-8">
                                <div className={cx('board-item')}>
                                    {/* <p className="fw-bold p-3 mx-2">Thông báo - Tin tức</p> */}
                                    <img
                                        className="rounded mx-auto d-block"
                                        width="850x"
                                        height="350px"
                                        alt="Hình minh họa"
                                        src={`https://localhost:44315/Photos/banner.png`}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className={cx('board-item')}>
                                    <p className="fw-bold p-3 mx-2">Bảng xếp hạng bạn đọc:</p>
                                    <table className={cx("table", "text-center", "fs-3")}>
                                        <thead>
                                            <tr>
                                                <th>Hạng</th>
                                                <th>Họ tên</th>
                                                <th>Điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ranking.map((item, index) => (
                                                <tr key={item.NguoiDungId}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.HoTen}</td>
                                                    <td>{item.SoLuongSachMuon}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3 mt-5">
                            <div className={cx("prominent")}>
                                <p className="fw-bold p-3 mx-2">Top những sách nổi bật</p>

                                <div className={cx("d-flex", "justify-content-around", "flex-wrap")}>

                                    {listsachnoibats.map(dep => (
                                        <div className={cx("book-item")} key={dep.SId}>
                                            <div className={cx("book-image-container")}>
                                                {this.state.bookImages[dep.SId]?.[0]?.hmh_HinhAnhMaHoa ? (
                                                    <img
                                                        src={`${PhotoPath}${this.state.bookImages[dep.SId]?.[0]?.hmh_HinhAnhMaHoa}`}
                                                        alt={dep.STenSach}


                                                        className={cx("book-cover")}
                                                    />
                                                ) : (
                                                    <img
                                                        alt="Không có hình ảnh"
                                                        src="https://example.com/default-image.jpg"  // Đường dẫn ảnh mặc định nếu không có hình
                                                    />
                                                )}
                                                {/* Lớp phủ và chữ "Xem chi tiết" */}
                                                <Link to={`/chitietsach/${dep.SId}`} className={cx("overlay")}>
                                                    <span className={cx("view-detail-text")}>Xem chi tiết</span>
                                                </Link>
                                            </div>
                                            <div>
                                                <h4 className="mt-2">
                                                    {dep.STenSach.length > 20 ? dep.STenSach.substring(0, 50) + "..." : dep.STenSach}
                                                </h4>
                                                <h5>{getAuthorNameById(dep.TgId)}</h5>
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        </div>

                        <div className="row mt-3 mt-5">
                            <div className={cx("categories")}>
                                <p className="fw-bold p-3 mx-2">Categories</p>
                                <div className="d-flex flex-column">

                                    {/* hiển thị phân loại */}
                                    <div className="float-start mx-5">

                                        <div className={cx("btn btn-outline-primary me-4 rounded-pill mx-2")} onClick={() => this.setSelectedCategory(null)}>
                                            <p className="mb-0 fs-4" >All</p>
                                        </div>
                                        {theloais?.map(dep =>
                                            <div
                                                className={cx("btn btn-outline-primary rounded-pill mx-2")}
                                                key={dep.tl_Id}
                                                onClick={() => this.setSelectedCategory(dep.tl_Id)}
                                            >
                                                <p className="mb-0 fs-4">{dep.tl_TenTheLoai}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={cx("d-flex", "justify-content-around", "flex-wrap")}>
                                        {filteredBooks.map(dep => (
                                            <div className={cx("book-item", "pb-5")} key={dep.s_Id}>
                                                <div className={cx("book-image-container")}>
                                                    {this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa ? (
                                                        <img
                                                            src={`${PhotoPath}${this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa}`}
                                                            alt={dep.s_TenSach}
                                                            className={cx("book-cover")}
                                                        />
                                                    ) : (
                                                        <img
                                                            alt="Không có hình ảnh"
                                                            src="https://via.placeholder.com/150"
                                                            className={cx("book-cover")}
                                                        />
                                                    )}
                                                    <Link to={`/chitietsach/${dep.s_Id}`} className={cx("overlay")}>
                                                        <span className={cx("view-detail-text")}>Xem chi tiết</span>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <h4 className="mt-2">
                                                        {dep.s_TenSach.length > 20 ? dep.s_TenSach.substring(0, 50) + "..." : dep.s_TenSach}
                                                    </h4>
                                                    <h5>{getAuthorNameById(dep.tg_Id)}</h5>
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                {/* <div className="row justify-content-center mt-5 " style={{ width: "100%" }}>
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
                </div> */}
            </div >



        )
    }
}