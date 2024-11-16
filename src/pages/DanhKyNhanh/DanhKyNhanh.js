import React, { Component } from "react";
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './DanhKyNhanh.module.scss';

const cx = classNames.bind(styles);

export class DanhKyNhanh extends Component {
    constructor(props) {
        super(props);

        const today = new Date();
        const borrowDate = today.toISOString().split('T')[0]; // Định dạng yyyy-mm-dd

        // Tạo bản sao của `today` để tính `dueDate` mà không làm thay đổi `borrowDate`
        const dueDateObj = new Date(today);
        dueDateObj.setDate(today.getDate() + 14);
        const dueDate = dueDateObj.toISOString().split('T')[0]; // Ngày trả là 14 ngày sau

        const borrowDate_L = today.toISOString();
        const dueDate_L = dueDateObj.toISOString();

        this.state = {
            cccd: '',
            username: '',
            borrower: null,
            borrowDate: borrowDate,
            borrowDate_L: borrowDate_L,
            dueDate: dueDate,
            dueDate_L: dueDate_L,
            books: [],
            slipCreated: false,
            errorMessage: '',
            searchBook: '',
            bookResults: [],
            selectedBookId: null,
            bookQuantity: 1,
            numberOfBorrowReceipts_Off: 0,

        };
    }

