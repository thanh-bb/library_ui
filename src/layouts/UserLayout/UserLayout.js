import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './UserLayout.module.scss';
import UserSidebar from '../components/UserSidebar';

const cx = classNames.bind(styles);

function UserLayout({ children }) {

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