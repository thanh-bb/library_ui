import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './UserLayout.module.scss';
import UserSidebar from '~/layouts/components/UserSidebar';
// import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function UserLayout({ children }) {
    // const [listupdate] = useState(null);
    // useEffect(() => {

    //     let jwttoken = sessionStorage.getItem('jwttoken');

    //     fetch("https://localhost:44394/Customer", {
    //         headers: {
    //             'Authorization': 'bearer ' + jwttoken
    //         }
    //     }).then((res) => {
    //         return res.json();
    //     }).then((resp) => {
    //         listupdate(resp);
    //     }).catch((err) => {
    //         console.log(err.message)
    //     });

    // });
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <UserSidebar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

UserLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserLayout;