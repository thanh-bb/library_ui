import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { DeleteIcon } from "~/components/Icons";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
const cx = classNames.bind(styles);


export class Cart extends Component {
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
            listcarts: [],
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
            nd_Id: 0,
            selectedBooks: [],
            numberOfBorrowReceipts: 0,
            maxBorrowingsPerMonth: 5,
            numberOfBorrowReceipts_Off: 0,

            borrowedBooks: [],
            borrowMessage: "",

        };
    }

    refreshList() {
        const token = sessionStorage.getItem('jwttoken');

        // Kiểm tra nếu token tồn tại
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            fetch(`https://localhost:44315/api/Cart/GetListCart/${userId}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({ listcarts: data }, () => {
                        if (data.length > 0) {
                            sessionStorage.setItem('cartId', data[0].gh_Id);  // Lưu gh_Id của giỏ hàng đầu tiên
                        }

                        // Gọi checkBookBorrowedStatus sau khi cập nhật listcarts
                        this.checkBookBorrowedStatus();
                    });
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }


        // Fetch list of books
        fetch("https://localhost:44315/api/Sach")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    sachs: data,
                    sachsWithoutFilter: data
                });

                // Fetch images for each book after the book list is loaded
                data.forEach(book => {
                    this.fetchBookImages(book.s_Id); // Call fetchBookImages with s_Id                  
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
                this.setState({ listsachnoibats: data });
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
                this.setState({
                    listsachnoibats: data
                });

                // Fetch images for each prominent book
                data.forEach(book => {
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

    // Hàm lấy số lượng mượn offline
    fetchOfflineBorrowCount = async () => {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const userId = jwtDecode(token).nameid;

            try {
                const response = await fetch(`https://localhost:44315/api/PhieuMuon/Count/${userId}`);
                const offlineCount = await response.json();
                this.setState({ numberOfBorrowReceipts_Off: offlineCount }); // Cập nhật vào state
            } catch (error) {
                console.error('Error fetching offline borrow count:', error);
                this.setState({ numberOfBorrowReceipts_Off: 0 });
            }
        }
    };


    // Hàm gọi cả hai hàm trên và tính tổng
    fetchBorrowCount = async () => {
        await this.fetchOfflineBorrowCount();

        const totalBorrowReceipts = this.state.numberOfBorrowReceipts_Off;
        this.setState({ numberOfBorrowReceipts: totalBorrowReceipts }); // Cập nhật tổng vào state
    };

    // sach muon chua
    // Modify the checkBookBorrowedStatus method in Cart.js

    checkBookBorrowedStatus = async () => {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const userId = jwtDecode(token).nameid;

            const borrowedPromises = this.state.listcarts.map(async (book) => {
                // Offline borrow status check
                const offlineResponse = await fetch(`https://localhost:44315/api/QuanLyPhieuMuon/CheckMuon/${userId}/${book.s_Id}`);
                let isBorrowed = false;

                if (offlineResponse.ok) {
                    const offlineResult = await offlineResponse.json();
                    if (offlineResult === "1" || offlineResult === "2" || offlineResult === "3" || offlineResult === "4") {
                        isBorrowed = true;
                    }
                }

                return isBorrowed ? book.s_Id : null;
            });

            const borrowedBooks = (await Promise.all(borrowedPromises)).filter(id => id !== null);
            this.setState({ borrowedBooks });
        }
    };





    componentDidMount() {
        this.refreshList();
        this.fetchRankingData();
        this.fetchBorrowCount();
        this.checkBookBorrowedStatus();
        this.checkCanBorrow();
    }


    // Function to set the selected category
    setSelectedCategory = (tl_Id) => {
        this.setState({ selectedCategory: tl_Id });
    };


    deleteClick(cartId, sachId) {
        const token = sessionStorage.getItem('jwttoken');

        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.nameid;

            fetch(`https://localhost:44315/api/Cart?gh_Id=${cartId}&s_Id=${sachId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    alert(result);
                    window.location.reload();
                    this.refreshList();
                }, (error) => {
                    alert('Failed');
                })
        }
    }

    handleCheckboxChange = (bookId, isChecked) => {
        // Kiểm tra nếu đang tích chọn và đã chọn đủ 3 cuốn sách
        if (isChecked && this.state.selectedBooks.length >= 3) {
            // Nếu đã chọn 3 cuốn, hiển thị thông báo cảnh báo và không cho chọn thêm
            alert("Bạn chỉ có thể chọn tối đa 3 cuốn sách.");
            return; // Dừng lại, không cập nhật state
        }

        // Cập nhật state với các thay đổi của checkbox (tích chọn hoặc bỏ chọn)
        this.setState(prevState => {
            if (isChecked) {
                // Nếu tích chọn, thêm sách vào danh sách selectedBooks
                return { selectedBooks: [...prevState.selectedBooks, bookId] };
            } else {
                // Nếu bỏ chọn, loại bỏ sách khỏi danh sách selectedBooks
                return { selectedBooks: prevState.selectedBooks.filter(id => id !== bookId) };
            }
        });
    };

    // Kiểm tra sách quá hạn chưa trả
    checkCanBorrow = async () => {
        const token = sessionStorage.getItem('jwttoken');
        const userId = jwtDecode(token).nameid;

        try {
            const response = await fetch(`https://localhost:44315/api/QuanLyPhieuMuon/CheckIfCanBorrow/${userId}`);
            const data = await response.json();

            if (data === "Không thể mượn thêm sách vì bạn có sách quá hạn chưa trả.") {
                this.setState({ borrowMessage: "Không thể mượn thêm sách vì bạn có sách quá hạn chưa trả. Bạn cần trả sách trước khi mượn thêm" }); // Hiển thị thông báo
                return false; // Không cho phép mượn sách
            }
            this.setState({ borrowMessage: "" }); // Xóa thông báo nếu không có vi phạm
            return true; // Cho phép mượn sách nếu không có vi phạm
        } catch (error) {
            console.error("Lỗi khi kiểm tra vi phạm:", error);
            this.setState({ borrowMessage: "Có lỗi khi kiểm tra tình trạng mượn sách." });
            return false;
        }
    };

    handleContinue = async () => {
        const selectedBooks = this.state.listcarts.filter(book =>
            this.state.selectedBooks.includes(book.s_Id)
        );

        if (selectedBooks.length === 0) {
            alert("Vui lòng chọn ít nhất 1 cuốn sách để có thể tiếp tục!");
            return;
        }

        const canBorrow = await this.checkCanBorrow(); // Kiểm tra vi phạm
        if (!canBorrow) {
            alert(this.state.borrowMessage);
            return; // Nếu có vi phạm, dừng tiến trình
        }

        const { numberOfBorrowReceipts_Off, maxBorrowingsPerMonth } = this.state;
        // Check if user has reached the borrow limit
        if (numberOfBorrowReceipts_Off >= maxBorrowingsPerMonth) {
            alert("Bạn đã mượn đủ số lần cho phép của tháng này!");
        } else {
            sessionStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
            window.location.href = "/chi_tiet_phieu_muon_online";
        }
    };



    render() {
        const {
            sachs,
            PhotoPath,
            tacgias = [],
            theloais = [],
            listcarts = [],
            selectedCategory,

        } = this.state;

        const getAuthorNameById = (tg_Id) => {
            const author = tacgias.find(author => author.tg_Id === tg_Id);
            return author ? author.tg_TenTacGia : "Unknown Author";
        };
        const getTheLoaiById = (tl_Id) => {
            const tl = theloais.find(tl => tl.tl_Id === tl_Id);
            return tl ? tl.tl_TenTheLoai : "Không xác định";
        };

        // Filter books based on the selected category
        const filteredBooks = selectedCategory
            ? sachs.filter(book => book.tl_Id === selectedCategory)
            : sachs;

        return (
            <div className={cx('wrapper')}>
                <div className={cx("container")}>
                    <div className="row justify-content-center mt-5 ">
                        {/* notification & news */}
                        <div className={cx("row d-flex justify-content-center", "list-item")}>
                            <div className="col-6">
                                {listcarts.map(dep => (

                                    <div className="row d-flex justify-content-center" key={dep.s_Id}>
                                        <div className="col-1 m-auto">
                                            <div className="form-check">
                                                <input
                                                    className={cx('fs-1 form-check-input', {
                                                        'disabled-checkbox': this.state.borrowedBooks.includes(dep.s_Id)  // Áp dụng lớp khi bị vô hiệu hóa
                                                    })}
                                                    type="checkbox"
                                                    onChange={(e) => this.handleCheckboxChange(dep.s_Id, e.target.checked)}
                                                    checked={this.state.selectedBooks.includes(dep.s_Id)} // Đảm bảo rằng checkbox được đánh dấu nếu sách đã được chọn
                                                    disabled={this.state.selectedBooks.length >= 3 && !this.state.selectedBooks.includes(dep.s_Id) || this.state.borrowedBooks.includes(dep.s_Id)} // Vô hiệu hóa chỉ khi chưa chọn đủ 3 cuốn
                                                />
                                            </div>
                                        </div>




                                        <div className="col">
                                            <div className={cx("board-item")} >
                                                <div className="row ">
                                                    <div className="col-8">
                                                        <div className="row d-flex justify-content-start  ">
                                                            <div className="col-2">
                                                                {this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa ? (
                                                                    <img
                                                                        src={`${PhotoPath}${this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa}`}
                                                                        alt={dep.s_TenSach}
                                                                        className={cx("book-cover")}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        alt="Không có hình ảnh"
                                                                        src="https://via.placeholder.com/150"  // Đường dẫn ảnh mặc định nếu không có hình
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-8  mx-5">
                                                                <h3 className="mt-5">{dep.s_TenSach}</h3>
                                                                <h5>{getAuthorNameById(dep.tg_Id)}</h5>
                                                                <div className={cx("btn  rounded-pill bg-primary-subtle text-primary-emphasis fw-bold")}>
                                                                    <p className="mb-0">{getTheLoaiById(dep.tl_Id)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col m-auto mx-5">
                                                        <div className="row mt-3 d-flex justify-content-between">
                                                            <div className="col-8">
                                                                <p className="fw-bold fs-3  ">Số lượng: <span className="text-danger">1</span></p>
                                                            </div>
                                                            <div className="col-3">
                                                                <button className="bg-transparent" onClick={() => this.deleteClick(dep.gh_Id, dep.s_Id)}>
                                                                    <DeleteIcon />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={cx("relative-parent", "mt-5")}>
                            <div className={cx("row d-flex justify-content-end mt-2 mb-5 w-50 me-5")}>
                                <div className="col-4 ">
                                    <Link to="/userhome" type="submit" className={cx('btn-return')}>
                                        <p className="pt-3">Quay lại</p>
                                    </Link>
                                </div>
                                <div className="col-4">
                                    <button type="button" onClick={this.handleContinue} className={cx('btn-continue')}>
                                        <p className="fs-3">Tiếp tục</p>
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div >



        )
    }
}