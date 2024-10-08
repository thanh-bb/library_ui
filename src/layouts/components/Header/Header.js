import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEarthAsia,
    faEllipsisVertical,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
// import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';

import {
    CartIcon
} from '~/components/Icons';

// import { InboxIcon, LogoutIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Tiếng Việt',
                }
            ],
        },
    },
];



function Header() {
    const currentUser = true;

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                // Handle change language
                break;
            default:
        }
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: '/thongtintaikhoan',
        },

        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/login',
            separate: true,

        },
    ];

    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('username');
            if (username === '' || username === null) {
                usenavigate('/login');
            } else {
                displayusernameupdate(username);
            }
        }

    }, [location, usenavigate])


    return (
        <div>
            {showmenu &&
                <header className={cx('wrapper')}>
                    <div className={cx('inner')}>
                        <Link to={config.routes.home} className={cx('logo-link mt-3')}>
                            <img src={images.logo} alt="Logo" />
                        </Link>
                        {/* <Menu>
                            <MenuItem title="Trang chủ" to={config.routes.userhome} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                            <MenuItem title="Thông tin tài khoản" to={config.routes.thongtintaikhoan} icon={<UserInforIcon />} activeIcon={<UserInforActiveIcon />} />
                            <MenuItem title="Quản lý phiếu mượn" to={config.routes.quanlyphieumuon} icon={<MemberCardIcon />} activeIcon={<MemberCardActiveIcon />} />
                            <MenuItem title="Quản lý phiếu đóng phạt" to={config.routes.quanlypdp_user} icon={<BillIcon />} activeIcon={<BillActiveIcon />} />
                        </Menu> */}
                        <div className='d-flex justify-content-around mt-5'>
                            <Link to={config.routes.userhome}>
                                <p className='fw-bold p-5 fs-3'>Trang chủ</p>
                            </Link>

                            <Link to={config.routes.quanlyphieumuon}>
                                <p className='fw-bold p-5 fs-3'>Mượn/Trả</p>
                            </Link>

                            <Link to={config.routes.quanlypdp_user}>
                                <p className='fw-bold p-5 fs-3'>Vi phạm</p>
                            </Link>

                            <Link to={config.routes.quanlypdp_user}>
                                <p className='fw-bold p-5 fs-3'>Quy định</p>
                            </Link>

                        </div>
                        <Search />

                        <div className={cx('actions')}>
                            <CartIcon link="/giosach" />

                            {currentUser ? (
                                <>

                                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                                        {currentUser ? (
                                            <Image
                                                className={cx('user-avatar')}
                                                src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
                                                alt="Mon"
                                            />
                                        ) : (
                                            <button className={cx('more-btn')}>
                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                            </button>
                                        )}
                                    </Menu>
                                    <p className={cx('display-username')}  > {displayusername}</p>
                                    {/* <Tippy delay={[0, 50]} content="Logout" placement="bottom">
                                        <button className={cx('action-btn')} >
                                            <LogoutIcon />
                                           
                                        </button>
                                    </Tippy> */}
                                    {/* <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                        <button className={cx('action-btn')}>
                                            <MessageIcon />
                                        </button>
                                    </Tippy>
                                    <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                        <button className={cx('action-btn')}>
                                            <InboxIcon />
                                            <span className={cx('badge')}>12</span>
                                        </button>
                                    </Tippy> */}
                                </>
                            ) : (
                                <>
                                    <Button text>Upload</Button>
                                    <Button primary>Log in</Button>
                                </>
                            )}



                        </div>

                    </div>
                </header>
            }
        </div>
    );
}

export default Header;