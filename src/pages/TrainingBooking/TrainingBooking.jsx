import React, { useState, useEffect } from 'react';
import Select from 'react-select2-wrapper';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import { connect, useSelector, useDispatch } from "react-redux";
import Flatpickr from 'react-flatpickr';
import moment from 'moment';

import { getBooking, updateTariningBooking, getTariningBooking } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./Booking.scss";

const TrainigBooking = () => {

    document.title = "Tainig Booking | Flawless Admin Panel";

    const dispatch = useDispatch();
    // const { booking, isLoading } = useSelector(state => ({
    //     booking: state.BookingRD.booking,
    //     isLoading: state.BookingRD.isLoading,
    // }));

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const [data, setData] = useState();
    const [booking, setBooking] = useState([]);

    const [search, setSearch] = useState(null);
    const [searchDate, setSearchDate] = useState(null);
    const [searchStatus, setSearchStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const status = [
        { id: "pending", text: "Pending" },
        { id: "cancelled", text: "Cancelled" },
        { id: "completed", text: "Completed" },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'cancelled': return 'bg-danger text-white';
            case 'completed': return 'bg-success text-white';
            default: return 'bg-primary text-black';
        }
    };

    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    useEffect(() => {
        fetchBooking(currentPage);
    }, []);

    useEffect(() => {
        updateDataSet()
    }, [booking])

    const fetchBooking = async (pagenumber = currentPage) => {
        setIsLoading(true);
        const payload = {
            page: pagenumber,
            search: search,
            status: searchStatus,
            startDate: searchDate ? moment(searchDate[0]).format('YYYY-MM-DD') : null,
            endDate: searchDate ? moment(searchDate[1]).format('YYYY-MM-DD') : null,
        }
        const list = await getTariningBooking(payload);
        console.log(list);
        setBooking(list);
        setIsLoading(false);
    };

    const updateDataSet = () => {
        if (booking?.data !== undefined) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Client Name", field: "name", sort: "asc", width: 150 },
                    { label: "Service Name", field: "service_name", sort: "asc", width: 120 },
                    { label: "Amount", field: "amount", sort: "asc", width: 120 },
                    { label: "Training Time", field: "training_date", sort: "asc", width: 120 },
                    { label: "Status", field: "status", sort: "asc", width: 120 },
                    { label: "Created At", field: "created_at", sort: "asc", width: 150 },
                    { label: "Action", field: "action", width: 150 },
                ],

                rows: booking?.data?.map((v, index) => {
                    return {
                        id: (booking.pagination.currentPage - 1) * 10 + index + 1,
                        name: (
                            <div className='art-name-field'>
                                {/* <img
                                    src={v.userDetails?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                                    className='art-profile-image'
                                /> */}
                                <span>{v?.firstName || ""} {v?.lastName || ""} <br /> {v?.email || ""}</span>
                            </div>
                        ),
                        service_name: v?.service_name,
                        amount: (parseFloat(v?.price || 0)).toFixed(2) ? `$${(parseFloat(v?.price || 0)).toFixed(2)}` : "-",
                        training_date: v?.training_date ? moment(v?.training_date + ' ' + v?.training_time).format('DD-MM-YYYY hh:mm A') : '-',
                        status: (
                            <Badge className={`badge-size ${getStatusClass(v?.status)}`}>
                                {formatStatus(v?.status)}
                            </Badge>
                        ),
                        created_at: v?.created_at ? moment(v?.created_at).format('DD-MM-YYYY hh:mm A') : '-',

                        action: (
                            <div className="d-flex gap-2">
                                <a className="fas fa-cog btn btn-warning action-btn" onClick={() => handleStatusChange(v?.id, v?.status)}></a>
                            </div>
                        ),
                    };
                }),
            };

            setCurrentPage(booking?.pagination?.currentPage);
            setTotalPages(booking?.pagination?.totalPages);
            setTotalBookings(booking?.pagination?.totalRecords);
            setData(rowData);

        }
    };

    const handleStatusChange = (bookingId, currentStatus) => {
        window.Swal.fire({
            title: 'Change Training Booking Status',
            input: 'select',
            inputOptions: {
                'pending': 'Pending',
                'cancelled': 'Cancelled',
                'completed': 'Completed',
            },
            inputPlaceholder: 'Select a status',
            showCancelButton: true,
            inputValue: currentStatus,
            confirmButtonText: 'Update Status',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newStatus = result.value;
                const payload = {
                    bookingId: bookingId,
                    status: newStatus
                };
                updateTariningBooking(payload).then((res) => {
                    SuccessAlert(res?.message);
                    fetchBooking(booking?.pagination?.currentPage);
                }).catch((e) => {
                    ErrorAlert(e?.message);
                });
            }
        });
    };

    const _onSearch = () => {
        setData([]);
        fetchBooking(1);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Training Booking" />

                    <Row>
                        <Col className="col-12">

                            <Card>
                                <CardBody>
                                    <Row className='searchrow g-3'>
                                        <Col xl={'4'} lg={'5'}>
                                            <Label>Search</Label>
                                            <Input
                                                type="text"
                                                id="name"
                                                name="untyped-input"
                                                className="form-control"
                                                placeholder="Enter the search text"
                                                value={search}
                                                onChange={(e) => { setSearch(e.target.value) }}
                                            />
                                        </Col>
                                        <Col xl={'3'} lg={'4'}>
                                            <Label>Status Type</Label>
                                            <Select
                                                className="form-control custom-select2"
                                                value={searchStatus}
                                                onChange={(e) => { setSearchStatus(e.target.value) }}
                                                data={status}
                                                options={{
                                                    placeholder: "Select Status Type",
                                                    width: '100%',
                                                }}
                                            />
                                        </Col>
                                        <Col xl={'3'} lg={'4'}>
                                            <Label>Created At</Label>
                                            <Flatpickr
                                                value={searchDate}
                                                onChange={(selectedDates) => setSearchDate(selectedDates)}
                                                options={{
                                                    mode: 'range',
                                                    dateFormat: 'Y-m-d',
                                                    maxDate: 'today',
                                                }}
                                                className="form-control"
                                                placeholder="Select the date"
                                            />
                                        </Col>
                                        <Col xl={'2'} lg={'12'} className='searchBtn d-flex justify-content-end'>
                                            <Button color="success" onClick={() => { _onSearch() }}> Search </Button>
                                            <Button color="warning" onClick={() => { window.location.reload() }}> Clear Search </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Booking List</h4>
                                        <div className="d-flex">
                                            {/* <Button onClick={() => navigate('/artist-add')} color="success" className="waves-effect waves-light d-flex align-items-center gap-2 me-1">
                                                <i className="fas fa-plus font-size-16"></i>
                                                Add New Artist
                                            </Button> */}
                                        </div>
                                    </div>
                                    {
                                        !isLoading ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalBookings}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchBooking(pagenumber) }}
                                            // isLoading={isLoading}
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

export default TrainigBooking;
