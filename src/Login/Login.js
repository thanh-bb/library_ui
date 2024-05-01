import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React from "react";
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

const Login = () => {

    const [username, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');

    const usernavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);


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
                        if (decodedToken.role === '01') {
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
            <div className={cx("container")}>

                <form onSubmit={ProcceedLoginusingAPI} className={cx('form-login')} >

                    <div className="card p-5 ">
                        <div >
                            <h1 className={cx('card-header')}>Login</h1>
                        </div>
                        <hr />
                        <div className="card-body">
                            <div className="form-group">
                                <label className="fw-bold">User Name <span className="text-danger">*</span></label>
                                <input value={username} onChange={e => usernameupdate(e.target.value)} className="form-control p-3 bg-body-secondary fs-3"></input>
                            </div>

                            <div className="form-group">
                                <label className="fw-bold mt-5">Password<span className="text-danger">*</span></label>
                                <input type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control p-3 bg-body-secondary fs-3"></input>
                            </div>
                        </div>

                        <div className='d-grid gap-2 col-6 mx-auto mt-5'>
                            <button type="submit" className={cx('btn-grad')}>SUBMIT</button>
                        </div>

                    </div>
                </form>
            </div >
        </div >


    );
}

export default Login;