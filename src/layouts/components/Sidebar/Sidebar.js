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
            <div className={cx('side-bar mb-lg-5 ')}>
                <Menu>
                    <MenuItem title="For You" to={config.routes.home} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý thông tin sách</div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem
                        title="Danh Mục"
                        to={config.routes.danhmuc}
                        icon={< LiveIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <MenuItem title="Loại sách" to={config.routes.loaisach} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="Thể Loại" to={config.routes.theloai} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="Nhà xuất bản" to={config.routes.NXB} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="Tác Giả" to={config.routes.tacgia} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem title="Sách" to={config.routes.sach} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
                    <br></br>
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý người dùng</div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem title="ImportFile" to={config.routes.import} icon={<UserGroupIcon />} activeIcon={<LiveActiveIcon />} />
                    <MenuItem
                        title="Người Dùng"
                        to={config.routes.nguoidung}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <br></br>
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý mượn trả </div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem
                        title="Phiếu Mượn"
                        to={config.routes.phieumuon}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />

                    <br></br>
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý vi phạm </div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem
                        title="Phiếu Đóng Phạt"
                        to={config.routes.phieudongphat}
                        icon={<UserGroupIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                </Menu>
                <br></br>
                {/* <SuggestedAccounts label="Suggested accounts" />
                <SuggestedAccounts label="Following accounts" /> */}
            </div>


        </aside>
    );
}

export default Sidebar;