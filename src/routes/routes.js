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
import Signup from '~/Signup';
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
import NguoiDungDangKy from '~/pages/NguoiDungDangKy';
import ChiTietNDDK from '~/pages/ChiTietNDDK';
import Cart from '~/User/pages/Cart';
import { CTPMOnline } from '~/User/pages/CTPMOnline/CTPMOnline';
import VNPay from '~/User/pages/VNPay';
import QuanLyPhieuMuonOnline from '~/User/pages/QuanLyPhieuMuonOnline';
import VNPay_SU from '~/User/pages/VNPay_SU';
import PhieuMuonOnline from '~/pages/PhieuMuonOnline';
import PhieuTraOnline from '~/pages/PhieuTraOnline';
import ThongKe from '~/pages/ThongKe';
import DanhKyNhanh from '~/pages/DanhKyNhanh';


// Public routes
const publicRoutes = [
    { path: config.routes.danhmuc, component: DanhMuc },
    { path: config.routes.sach, component: Sach },
    { path: config.routes.import, component: ImportFile },
    { path: config.routes.nguoidung, component: NguoiDung },
    { path: config.routes.nguoidungdangky, component: NguoiDungDangKy },
    { path: config.routes.chitietNDDK, component: ChiTietNDDK },

    { path: config.routes.login, component: Login, layout: HeaderOnly },
    { path: config.routes.signup, component: Signup, layout: HeaderOnly },
    // { path: config.routes.profile, component: Profile },
    { path: config.routes.home, component: Home },
    { path: config.routes.theloai, component: TheLoai },
    { path: config.routes.phieumuon, component: PhieuMuon },
    { path: config.routes.phieutra, component: PhieuTra },
    { path: config.routes.phieumuononline, component: PhieuMuonOnline },
    { path: config.routes.phieutraonline, component: PhieuTraOnline },

    { path: config.routes.phieudongphat, component: PhieuDongPhat },
    { path: config.routes.quanlypdp, component: QuanLyPDP },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.NXB, component: NXB },
    { path: config.routes.loaisach, component: LoaiSach },
    { path: config.routes.tacgia, component: TacGia },
    { path: config.routes.datra, component: DaTra },
    { path: config.routes.nhapkhosach, component: NhapKhoSach },
    { path: config.routes.thongke, component: ThongKe },
    { path: config.routes.dangkynhanh, component: DanhKyNhanh },

    //User
    { path: config.routes.userhome, component: UserHome, layout: UserLayout },
    { path: config.routes.chitietsach, component: ChiTietSach, layout: UserLayout },
    { path: config.routes.quanlyphieumuon, component: QuanLyPhieuMuon, layout: UserLayout },
    { path: config.routes.quanlyphieumuononline, component: QuanLyPhieuMuonOnline, layout: UserLayout },
    { path: config.routes.quanlyphieutra, component: QuanLyPhieuTra, layout: UserLayout },
    { path: config.routes.quanlypdp_user, component: PDP_User, layout: UserLayout },
    { path: config.routes.thongtintaikhoan, component: ThongTinTaiKhoan, layout: UserLayout },
    { path: config.routes.formphieumuon, component: PhieuMuonUser, layout: UserLayout },
    { path: config.routes.chitietphieutra, component: ChiTietPhieuTra, layout: UserLayout },
    { path: config.routes.giosach, component: Cart, layout: UserLayout },
    { path: config.routes.chitietphieumuonOnline, component: CTPMOnline, layout: UserLayout },
    { path: config.routes.vnpay, component: VNPay, layout: UserLayout },
    { path: config.routes.vnpay_su, component: VNPay_SU, layout: UserLayout },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };