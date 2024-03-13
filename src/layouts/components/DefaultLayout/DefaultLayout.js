import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './DefaultLayout.module.scss';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [listupdate] = useState(null);
    useEffect(() => {

        let jwttoken = sessionStorage.getItem('jwttoken');

        fetch("https://localhost:44394/Customer", {
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            listupdate(resp);
        }).catch((err) => {
            console.log(err.message)
        });

    });
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;