import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
} from '~/components/Icons';
// import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';

const cx = classNames.bind(styles);

function UserSidebar() {
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('side-bar')}>
                <Menu>
                    <MenuItem title="Trang chủ" to={config.routes.userhome} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                </Menu>
            </div>


        </aside>
    );
}

export default UserSidebar;