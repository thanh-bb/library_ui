import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';


import {
    UserGroupIcon,
    UserGroupActiveIcon,
    BookIcon,
    BookActiveIcon,
    WarningIcon,
    WarningActiveIcon,
    CardIcon,
    CardActiveIcon
} from '~/components/Icons';
// import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';
import TitleMenu from './Menu/TitleMenu';

const cx = classNames.bind(styles);

function Sidebar() {
    // Trạng thái quản lý dropdown của các menu
    const [isBookInfoOpen, setIsBookInfoOpen] = useState(false);
    const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
    const [isBorrowReturnOpen, setIsBorrowReturnOpen] = useState(false);
    const [isViolationManagementOpen, setIsViolationManagementOpen] = useState(false);

    // Hàm toggle để mở hoặc đóng dropdown
    const toggleBookInfo = () => setIsBookInfoOpen(!isBookInfoOpen);
    const toggleUserManagement = () => setIsUserManagementOpen(!isUserManagementOpen);
    const toggleBorrowReturn = () => setIsBorrowReturnOpen(!isBorrowReturnOpen);
    const toggleViolationManagement = () => setIsViolationManagementOpen(!isViolationManagementOpen);

    return (
        <aside className={cx('wrapper')}>
            <div className={cx('side-bar mb-lg-5')}>
                <Menu>
                    {/* Quản lý thông tin sách */}
                    <div className="d-flex flex-column" onClick={toggleBookInfo} style={{ cursor: 'pointer' }}>
                        <TitleMenu
                            title="Quản lý thông tin sách"
                            icon={<BookIcon />}
                            activeIcon={<BookActiveIcon />}
                            to={config.routes.danhmuc}
                        />
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    {isBookInfoOpen && (
                        <div className={cx('dropdown-content')}>
                            <MenuItem
                                title="Danh Mục"
                                to={config.routes.danhmuc}
                                icon=""
                            />
                            <MenuItem
                                title="Loại sách"
                                to={config.routes.loaisach}
                                icon=""
                            />
                            <MenuItem
                                title="Thể Loại"
                                to={config.routes.theloai}
                                icon=""
                            />
                            <MenuItem
                                title="Nhà xuất bản"
                                to={config.routes.NXB}
                                icon=""
                            />
                            <MenuItem
                                title="Tác Giả"
                                to={config.routes.tacgia}
                                icon=""
                            />
                            <MenuItem
                                title="Sách"
                                to={config.routes.sach}
                                icon=""
                            />

                        </div>
                    )}

                    {/* Quản lý người dùng */}
                    <div className="d-flex flex-column" onClick={toggleUserManagement} style={{ cursor: 'pointer' }}>
                        <TitleMenu
                            title="Quản lý người dùng"
                            icon={<UserGroupIcon />}
                            activeIcon={<UserGroupActiveIcon />}
                            to={config.routes.nguoidung}
                        />
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    {isUserManagementOpen && (
                        <div className={cx('dropdown-content')}>

                            <MenuItem
                                title="Người Dùng"
                                to={config.routes.nguoidung}
                                icon=""
                            />
                            <MenuItem
                                title="ImportFile"
                                to={config.routes.import}
                                icon=""
                            />
                            <MenuItem
                                title="Quản lý đăng ký mới"
                                to={config.routes.nguoidungdangky}
                                icon=""
                            />
                        </div>
                    )}

                    {/* Quản lý mượn trả */}
                    <div className="d-flex flex-column" onClick={toggleBorrowReturn} style={{ cursor: 'pointer' }}>
                        <TitleMenu
                            title="Quản lý mượn trả"
                            icon={<CardIcon />}
                            activeIcon={<CardActiveIcon />}
                            to={config.routes.phieumuon}

                        />
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    {isBorrowReturnOpen && (
                        <div className={cx('dropdown-content')}>
                            <MenuItem
                                title="Phiếu Mượn Trực Tiếp"
                                to={config.routes.phieumuon}
                                icon=""
                            />
                            <MenuItem
                                title="Phiếu Trả Trực Tiếp"
                                to={config.routes.phieutra}
                                icon=""
                            />
                            <MenuItem
                                title="Phiếu Mượn Online"
                                to={config.routes.phieumuononline}
                                icon=""
                            />
                            <MenuItem
                                title="Phiếu Trả Online"
                                to={config.routes.phieutraonline}
                                icon=""
                            />
                        </div>
                    )}

                    {/* Quản lý vi phạm */}
                    <div className="d-flex flex-column" onClick={toggleViolationManagement} style={{ cursor: 'pointer' }}>
                        <TitleMenu
                            title="Quản lý vi phạm"
                            icon={<WarningIcon />}
                            activeIcon={<WarningActiveIcon />}
                            to={config.routes.phieudongphat}
                        />
                        <hr style={{ margin: '0' }}></hr>
                    </div>
                    {isViolationManagementOpen && (
                        <div className={cx('dropdown-content')}>
                            <MenuItem
                                title="Phiếu Đóng Phạt"
                                to={config.routes.phieudongphat}
                                icon=""
                            />
                        </div>
                    )}
                </Menu>
            </div>
        </aside>
    );
}

export default Sidebar;
