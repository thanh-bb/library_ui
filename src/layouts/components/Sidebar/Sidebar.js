import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
} from '~/components/Icons';
// import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('side-bar')}>
                <Menu>
                    <MenuItem title="For You" to={config.routes.home} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem
                        title="Danh Mục"
                        to={config.routes.danhmuc}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <MenuItem title="Thể Loại" to={config.routes.theloai} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="Sách" to={config.routes.sach} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="ImportFile" to={config.routes.import} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem
                        title="Người Dùng"
                        to={config.routes.nguoidung}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <MenuItem
                        title="Phiếu Mượn"
                        to={config.routes.phieumuon}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <MenuItem
                        title="Phiếu Đóng Phạt"
                        to={config.routes.phieudongphat}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                </Menu>
                {/* <SuggestedAccounts label="Suggested accounts" />
                <SuggestedAccounts label="Following accounts" /> */}
            </div>


        </aside>
    );
}

export default Sidebar;