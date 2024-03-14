import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
// import Image from '~/components/Image';
import styles from './AccountItem.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    return (
        <Link to={`/chitietsach/${data.s_Id}`} className={cx('wrapper')}>

            {/* <Image className={cx('avatar')} src={data.avatar} alt={data.S_TenSach} /> */}
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{data.s_TenSach}</span>

                </h4>
                {/* <span className={cx('username')}>{data.s_}</span> */}
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;