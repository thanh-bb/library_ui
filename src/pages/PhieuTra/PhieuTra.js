import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './PhieuTra.module.scss';


const cx = classNames.bind(styles);

export class PhieuTra extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phieutras: [],
            modalTitle: "",
            pt_NgayTra: "",
            nd_Id: 0,
            pt_Id: 0,
            pm_Id: 0,

            pt_IdFilter: "",
            pt_NgayTraFilter: "",
            phieutrasWithoutFilter: [],

            validationError: ""
        }
    }

    FilterFn() {
        var pt_NgayTraFilter = this.state.pt_NgayTraFilter;

        var filteredData = this.state.phieutrasWithoutFilter.filter(
            function (el) {
                return (
                    el.pt_NgayTra?.toString().toLowerCase().includes(
                        pt_NgayTraFilter.toString().trim().toLowerCase()
                    )
                );
            }
        );
        this.setState({ phieutras: filteredData });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.phieutrasWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ phieutras: sortedData });
    }


    changept_NgayTraFilter = (e) => {
        this.setState({ pt_NgayTraFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    refreshList() {
        fetch("https://localhost:44315/api/PhieuTra")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    phieutras: data,
                    phieutrasWithoutFilter: data  // Update phieutrasWithoutFilter with fetched data
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }

    componentDidMount() {
        this.refreshList();
    }


    render() {
        const {
            phieutras,
        } = this.state;

        return (
            <div className={cx('wrapper')}>
                <table className="table table-hover"  >
                    <thead className="table-danger">
                        <tr >
                            <th className="text-start w-25 ">
                                ID Phiếu Trả
                            </th>
                            <th className="text-start w-25 ">
                                <div className="d-flex flex-row">

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pt_NgayTra', true)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </button>

                                    <button type="button" className="btn btn-light"
                                        onClick={() => this.sortResult('pt_NgayTra', false)}  >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                            <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </button>
                                </div >
                                Ngày Trả
                            </th>
                            <th className="text-start">

                                Số Phiếu Mượn
                            </th>
                            <th className="text-start">
                                Người Trả
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieutras.map(dep =>
                            <tr key={dep.pt_Id}>
                                <td className="text-start">{dep.pt_Id}</td>
                                <td className="text-start">{new Date(dep.pt_NgayTra).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{dep.pm_Id}</td>
                                <td className="text-start">{dep.nd_HoTen}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        )
    }
}