import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { jwtDecode } from 'jwt-decode';
import images from '~/assets/images';
import config from '~/config';
import { EyeCloseIcon, EyeOpenIcon } from "~/components/Icons";

const cx = classNames.bind(styles);

const Login = () => {

    const [username, usernameupdate] = useState('');


    const usernavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);


    // ẩn hiện passwword
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const ProcceedLoginusingAPI = (e) => {
        e.preventDefault();
        if (validate()) {
            /// impletation
            let inputobj = {
                "username": username,
                "password": password
            };

            fetch("https://localhost:44315/api/User/Authenticate", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(inputobj)
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp); // Log the response from the backend
                if (resp && resp.JWTToken) {
                    const token = resp.JWTToken;
                    console.log(token); // Log the token received from the backend
                    try {
                        const decodedToken = jwtDecode(token, 'this is my custom Secret key for authentication');
                        console.log(decodedToken); // Log the decoded token
                        if (decodedToken.role === '1') {
                            usernavigate('/admin/danhmuc');
                        } else {
                            usernavigate('/userhome');
                        }
                        toast.success('Success');
                        sessionStorage.setItem('username', username);
                        sessionStorage.setItem('jwttoken', token);
                    } catch (error) {
                        console.error(error); // Log any decoding errors
                        toast.error('Login Failed due to :' + error.message);
                    }
                } else {
                    console.error('Invalid response from server'); // Log if the response or token is missing
                    toast.error('Login Failed due to :Invalid response from server');
                }
            });

        }

    }

    const validate = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
            toast.warning('Pls enter Username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Pls enter Password');
        }

        return result;


    }
    return (
        <div className={cx("wrapper")}>
            <Link to={config.routes.home} className={cx('logo-link position-absolute top-0 start-0 m-3')}>
                <img src={images.logo} alt="Logo" />
            </Link>
            <div className={cx("container")}>



                <form onSubmit={ProcceedLoginusingAPI} className={cx('form-login')} >

                    <div className="card p-5 ">
                        <div >
                            <h1 className={cx('card-header')}>Đăng nhập tài khoản</h1>
                        </div>
                        <hr />
                        <div className="card-body">
                            <div className="form-group">
                                <label className="fw-bold">User Name<span className="text-danger">*</span></label>
                                <input value={username.trim()} onChange={e => usernameupdate(e.target.value)} className="form-control p-2 bg-body-secondary fs-3"></input>
                            </div>

                            <div className="form-group">
                                <label className="fw-bold mt-3">
                                    Password <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password.trim()}
                                        onChange={handlePasswordChange}
                                        className="form-control p-2 bg-body-secondary fs-3"
                                    />
                                    <button
                                        type="button"
                                        className="btn position-absolute top-50 end-0 translate-middle-y"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <button type="submit" className={cx('btn-grad')}>Login</button>
                            </div>

                            <div className="form-group mt-3">
                                <p className={cx('miss-pass')}>Quên mật khẩu ? Khôi phục mật khẩu tại đây</p>
                            </div>


                            <div className={cx('divider')}>
                                <span className={cx('line')}></span>
                                <span className={cx('text')}>or</span>
                                <span className={cx('line')}></span>
                            </div>

                            <div className="form-group">
                                <Link to="/signup" type="submit" className={cx('btn-register')}>
                                    <p className="pt-2"> Đăng ký hội viên<span className="text-danger">*</span></p>
                                </Link>
                            </div>
                            <div className="form-group ">
                                <p className="fs-5 text-danger fst-italic fw-medium">*dành cho bạn đọc ngoài trường</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >


    );
}

export default Login;