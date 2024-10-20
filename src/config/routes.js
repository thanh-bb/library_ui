const routes = {
    login: '/',
    signup: '/signup',

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
    nguoidungdangky: '/admin/nguoidungdangky',
    chitietNDDK: '/admin/chitietNDDK/:id',
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
    thongtintaikhoan: '/thongtintaikhoan',
    giosach: '/giosach',
    chitietphieumuonOnline: "/chi_tiet_phieu_muon_online",
    vnpay: "/vnpay"
}
export default routes;