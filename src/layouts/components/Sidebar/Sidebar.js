import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveActiveIcon,
    LiveIcon,
} from '~/components/Icons';
// import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('side-bar mb-lg-5 ')}>
                <Menu>
                    {/* <MenuItem title="For You" to={config.routes.home} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} /> */}
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý thông tin sách</div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem
                        title="Danh Mục"
                        to={config.routes.danhmuc}
                        icon={< HomeIcon />}
                        activeIcon={<UserGroupActiveIcon />}
                    />
                    <MenuItem title="Loại sách" to={config.routes.loaisach} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Thể Loại" to={config.routes.theloai} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Nhà xuất bản" to={config.routes.NXB} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Tác Giả" to={config.routes.tacgia} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Sách" to={config.routes.sach} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <MenuItem title="Nhập Kho Sách" to={config.routes.nhapkhosach} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                    <br></br>
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý người dùng</div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem title="ImportFile" to={config.routes.import} icon={<UserGroupIcon />} activeIcon={<HomeActiveIcon />} />
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
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
                    />
                    <MenuItem
                        title="Phiếu Trả"
                        to={config.routes.phieutra}
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
                    />
                    <br></br>
                    <div className="d-flex flex-column ">
                        <div className='fs-5 '>Quản lý vi phạm </div>
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    <MenuItem
                        title="Phiếu Đóng Phạt"
                        to={config.routes.phieudongphat}
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
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