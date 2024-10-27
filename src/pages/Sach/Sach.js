import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './Sach.module.scss';
import images from "~/assets/images";


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
            s_SoLuong: 1,
            s_MoTa: "",
            s_TrongLuong: "",
            s_NamXuatBan: 0,
            //   s_TrangThaiMuon: true,
            s_ChiDoc: true,
            tg_Id: 0,
            nxb_Id: 0,
            tl_Id: 0,
            ls_Id: 0,
            ks_Id: 0,
            os_Id: 0,
            // s_HinhAnh: "",
            PhotoFileName: "hello.png",
            PhotoPath: "https://localhost:44315/Photos/",
            errors: {},
            hinhAnhList: [],
            images: [''],
            bookImages: {},
            hmh_Id: 0,

            currentPage: 1,
            itemsPerPage: 5,
            totalPages: 0,

            nhapKhoQuantity: 0, // To store quantity for Nhập Kho
            showNhapKhoModal: false, // To control modal visibility
        };

    }

    validateFields = () => {
        const errors = {};
        if (!this.state.s_TenSach) errors.s_TenSach = "Trường này bắt buộc nhập";
        if (!this.state.s_MoTa) errors.s_MoTa = "Trường này bắt buộc nhập";
        if (!this.state.tg_Id) errors.tg_Id = "Vui lòng chọn chọn tác giả";
        if (!this.state.s_NamXuatBan) errors.s_NamXuatBan = "Vui lòng chọn năm xuất bản";
        if (!this.state.nxb_Id) errors.nxb_Id = "Vui lòng chọn nhà xuất bản";
        if (!this.state.s_SoLuong || this.state.s_SoLuong <= 0) errors.nddk_DiaChi = "Số lượng phải là một số dương lớn hơn 0";
        if (!this.state.tl_Id) errors.tl_Id = "Vui lòng chọn thể loại";
        if (!this.state.ks_Id) errors.ks_Id = "Vui lòng chọn kệ sách";
        if (!this.state.os_Id) errors.os_Id = "Vui lòng chọn ô sách";
        if (!this.state.ls_Id) errors.ls_Id = "Vui lòng chọn loại sách";
        //  if (this.state.s_TrangThaiMuon === null || this.state.s_TrangThaiMuon === undefined) errors.s_TrangThaiMuon = "Vui lòng chọn trạng thái mượn";
        if (this.state.s_ChiDoc === null || this.state.s_ChiDoc === undefined) errors.s_ChiDoc = "Vui lòng chọn tình trạng mượn sách";

        const validImages = this.state.images.filter(image => image !== ''); // Lọc những ảnh đã được chọn
        if (validImages.length === 0) {
            errors.images = "Vui lòng chọn ít nhất một ảnh minh họa";
        }


        this.setState({ errors });
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };


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
        // Fetch list of books
        fetch("https://localhost:44315/api/Sach")
            .then(response => response.json())
            .then(data => {
                const totalPages = Math.ceil(this.state.sachs.length / this.state.itemsPerPage);
                this.setState({
                    sachs: data,
                    sachsWithoutFilter: data,
                    totalPages: totalPages
                });

                // Fetch images for each book after the book list is loaded
                data.forEach(book => {
                    this.fetchBookImages(book.s_Id); // Call fetchBookImages with s_Id
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });

        // Fetch categories, authors, genres, etc.
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
            // s_TrangThaiMuon: true,
            s_ChiDoc: true,
            tg_Id: 0,
            nxb_Id: 0,
            tl_Id: 0,
            ls_Id: 0,
            ks_Id: 0,
            os_Id: 0,
            images: ['']
        });
    }

    editClick(dep) {
        // Cập nhật thông tin sách và hiển thị tiêu đề modal
        this.setState({
            modalTitle: "Chỉnh sửa thông tin sách",
            s_Id: dep.s_Id,
            s_TenSach: dep.s_TenSach,
            s_SoLuong: dep.s_SoLuong,
            s_MoTa: dep.s_MoTa,
            s_TrongLuong: dep.s_TrongLuong,
            s_NamXuatBan: dep.s_NamXuatBan,
            //     s_TrangThaiMuon: dep.s_TrangThaiMuon,
            s_ChiDoc: dep.s_ChiDoc,
            tg_Id: dep.tg_Id,
            nxb_Id: dep.nxb_Id,
            tl_Id: dep.tl_Id,
            ls_Id: dep.ls_Id,
            ks_Id: dep.ks_Id,
            os_Id: dep.os_Id,
            hinhMinhHoas: [] // Để trống trước khi fetch dữ liệu ảnh
        });

        // Gọi API để lấy danh sách hình ảnh của sách này
        fetch(`https://localhost:44315/api/HinhMinhHoa/${dep.s_Id}`)
            .then(response => response.json())
            .then((data) => {
                // Lấy mã hình ảnh từ kết quả và lưu vào state
                this.setState({
                    images: data.map(image => image.hmh_HinhAnhMaHoa) // Lưu mã Base64 của từng hình ảnh
                });
            });

    }

    editTrangThaiClick(dep) {
        this.setState({
            modalTitle: "Chỉnh sửa trạng thái Sách",
            s_Id: dep.s_Id,
            s_TrangThaiMuon: dep.s_TrangThaiMuon,
        });
    }

    handleFileChange = async (e, fieldName, index) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("https://localhost:44315/api/HinhMinhHoa/SaveFile", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (data) {
                    // Cập nhật ảnh đã tải lên trong mảng `images`
                    const updatedImages = [...this.state.images];
                    updatedImages[index] = data; // Cập nhật hình ảnh mới ở vị trí `index`

                    // Nếu chưa đủ 5 ảnh và người dùng vừa tải lên một ảnh mới, thêm một trường trống
                    if (updatedImages.length < 5 && !updatedImages.includes('')) {
                        updatedImages.push('');
                    }

                    this.setState({ images: updatedImages });
                } else {
                    alert("Failed to upload the file.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    createClick = () => {
        const isValid = this.validateFields();

        if (isValid) {
            fetch("https://localhost:44315/api/Sach/CreateBook", {
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
                    //   sTrangThaiMuon: this.state.s_TrangThaiMuon,
                    sChiDoc: this.state.s_ChiDoc,
                    tgId: this.state.tg_Id,
                    nxbId: this.state.nxb_Id,
                    tlId: this.state.tl_Id,
                    lsId: this.state.ls_Id,
                    ksId: this.state.ks_Id,
                    osId: this.state.os_Id,
                })
            })
                .then(res => res.json())
                .then((result) => {
                    alert("Sách được tạo thành công!");
                    const sId = result;

                    // Upload từng ảnh một sau khi sách được tạo
                    this.uploadAllHinhMinhHoa(sId);

                    this.refreshList(); // Làm mới danh sách sau khi tạo thành công

                }, (error) => {
                    alert('Failed to create the book.');
                });
        }
    };

    uploadAllHinhMinhHoa = (sId) => {
        const fileNames = this.state.images;  // You are storing filenames in the `images` state

        fileNames.forEach((fileName) => {
            if (fileName) {
                this.uploadHinhMinhHoa(sId, fileName);
            }
        });
    };

    uploadHinhMinhHoa = (sId, fileName) => {
        console.log("Uploading image:", fileName, "for book ID:", sId); // Add this line for debugging
        fetch("https://localhost:44315/api/HinhMinhHoa", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sId: sId,
                hmhHinhAnhMaHoa: fileName
            })
        })
            .then(res => res.json())
            .then((result) => {
                console.log(`Image ${fileName} uploaded successfully!`);
            }, (error) => {
                console.error(`Failed to upload image ${fileName}`, error);
            });
    };

    addNewImageField = () => {
        if (this.state.images.length < 5) {
            this.setState(prevState => ({
                images: [...prevState.images, null]
            }));
        }
    };


    updateTrangThaiClick() {

        fetch("https://localhost:44315/api/Sach/Put_TrangThai", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sId: this.state.s_Id,
                sTrangThaiMuon: this.state.s_TrangThaiMuon
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


    // cập nhật hình ảnh
    updateImages() {
        fetch("https://localhost:44315/api/HinhMinhHoa", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hmhId: this.state.hmh_Id,
                sId: this.state.s_Id,
                hmhHinhAnhMaHoa: this.state.hmh_HinhAnhMaHoa
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

    changes_TacGia = (e) => {
        console.log("Selected author ID:", e.target.value);
        this.setState({ tg_Id: e.target.value });
    }

    changes_NamXuatBan = (e) => {
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
        if (!isNaN(e.target.value) && parseInt(e.target.value) >= 1) {
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
                //    sTrangThaiMuon: this.state.s_TrangThaiMuon,
                sChiDoc: this.state.s_ChiDoc,
                tgId: this.state.tg_Id,
                nxbId: this.state.nxb_Id,
                tlId: this.state.tl_Id,
                lsId: this.state.ls_Id,
                ksId: this.state.ks_Id,
                osId: this.state.os_Id,
                hinhMinhHoas: this.state.bookImages[this.state.s_Id] // List of images for this book including hmh_Id and hmh_HinhAnhMaHoa
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                //  this.updateImages();
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });
    }


    deleteClick(id) {
        if (window.confirm("Bạn có chắc chắn muốn xóa Sách này?")) {
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

    // Chuyển trang trước
    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
        }));
    }

    // Chuyển sang trang kế tiếp
    nextPage = () => {
        const { currentPage } = this.state;
        const totalPages = Math.ceil(this.state.danhmucs.length / this.state.itemsPerPage);
        this.setState({
            currentPage: currentPage < totalPages ? currentPage + 1 : currentPage
        });
    }

    // Chuyển đến trang cụ thể
    goToPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    openNhapKhoModal = (id) => {
        this.setState({ s_Id: id, showNhapKhoModal: true });
        console.log(id);
    }

    closeNhapKhoModal = () => {
        this.setState({ s_Id: 0, nhapKhoQuantity: 0, showNhapKhoModal: false });
    }

    handleNhapKhoChange = (e) => {
        this.setState({ nhapKhoQuantity: e.target.value });
    }

    submitNhapKho = () => {
        const { s_Id, nhapKhoQuantity } = this.state;

        fetch(`https://localhost:44315/api/Sach/NhapKho/${s_Id}?soLuongNhap=${nhapKhoQuantity}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
                this.closeNhapKhoModal();
            })
            .catch(error => {
                console.error("Error during Nhập Kho:", error);
                alert('Failed to update inventory');
            });
    }

    editSLClick(dep) {
        this.setState({
            s_Id: dep.s_Id,
            s_SoLuong: dep.s_SoLuong
        });
    }

    render() {
        const {

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
            errors,
            images,


        } = this.state;

        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(sachs.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = sachs.slice(indexOfFirstItem, indexOfLastItem);

        const { showNhapKhoModal, nhapKhoQuantity } = this.state;

        const formattedDate = new Date(s_NamXuatBan).toISOString().split("T")[0];

        return (
            <div className={cx('wrapper')}>
                <button type="button"
                    className={cx('btn-grad')}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    +
                </button>

                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="col-6">
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
                    </div>
                    <div className="col-6">
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
                    </div>
                </div>


                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr >
                            <th className="text-start ">
                                ID Sách
                            </th>
                            <th className="text-start">Hình Ảnh</th>
                            <th className="text-start">
                                Tên Sách
                            </th>
                            <th className="text-start ">
                                Số lượng hiện có
                            </th>
                            <th></th>
                            <th>
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map(dep => (
                            <tr key={dep.s_Id}>
                                <td className="text-start">{dep.s_Id}</td>

                                {/* Hiển thị ảnh minh họa */}
                                <td className="text-start">
                                    {this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa ? (
                                        <img
                                            width="50px"
                                            height="50px"
                                            alt="Hình minh họa"
                                            src={`${PhotoPath}${this.state.bookImages[dep.s_Id]?.[0]?.hmh_HinhAnhMaHoa}`}
                                        />
                                    ) : (
                                        <img
                                            width="50px"
                                            height="50px"
                                            alt="Không có hình ảnh"
                                            src="https://example.com/default-image.jpg"  // Đường dẫn ảnh mặc định nếu không có hình
                                        />
                                    )}
                                </td>

                                <td className="text-start">{dep.s_TenSach}</td>

                                <td className="text-start">{dep.s_SoLuong}</td>

                                <td>
                                    <button type="button"
                                        className="btn btn-outline-secondary fs-4 fw-bold"
                                        data-bs-toggle="modal"
                                        data-bs-target="#nhapKhoModal"
                                        onClick={() => this.editSLClick(dep)}>

                                        Nhập kho sách
                                    </button>

                                </td>

                                <td className="position-relative">
                                    <button type="button"
                                        className="btn btn-light mr-1"
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
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal123"
                                        onClick={() => this.editTrangThaiClick(dep)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>


                                </td>


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


                <div className="modal fade " id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered ">
                        <div className="modal-content">
                            <div className="card p-5 ">
                                <div className="modal-header">
                                    <h2 className={cx('card-header')}>Thông tin sách </h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                    ></button>
                                </div>

                                <div className="row d-flex justify-content-around">
                                    <div className="col-5 ">
                                        <div className="form-group mb-3 text-start">
                                            <label className="fw-medium">Tên sách<span className="text-danger">*</span></label>
                                            {errors.s_TenSach && (
                                                <span className="text-danger fs-4 float-end">{errors.s_TenSach}</span>
                                            )}
                                            <input
                                                value={s_TenSach}
                                                onChange={this.changes_TenSach}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />
                                        </div>

                                        <div className="form-group mb-3 text-start">
                                            <label className="fw-medium ">Tác giả<span className="text-danger">*</span></label>
                                            {errors.tg_Id && (
                                                <span className="text-danger fs-4 float-end">{errors.tg_Id}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_TacGia}
                                                value={tg_Id}>
                                                <option value="">Chọn tác giả</option>
                                                {tacgias.map(dep => <option key={dep.tg_Id} value={dep.tg_Id}>
                                                    {dep.tg_TenTacGia}
                                                </option>)}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3 text-start">
                                            <label className="fw-medium ">Nhà xuất bản<span className="text-danger">*</span></label>
                                            {errors.nxb_Id && (
                                                <span className="text-danger fs-4 float-end">{errors.nxb_Id}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_NhaXuatBan}
                                                value={nxb_Id}>
                                                <option value="">Chọn nhà xuất bản</option>
                                                {nhaxuatbans.map(dep => <option key={dep.nxb_Id} value={dep.nxb_Id}>
                                                    {dep.nxb_TenNhaXuatBan}
                                                </option>)}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3 text-start">
                                            <label className="fw-medium">Năm xuất bản<span className="text-danger">*</span></label>
                                            {errors.s_NamXuatBan && (
                                                <span className="text-danger fs-4 float-end">{errors.s_NamXuatBan}</span>
                                            )}
                                            <input
                                                type="date"
                                                value={formattedDate}
                                                onChange={this.changes_NamXuatBan}
                                                className={cx('form-control p-2  fs-3 bg-body-secondary border-0')}
                                            />
                                        </div>

                                        <div className="form-group mb-3 text-start">
                                            <label className="fw-medium ">Thể loại<span className="text-danger">*</span></label>
                                            {errors.tl_Id && (
                                                <span className="text-danger fs-4 float-end">{errors.tl_Id}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_TheLoai}
                                                value={tl_Id}>
                                                <option value="">Chọn thể loại</option>
                                                {theloais?.map(dep => <option key={dep.tl_Id} value={dep.tl_Id}>
                                                    {dep.tl_TenTheLoai}
                                                </option>)}
                                            </select>
                                        </div>


                                    </div>

                                    <div className="col-7 ">
                                        <div className="form-group mb-3 text-start w-75">
                                            <label className="fw-medium ">Loại sách<span className="text-danger">*</span></label>
                                            {errors.ls_Id && (
                                                <span className="text-danger fs-4 float-end">{errors.ls_Id}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_LoaiSach}
                                                value={ls_Id}>
                                                <option value="">Chọn loại sách</option>
                                                {loaisachs?.map(dep => <option key={dep.ls_Id} value={dep.ls_Id}>
                                                    {dep.ls_TenLoaiSach}
                                                </option>)}
                                            </select>
                                        </div>
                                        {/* <div className="form-group mb-3 text-start w-75">
                                            <label className="fw-medium ">Trạng thái trong kho<span className="text-danger">*</span></label>
                                            {errors.s_TrangThaiMuon && (
                                                <span className="text-danger fs-4 float-end">{errors.s_TrangThaiMuon}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_TrangThaiMuon}
                                                value={s_TrangThaiMuon}>
                                                <option value="">Chọn trạng thái</option>
                                                <option value={true}>Trong kho sẵn sàng</option>
                                                <option value={false}>Chưa sẵn sàng</option>
                                            </select>
                                        </div> */}


                                        <div className="form-group mb-3 text-start w-75">
                                            <label className="fw-medium ">Cho phép mượn về nhà<span className="text-danger">*</span></label>
                                            {errors.s_ChiDoc && (
                                                <span className="text-danger fs-4 float-end">{errors.s_ChiDoc}</span>
                                            )}
                                            <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                onChange={this.changes_ChiDoc}
                                                value={s_ChiDoc}>
                                                <option value="">Chọn </option>
                                                <option value={true}>Chỉ được đọc tại thư viện </option>
                                                <option value={false}>Cho phép mượn về nhà</option>
                                            </select>
                                        </div>


                                        <div className="row d-flex justify-content-between">
                                            <div className="col-6">
                                                <div className="form-group mb-3 text-start">
                                                    <label className="fw-medium ">Kệ sách<span className="text-danger">*</span></label>
                                                    {errors.ks_Id && (
                                                        <span className="text-danger fs-4 float-end">{errors.ks_Id}</span>
                                                    )}
                                                    <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                        onChange={this.changes_KeSach}
                                                        value={ks_Id}>
                                                        <option value="">Chọn kệ sách</option>
                                                        {kesachs?.map(dep => <option key={dep.ks_Id} value={dep.ks_Id}>
                                                            {dep.ks_TenKe}
                                                        </option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-6">

                                                <div className="form-group mb-3 text-start">
                                                    <label className="fw-medium ">Ô sách<span className="text-danger">*</span></label>
                                                    {errors.os_Id && (
                                                        <span className="text-danger fs-4 float-end">{errors.os_Id}</span>
                                                    )}
                                                    <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                                        onChange={this.changes_OSach}
                                                        value={os_Id}>
                                                        <option value="">Chọn ô sách</option>
                                                        {osachs?.map(dep => <option key={dep.os_Id} value={dep.os_Id}>
                                                            {dep.os_TenO}
                                                        </option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group mb-3 text-start">
                                                <label className="fw-medium ">Tóm tắt mô tả<span className="text-danger">*</span></label>
                                                {errors.s_MoTa && (
                                                    <span className="text-danger fs-4 float-end">{errors.s_MoTa}</span>
                                                )}
                                                <textarea
                                                    type="text"
                                                    className="form-control p-2  fs-5 bg-body-secondary border-0"
                                                    style={{ height: "37px" }}
                                                    value={s_MoTa}
                                                    onChange={this.changes_MoTa}
                                                    maxLength={2000} // Giới hạn độ dài tại đây
                                                />
                                            </div>
                                        </div>


                                    </div>

                                    <div className="row mt-3 text-center">
                                        {this.state.images.map((image, index) => (
                                            <div className="col" key={index}>
                                                <p className="mb-0 fw-medium fs-4 text-start">Ảnh minh họa {index + 1}</p>
                                                <div className="bd-highlight rounded-2">
                                                    <label style={{ cursor: "pointer" }}>
                                                        <img
                                                            width="65px"
                                                            height="77px"
                                                            style={{ borderRadius: "10%" }}
                                                            alt=""
                                                            src={
                                                                image
                                                                    ? `https://localhost:44315/Photos/${image}`
                                                                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                            }
                                                        />
                                                        <input
                                                            type="file"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => this.handleFileChange(e, `hmh_HinhAnhMaHoa${index + 1}`, index)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        {this.state.errors.images && (
                                            <span className="text-danger fs-4">{this.state.errors.images}</span>
                                        )}
                                    </div>

                                    {/* <div className="image-container">
                                        {this.state.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`https://localhost:44315/Photos/${image}`}
                                                alt={`Hình minh họa ${index + 1}`}
                                                className="img-thumbnail"
                                                style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                            />
                                        ))}
                                    </div> */}


                                    {/* <div className="p-2 w-50 bd-highlight">
                                        <img width="250px" height="250px"
                                            alt=""
                                            src={PhotoPath + PhotoFileName} />
                                        <input className="m-2" type="file" onChange={this.imageUpload} />
                                    </div> */}

                                </div>

                                {s_Id === 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.createClick()}>
                                        Thêm
                                    </button> : null}

                                {s_Id !== 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.updateClick()}>
                                        Cập nhật
                                    </button> : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade " id="nhapKhoModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered ">
                        <div className="modal-content  w-75 position-absolute top-50 start-50 translate-middle">
                            <div className="modal-header">
                                <h5 className="modal-title fs-2">Nhập kho sách</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body ">
                                <div className="input-group mb-3 input-group-lg">
                                    <span className="input-group-text fw-bold">Số lượng nhập</span>
                                    <input
                                        type="number"
                                        className="form-control fs-2"
                                        value={nhapKhoQuantity}
                                        onChange={this.handleNhapKhoChange}
                                    />
                                </div>

                                {this.state.validationError && (
                                    <p className="fw-bold text-danger float-start fs-4" role="alert">
                                        Lưu ý: {this.state.validationError}
                                    </p>
                                )}
                                <button type="button" className={cx('btn-create')} onClick={this.submitNhapKho}>
                                    Xác nhận Nhập Kho
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade " id="exampleModal123" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered ">
                        <div className="modal-content  w-75 position-absolute top-50 start-50 translate-middle">
                            <div className="modal-header">
                                <h5 className="modal-title fs-2">Trạng thái sách</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body ">
                                <div className="input-group mb-3 input-group-lg">
                                    <span className="input-group-text fw-bold">Trạng thái</span>
                                    <select className={cx('form-control  form-select p-2  fs-3 bg-body-secondary border-0 aria-label="Default select example"')}
                                        onChange={this.changes_TrangThaiMuon}
                                        value={s_TrangThaiMuon}>
                                        <option value="">Chọn trạng thái</option>
                                        <option value={true}>Hiển thị trên hệ thống</option>
                                        <option value={false}>Ẩn khỏi hệ thống</option>
                                    </select>
                                </div>


                                <button type="button"
                                    className={cx('btn-create')}
                                    onClick={() => this.updateTrangThaiClick()}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
};

