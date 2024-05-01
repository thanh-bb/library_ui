const routes = {
    login: '/',

    //Admin
    danhmuc: '/admin/danhmuc',
    home: '/admin/home',
    profile: '/:nickname',
    upload: '/upload',
    search: '/search',
    theloai: '/admin/theloai',
    sach: '/admin/sach',
    import: '/admin/importfile',
    nguoidung: '/admin/nguoidung',
    phieumuon: '/admin/phieumuon',
    phieutra: '/admin/phieutra',
    phieudongphat: '/admin/phieudongphat',
    quanlypdp: '/admin/phieudongphat/quanly',
    NXB: '/admin/NXB',
    loaisach: '/admin/loaisach',
    tacgia: '/admin/tacgia',
    datra: '/admin/datra',
    nhapkhosach: '/admin/nhapkhosach',
    //User
    userhome: '/userhome',
    chitietsach: '/chitietsach/:id',
    quanlyphieumuon: '/quanlyphieumuon',
    quanlyphieutra: '/quanlyphieutra',
    formphieumuon: '/chitietsach/formphieumuon/:id',
    chitietphieutra: '/chitietphieutra/:id',
    quanlypdp_user: '/quanlyphieudongphat',
    thongtintaikhoan: '/thongtintaikhoan'
}
export default routes;