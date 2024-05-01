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
import PhieuTra from '~/pages/PhieuTra';
import NXB from '~/pages/NXB';
import LoaiSach from '~/pages/LoaiSach';

import UserHome from '~/User/pages/UserHome';
import ChiTietSach from '~/User/pages/ChiTietSach';
import QuanLyPhieuMuon from '~/User/pages/QuanLyPhieuMuon';
import PhieuMuonUser from '~/User/pages/PhieuMuonUser/PhieuMuonUser';
import ChiTietPhieuTra from '~/User/pages/ChiTietPhieuTra';
import PhieuDongPhat from '~/pages/PhieuDongPhat';
import QuanLyPDP from '~/pages/PhieuDongPhat/QuanLyPDP';
import PDP_User from '~/User/pages/QuanLyPDP';
import ThongTinTaiKhoan from '~/User/pages/ThongTinTaiKhoan';
import TacGia from '~/pages/TacGia';
import DaTra from '~/pages/PhieuMuon/DaTra';
import NhapKhoSach from '~/pages/NhapKhoSach';
import { QuanLyPhieuTra } from '~/User/pages/QuanLyPhieuMuon/QuanLyPhieuTra/QuanLyPhieuTra';


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
    { path: config.routes.phieutra, component: PhieuTra },
    { path: config.routes.phieudongphat, component: PhieuDongPhat },
    { path: config.routes.quanlypdp, component: QuanLyPDP },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.NXB, component: NXB },
    { path: config.routes.loaisach, component: LoaiSach },
    { path: config.routes.tacgia, component: TacGia },
    { path: config.routes.datra, component: DaTra },
    { path: config.routes.nhapkhosach, component: NhapKhoSach },

    //User
    { path: config.routes.userhome, component: UserHome, layout: UserLayout },
    { path: config.routes.chitietsach, component: ChiTietSach, layout: UserLayout },
    { path: config.routes.quanlyphieumuon, component: QuanLyPhieuMuon, layout: UserLayout },
    { path: config.routes.quanlyphieutra, component: QuanLyPhieuTra, layout: UserLayout },
    { path: config.routes.quanlypdp_user, component: PDP_User, layout: UserLayout },
    { path: config.routes.thongtintaikhoan, component: ThongTinTaiKhoan, layout: UserLayout },
    { path: config.routes.formphieumuon, component: PhieuMuonUser, layout: UserLayout },
    { path: config.routes.chitietphieutra, component: ChiTietPhieuTra, layout: UserLayout },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };