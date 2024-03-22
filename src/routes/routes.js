import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';
import { UserLayout } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import DanhMuc from '~/pages/DanhMuc';
// import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Login from '~/Login';
import TheLoai from '~/pages/TheLoai';
import Sach from '~/pages/Sach';
import ImportFile from '~/pages/ImportFile';
import NguoiDung from '~/pages/NguoiDung';
import PhieuMuon from '~/pages/PhieuMuon';


import UserHome from '~/User/pages/UserHome';
import ChiTietSach from '~/User/pages/ChiTietSach';
import QuanLyPhieuMuon from '~/User/pages/QuanLyPhieuMuon';
import PhieuMuonUser from '~/User/pages/PhieuMuonUser/PhieuMuonUser';
import ChiTietPhieuTra from '~/User/pages/ChiTietPhieuTra';
import PhieuDongPhat from '~/pages/PhieuDongPhat';

// Public routes
const publicRoutes = [
    { path: config.routes.danhmuc, component: DanhMuc },
    { path: config.routes.sach, component: Sach },
    { path: config.routes.import, component: ImportFile },
    { path: config.routes.nguoidung, component: NguoiDung },
    { path: config.routes.login, component: Login, layout: HeaderOnly },
    // { path: config.routes.profile, component: Profile },
    { path: config.routes.home, component: Home },
    { path: config.routes.theloai, component: TheLoai },
    { path: config.routes.phieumuon, component: PhieuMuon },
    { path: config.routes.phieudongphat, component: PhieuDongPhat },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },

    //User
    { path: config.routes.userhome, component: UserHome, layout: UserLayout },
    { path: config.routes.chitietsach, component: ChiTietSach, layout: UserLayout },
    { path: config.routes.quanlyphieumuon, component: QuanLyPhieuMuon, layout: UserLayout },
    { path: config.routes.formphieumuon, component: PhieuMuonUser, layout: UserLayout },
    { path: config.routes.chitietphieutra, component: ChiTietPhieuTra, layout: UserLayout },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };