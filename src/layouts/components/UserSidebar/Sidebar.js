import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserInforIcon,
    UserInforActiveIcon,
    MemberCardIcon,
    MemberCardActiveIcon,
    BillIcon,
    BillActiveIcon,
} from '~/components/Icons';
// import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';

const cx = classNames.bind(styles);

function UserSidebar() {
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('side-bar')}>
                <Menu>
                    <MenuItem title="Trang chủ" to={config.routes.userhome} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Thông tin tài khoản" to={config.routes.thongtintaikhoan} icon={<UserInforIcon />} activeIcon={<UserInforActiveIcon />} />
                    <MenuItem title="Quản lý phiếu mượn" to={config.routes.quanlyphieumuon} icon={<MemberCardIcon />} activeIcon={<MemberCardActiveIcon />} />
                    <MenuItem title="Quản lý phiếu đóng phạt" to={config.routes.quanlypdp_user} icon={<BillIcon />} activeIcon={<BillActiveIcon />} />
                </Menu>
            </div>


        </aside>
    );
}

export default UserSidebar;