    // Kiểm tra số lượng phiếu mượn của người dùng
    fetchNumberOfBorrowReceipts_Off = async (userId) => {
        try {
            const response = await fetch(`https://localhost:44315/api/PhieuMuon/Count/${userId}`);
            if (response.ok) {
                const count = await response.json();
                this.setState({ numberOfBorrowReceipts_Off: count });
            } else {
                throw new Error('Failed to fetch number of borrow receipts');
            }
        } catch (error) {
            console.error('Error fetching number of borrow receipts:', error);
        }
    };


    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    searchBorrower = async () => {
        const { cccd, username } = this.state;
        if (!cccd && !username) {
            this.setState({ errorMessage: 'Vui lòng nhập username hoặc CCCD để tìm kiếm.' });
            return;
        }

        try {
            const response = await axios.get('https://localhost:44315/api/NguoiDung/search-borrower', {
                params: { cccd: cccd || null, username: username || null }
            });
            if (response.data !== "Không tìm thấy người mượn") {
                const borrower = response.data[0];
                this.setState({ borrower, errorMessage: '' });
                // Kiểm tra số lượng phiếu mượn khi tìm thấy người mượn
                await this.fetchNumberOfBorrowReceipts_Off(borrower.nd_Id);
            } else {
                this.setState({ errorMessage: "Không tìm thấy người mượn" });
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm người mượn", error);
            this.setState({ errorMessage: 'Lỗi khi tìm kiếm người mượn' });
        }
    };

    searchBook = async () => {
        const { searchBook } = this.state;

        // Đặt lại errorMessage1 khi bắt đầu tìm kiếm mới
        this.setState({ errorMessage1: '' });

        if (!searchBook) {
            this.setState({ errorMessage1: 'Vui lòng nhập tên sách để tìm kiếm.' });
            return;
        }

        try {
            const response = await axios.get(`https://localhost:44315/api/Sach/GetSach`, {
                params: { tenSach: searchBook }
            });

            if (response.data && response.data.length > 0) {
                this.setState({ bookResults: response.data, errorMessage1: '' });
            } else {
                this.setState({ errorMessage1: "Không tìm thấy sách phù hợp." });
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sách", error);
            this.setState({ errorMessage1: 'Lỗi khi tìm kiếm sách' });
        }
    };


    addBookToSlip = (event) => {
        const { bookResults, books } = this.state;
        const selectedBookId = event.target.value;
        const selectedBook = bookResults.find(book => book.s_Id === parseInt(selectedBookId));

        if (!selectedBook) {
            this.setState({ errorMessage1: "Vui lòng chọn sách hợp lệ." });
            return;
        }

        // Kiểm tra nếu đã đạt giới hạn 5 cuốn sách
        if (books.length >= 5) {
            this.setState({ errorMessage1: "Bạn chỉ có thể mượn tối đa 5 cuốn sách." });
            return;
        }

        const newBook = {
            s_Id: selectedBook.s_Id,
            s_TenSach: selectedBook.s_TenSach,
            ctpm_SoLuongSachMuon: 1 // Số lượng mặc định là 1
        };

        // Kiểm tra nếu sách đã có trong danh sách phiếu mượn
        const bookExists = books.some(book => book.s_Id === newBook.s_Id);
        if (bookExists) {
            this.setState({ errorMessage1: "Sách này đã được thêm vào phiếu." });
            return;
        }

        this.setState({
            books: [...books, newBook],
            selectedBookId: null,
            bookQuantity: 1,
            errorMessage1: ''
        });
    };


    createBorrowingSlip = async () => {
        this.setState({ errorMessage2: '' });
        const { borrowDate_L, dueDate_L, borrower, books, numberOfBorrowReceipts_Off } = this.state;

        // Kiểm tra nếu người dùng đã đạt giới hạn phiếu mượn
        if (numberOfBorrowReceipts_Off >= 5) {
            this.setState({ errorMessage2: "Người dùng đã đạt mức mượn sách tối đa. Không thể tạo phiếu mượn mới." });
            return;
        }

        try {
            // Kiểm tra trạng thái mượn của từng cuốn sách trước khi tạo phiếu
            for (let book of books) {
                const checkBorrowStatus = await axios.get(`https://localhost:44315/api/QuanLyPhieuMuon/CheckMuon/${borrower.nd_Id}/${book.s_Id}`);

                if (checkBorrowStatus.status === 200 && checkBorrowStatus.data) {
                    const borrowStatus = checkBorrowStatus.data;

                    // Kiểm tra các trạng thái đã mượn
                    if (borrowStatus === 'Chờ xét duyệt' || borrowStatus === '3' || borrowStatus === '1') {
                        this.setState({
                            errorMessage2: `Người dùng đã mượn sách "${book.s_TenSach}". Vui lòng chọn cuốn sách khác.`
                        });
                        return; // Dừng tạo phiếu mượn nếu sách đã được mượn
                    }
                }
            }

            // Nếu tất cả sách chưa mượn, tiếp tục tạo phiếu mượn
            const response = await axios.post('https://localhost:44315/api/PhieuMuon', {
                pmNgayMuon: borrowDate_L,
                pmHanTra: dueDate_L,
                ndId: borrower.nd_Id,
                ttmId: 1,
                pmTrangThaiXetDuyet: "Đã xét duyệt",
                pmLoaiMuon: "Mượn trực tiếp",
                ChiTietPhieuMuons: books.map(book => ({
                    sId: book.s_Id,
                    ctpmSoLuongSachMuon: book.ctpm_SoLuongSachMuon
                }))
            });

            if (response.data === "Thêm thành công") {
                this.setState({ slipCreated: true });
                alert("Tạo phiếu mượn trực tiếp thành công");

                // Điều hướng về trang chính hoặc refresh
                window.location.href = '/admin/dangkynhanh';
            }
        } catch (error) {
            console.error("Lỗi khi tạo phiếu mượn", error);
            this.setState({ errorMessage2: 'Lỗi khi tạo phiếu mượn' });
        }
    };
    removeBookFromSlip = (s_Id) => {
        this.setState((prevState) => ({
            books: prevState.books.filter(book => book.s_Id !== s_Id)
        }));
    };


    render() {
        const { cccd, username, borrower, slipCreated, errorMessage, errorMessage1, errorMessage2, books, searchBook, bookResults, borrowDate, dueDate } = this.state;

        return (
            <div className={cx('wrapper')}>
                <h2>Đăng Ký Mượn Sách Trực Tiếp</h2>

                <div className={cx('search-section')}>
                    <input
                        type="text"
                        name="cccd"
                        placeholder="CCCD"
                        value={cccd}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.searchBorrower} >Tìm Kiếm Người Mượn</button>
                </div>

                {errorMessage && <p className={cx('error')}>{errorMessage}</p>}

                {borrower && (
                    <div className={cx('borrower-info')}>
                        <h1 className="fw-bold">Thông Tin Phiếu Mượn Trực Tiếp</h1>
                        <div className={cx('info', 'text-start ')}>
                            <p><strong>Họ Tên:</strong> {borrower.nd_HoTen}</p>
                            <p><strong>Username:</strong> {borrower.nd_Username}</p>
                        </div>

                        <div className={cx('form-section')}>
                            <div className={cx('field-container')}>
                                <label>Ngày Mượn:</label>
                                <input type="date" name="borrowDate" value={borrowDate} readOnly />
                            </div>
                            <div className={cx('field-container')}>
                                <label>Hạn Trả:</label>
                                <input type="date" name="dueDate" value={dueDate} readOnly />
                            </div>
                        </div>



                        <div className={cx('form-section2')}>
                            <div className={cx('field-container', 'w-75')}>
                                <input
                                    type="text"
                                    name="searchBook"
                                    placeholder="Nhập tên sách"
                                    value={searchBook}
                                    onChange={this.handleInputChange}
                                />
                            </div>

                            <div className={cx('field-container')}>
                                <button onClick={this.searchBook}>Tìm Kiếm Sách</button>
                            </div>
                        </div>
                        {errorMessage1 && <p className={cx('error')}>{errorMessage1}</p>}


                        {bookResults.length > 0 && (
                            <div className={cx('book-results')}>
                                <h4>Chọn sách để thêm vào phiếu mượn:</h4>
                                <select onChange={this.addBookToSlip} defaultValue="">
                                    <option value="" disabled>Chọn sách</option>
                                    {bookResults.map(book => (
                                        <option key={book.s_Id} value={book.s_Id}>
                                            {book.s_TenSach} - Còn lại: {book.s_SoLuong}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}


                        <div className={cx('books-list')}>
                            <h4>Sách đã chọn:</h4>
                            {books.map((book, index) => (
                                <div key={index} className={cx('book-item')}>
                                    <p>{book.s_TenSach} - Số lượng: {book.ctpm_SoLuongSachMuon} <button onClick={() => this.removeBookFromSlip(book.s_Id)}>Bỏ</button></p>

                                </div>
                            ))}
                        </div>

                        {errorMessage2 && <p className={cx('error')}>{errorMessage2}</p>}
                        <button onClick={this.createBorrowingSlip}>Tạo Phiếu Mượn</button>
                    </div>
                )
                }

                {slipCreated && <p className={cx('success')}>Phiếu mượn đã được tạo thành công!</p>}
            </div >
        );
    }
}

export default DanhKyNhanh;
