import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {
    faEarthAsia,
    faEllipsisVertical,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';

import { CartIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                { type: 'language', code: 'en', title: 'English' },
                { type: 'language', code: 'vi', title: 'Tiếng Việt' },
            ],
        },
    },
];

function Header() {
    const currentUser = true;
    const [displayusername, setDisplayUsername] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [itemCount, setItemCount] = useState(0);
    const token = sessionStorage.getItem('jwttoken');

    let userId = null;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.nameid;
    }

    useEffect(() => {
        if (userId) {
            // Fetch số lượng sách trong giỏ
            const fetchCartItemCount = async () => {
                try {
                    const response = await axios.get(`https://localhost:44315/api/Cart/GetCartItemCount/${userId}`);
                    setItemCount(response.data);  // Cập nhật số lượng sách
                } catch (error) {
                    console.error("Lỗi khi lấy số sách trong giỏ:", error);
                }
            };
            fetchCartItemCount();
        }
    }, [userId]);


    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            setShowMenu(false);
        } else {
            setShowMenu(true);
            const username = sessionStorage.getItem('username');
            if (!username) {
                navigate('/login');
            } else {
                setDisplayUsername(username);
            }
        }
    }, [location, navigate]);

    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                // Handle language change here
                break;
            default:
                break;
        }
    };

    const userMenu = [
        { icon: <FontAwesomeIcon icon={faUser} />, title: 'View profile', to: '/thongtintaikhoan' },
        // ...MENU_ITEMS,
        { icon: <FontAwesomeIcon icon={faSignOut} />, title: 'Log out', to: '/login', separate: true },
    ];

    return (
        <div>
            {showMenu && (
                <header className={cx('wrapper')}>
                    <div className={cx('inner')}>
                        <Link to={config.routes.home} className={cx('logo-link mt-3')}>
                            <img src={images.logo} alt="Logo" />
                        </Link>

                        <div className='d-flex justify-content-around mt-5'>
                            <Link to={config.routes.userhome}>
                                <p className='fw-bold p-5 fs-3'>Trang chủ</p>
                            </Link>

                            <div className={cx('dropdown-container')}>
                                <p className='fw-bold p-5 fs-3'>Mượn/Trả</p>
                                <div className={cx('dropdown')}>
                                    <Link to={config.routes.quanlyphieumuon} className={cx('dropdown-item')}>
                                        Mượn trực tiếp tại thư viện
                                    </Link>
                                    <Link to={config.routes.quanlyphieumuononline} className={cx('dropdown-item')}>
                                        Mượn sách online
                                    </Link>
                                </div>
                            </div>

                            <Link to={config.routes.quanlypdp_user}>
                                <p className='fw-bold p-5 fs-3'>Vi phạm</p>
                            </Link>

                            {/* <Link to={config.routes.quanlypdp_user}>
                                <p className='fw-bold p-5 fs-3'>Quy định</p>
                            </Link> */}
                        </div>

                        <Search />

                        <div className={cx('actions')}>
                            <div>
                                {/* Button với badge hiển thị số lượng */}
                                <span className="badge text-bg-info bg-transparent position-relative fs-4 ">
                                    <a href="/giosach">
                                        <FontAwesomeIcon icon={faShoppingCart} className="fs-1" />
                                        {/* Hiển thị số lượng sách nếu có */}
                                        {itemCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {itemCount}
                                                <span className="visually-hidden">unread messages</span>
                                            </span>
                                        )}
                                    </a>
                                </span>

                                {/* Cart Icon */}

                            </div>

                            {currentUser ? (
                                <>
                                    <Menu items={userMenu} onChange={handleMenuChange}>
                                        <Image
                                            className={cx('user-avatar')}
                                            src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
                                            alt="Mon"
                                        />
                                    </Menu>
                                    <p className={cx('display-username')}>{displayusername}</p>
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
            )}
        </div>
    );
}

export default Header;
