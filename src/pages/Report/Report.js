import React, { useState, useEffect } from 'react';
import Select from 'react-select2-wrapper';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import { connect, useSelector, useDispatch } from "react-redux";
import Flatpickr from 'react-flatpickr';
import moment from 'moment';

import { getReport, statusReportAction, getTotalBookingFeee } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./Report.scss";

const Report = () => {

    document.title = "Report | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { report, isLoading } = useSelector(state => ({
        report: state.ReportRD.report,
        isLoading: state.ReportRD.isLoading,
    }));

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [data, setData] = useState();
    const [searchDate, setSearchDate] = useState(null);
    const [totalBookingFee, setTotalBookingFee] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);

    useEffect(() => {
        fetchReport(currentPage);
        fetchTotalData();
    }, []);

    useEffect(() => {
        updateDataSet();
    }, [report]);

    const fetchReport = async (pagenumber = currentPage) => {
        const payload = {
            page: pagenumber,
            startDate: searchDate ? moment(searchDate[0]).format('YYYY-MM-DD') : null,
            endDate: searchDate ? moment(searchDate[1]).format('YYYY-MM-DD') : null,

        }
        dispatch(getReport(payload));
    };

    const fetchTotalData = async () => {
        await getTotalBookingFeee({}).then(res => {
            setTotalBookingFee(res?.data[0]?.totalBookingFee);
            setTotalEarning(parseFloat(res?.data[0]?.totalBookingAmount) + parseFloat(res?.data[0]?.totalBookingFee));
        }).catch(err => {
            console.log('errror>>>', err);
        });
    }

    const updateDataSet = () => {
        if (report?.data !== undefined) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Artist", field: "name", sort: "asc", width: 150 },
                    { label: "Quantity", field: "quantity", sort: "asc", width: 120 },
                    { label: "Price", field: "price", sort: "asc", width: 120 },
                    { label: "Travel Fee", field: "travelFee", sort: "asc", width: 120 },
                    { label: "Gratuity", field: "gratuity", sort: "asc", width: 120 },
                    { label: "Textured Hair Amount", field: "longHairAmount", sort: "asc", width: 120 },
                    { label: "Blowout Amount", field: "addOnAmount", sort: "asc", width: 120 },
                    { label: "Total Price", field: "total", sort: "asc", width: 120 },
                    { label: "Status", field: "status", sort: "asc", width: 120 },
                    { label: "Booking At", field: "createdAt", sort: "asc", width: 150 },
                    { label: "Action", field: "action", width: 150 },
                ],

                rows: report.data.map((v, index) => {
                    return {
                        id: (report.pagination.currentPage - 1) * 10 + index + 1,
                        name: (
                            <div className='art-name-field'>

                                <span><b>{v?.artistFirstName || "-"} {v?.artistLastName || ""}</b> <br />
                                    <span className='py-2'>{v?.serviceName || "-"}</span><br />
                                    <small>
                                        {v?.booking_id ? (
                                            <Link to={`/booking-view/${v.booking_id}`} className="text-primary">
                                                {v.booking_id}
                                            </Link>
                                        ) : (
                                            "-"
                                        )}
                                    </small>
                                </span>
                            </div>
                        ),
                        quantity: v?.quantity,
                        price: v?.price,
                        gratuity: v?.gratuity,
                        travelFee: v?.travelFee,
                        longHairAmount: v?.longHairAmount,
                        addOnAmount: v?.addOnAmount,
                        total: `$${(
                            (parseFloat(v.price || 0) * (v.quantity > 1 ? v.quantity : 1)) +
                            (parseFloat(v.longHairAmount || 0) * (v.quantity > 1 ? v.quantity : 1)) +
                            (parseFloat(v.addOnAmount || 0) * (v.quantity > 1 ? v.quantity : 1)) +
                            parseFloat(v.gratuity || 0) +
                            parseFloat(v.travelFee || 0)
                        ).toFixed(2)}`,

                        address: v.userAddress?.street || "-",
                        status: (
                            <Badge className={`badge-size ${getStatusClass(v.paymentStatus)}`}>
                                {formatStatus(v.paymentStatus)}
                            </Badge>
                        ),
                        createdAt: moment(v.bookingTime).format('DD-MM-YYYY hh:mm A'),

                        action: (
                            <div className="d-flex gap-2">
                                <a
                                    className="fas fa-cog btn btn-warning action-btn"
                                    onClick={() =>
                                        handleStatusChange(
                                            v.id,
                                            v.paymentStatus,
                                            v.booking_id,
                                            v.artistId
                                        )
                                    }
                                ></a>
                            </div>
                        ),
                    };
                }),
            };

            setCurrentPage(report?.pagination?.currentPage);
            setTotalPages(report?.pagination?.totalPages);
            setTotalReports(report?.pagination?.totalItems);
            setData(rowData);

        }
    };

    const getStatusClass = (paymentStatus) => {
        switch (paymentStatus) {
            case '0':
                return 'bg-danger text-white'; // unpaid
            case '1':
                return 'bg-success text-white'; // paid
            default:
                return 'bg-secondary text-white'; // fallback
        }
    };

    const formatStatus = (paymentStatus) => {
        return paymentStatus === '1' ? 'Paid' : 'Unpaid';
    };

    const handleStatusChange = (bookingItemId, currentStatus, bookingId, artistId) => {
        window.Swal.fire({
            title: 'Change Payment Status',
            input: 'select',
            inputOptions: {
                '0': 'Unpaid',
                '1': 'Paid',
            },
            inputPlaceholder: 'Select a payment status',
            showCancelButton: true,
            inputValue: currentStatus,
            confirmButtonText: 'Update Status',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && result.value !== undefined) {
                const newStatus = result.value;

                const payload = {
                    artistId: artistId,
                    bookingItemId: bookingItemId,
                    bookingId: bookingId,
                    status: newStatus
                };

                statusReportAction(payload)
                    .then((res) => {
                        SuccessAlert(res?.message);
                        fetchReport(report?.pagination?.currentPage);
                    })
                    .catch((e) => {
                        ErrorAlert(e?.message);
                    });
            }
        });
    };

    const getOrderType = (reportItems) => {
        let orderType = '';

        if (reportItems?.now?.length === 0 && reportItems?.later?.length > 0) {
            orderType = 'Future';
        } else if (reportItems?.now?.length > 0 && reportItems?.later?.length === 0) {
            orderType = 'Immediate';
        } else if (reportItems?.now?.length > 0 && reportItems?.later?.length > 0) {
            orderType = 'Immediate/Future';
        } else {
            orderType = 'None';
        }

        return orderType;
    };

    const _onSearch = () => {
        setData([]);
        fetchReport(1);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Reports" />

                    <Row>
                        <Col className="col-12">
                            <Row className='ev-report-total'>
                                <Col md={3}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-ticket text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Commission
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    $ {totalBookingFee ? totalBookingFee?.toFixed(2) : '0.00'}
                                                </h4>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-ticket text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Earning
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    $ {totalEarning ? totalEarning?.toFixed(2) : '0.00'}
                                                </h4>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className='mb-0'>
                                        <CardBody>
                                            <Row className='searchrow g-3'>
                                                <Col lg={'8'}>
                                                    <Label>Booking Time At</Label>
                                                    <Flatpickr
                                                        value={searchDate}
                                                        onChange={(selectedDates) => setSearchDate(selectedDates)}
                                                        options={{
                                                            mode: 'range',
                                                            dateFormat: 'Y-m-d',
                                                            maxDate: 'today',
                                                        }}
                                                        className="form-control"
                                                        placeholder="Select the between dates"
                                                    />
                                                </Col>
                                                <Col lg={'4'} className='searchBtn d-flex justify-content-end'>
                                                    <Button color="success" onClick={() => { _onSearch() }}> Search </Button>
                                                    <Button color="warning" onClick={() => { window.location.reload() }}> Clear Search </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>



                            <Card>
                                <CardBody>
                                    <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Report List</h4>
                                        <div className="d-flex">
                                            {/* <Button onClick={() => navigate('/artist-add')} color="success" className="waves-effect waves-light d-flex align-items-center gap-2 me-1">
                                                <i className="fas fa-plus font-size-16"></i>
                                                Add New Artist
                                            </Button> */}
                                        </div>
                                    </div>
                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalReports}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchReport(pagenumber) }}
                                                isLoading={isLoading}
                                            />
                                            : <>
                                                <div className="tableSpinner d-flex flex-column">
                                                    <span className="spinner-border mb-2" role="status" aria-hidden="true"></span>
                                                    <p className='mb-0'>Loading Table Data...</p>
                                                    <p className='text-primary'>If it takes long time then reload once</p>
                                                </div>
                                            </>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Report;
