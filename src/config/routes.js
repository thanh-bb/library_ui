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
    phieudongphat: '/admin/phieudongphat',


    //User
    userhome: '/userhome',
    chitietsach: '/chitietsach/:id',
    quanlyphieumuon: '/quanlyphieumuon',
    formphieumuon: '/chitietsach/formphieumuon/:id',
    chitietphieutra: '/chitietphieutra/:id'
}
export default routes;