import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import { Alert, Button, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import "./Client.scss";

import Breadcrumb from 'components/Common/Breadcrumb';
import { getClient, approveClientAction, deleteClientAction } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';

const Client = () => {

    document.title = "Client | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { client, isLoading } = useSelector(state => ({
        client: state.ClientRD.client,
        isLoading: state.ClientRD.isLoading,
    }));

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalClients, setTotalClients] = useState(0);
    const [data, setData] = useState();

    const [search, setSearch] = useState(null);
    const [searchDate, setSearchDate] = useState(null);


    useEffect(() => {
        fetchClient(currentPage);
    }, []);

    useEffect(() => {
        updateDataSet();
    }, [client]);

    const fetchClient = async (pagenumber = currentPage) => {
        const payload = {
            page: pagenumber,
            search: search,
            startDate: searchDate ? moment(searchDate[0]).format('YYYY-MM-DD') : null,
            endDate: searchDate ? moment(searchDate[1]).format('YYYY-MM-DD') : null,
        }
        dispatch(getClient(payload));
    };

    const updateDataSet = () => {
        if (client?.users !== undefined) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Client Name", field: "name", sort: "asc", width: 200 },
                    { label: "Phone", field: "phone", sort: "asc", width: 150 },
                    { label: "Email", field: "email", sort: "asc", width: 200 },
                    { label: "Created At", field: "createdAt", sort: "asc", width: 150 },
                    { label: "Action", field: "action", width: 150 },
                ],
                rows: client?.users?.map((user, index) => ({
                    id: (client?.pagination?.currentPage - 1) * 10 + index + 1,
                    name: (
                        <div className='client-name-field'>
                            <img src={user.profileImage ? user.profileImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'} className='client-profile-image' />
                            {user.firstName || "-"} {user.lastName || ""}
                        </div>
                    ),
                    phone: ('+' + user.countryCode) + ' ' + user.phone || "-",
                    email: user.email || "-",
                    createdAt: new Date(user.createdDate).toLocaleDateString(),
                    action: (
                        <div className="d-flex gap-2">
                            <a
                                className="btn btn-success fas fa-edit action-btn"
                                onClick={() => navigate(`/client-edit/${user.id}`)}
                            ></a>
                            <a
                                className="btn btn-danger fas fa-trash action-btn"
                                onClick={() => confirmDelete(user.id)}
                            ></a>
                        </div>
                    ),
                })),
            };
            setCurrentPage(client?.pagination?.currentPage);
            setTotalPages(client?.pagination?.totalPages);
            setTotalClients(client?.pagination?.totalUsers);
            setData(rowData);
        }
    };

    const confirmDelete = async (id) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteClientAction(id).then((res) => {
                    SuccessAlert(res?.message);
                    fetchClient(client?.pagination?.currentPage);
                }).catch((e) => {
                    ErrorAlert(e);
                });
            }
        });
    };

    const handleSearch = () => {
        setData([]);
        fetchClient(1);
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Client" />



                    <Row>
                        <Col className="col-12">

                            <Card>
                                <CardBody>
                                    <Row className='searchrow g-3'>
                                        <Col xl={'5'} lg={'6'}>
                                            <Label>Search</Label>
                                            <Input
                                                type="text"
                                                id="search"
                                                name="search"
                                                className="form-control"
                                                placeholder="Search any value"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </Col>

                                        <Col xl={'4'} lg={'6'}>
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
                                                placeholder="Select start/end date"
                                            />
                                        </Col>

                                        <Col xl={'3'} lg={'12'} className='searchBtn justify justify-content-end'>
                                            <Button color="success" onClick={() => { handleSearch() }}> Search </Button>
                                            <Button color="warning" onClick={() => { window.location.reload() }}> Clear Search </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>

                                    <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Client List</h4>
                                        <div className="d-flex">
                                            {/* <Button color="info" className="waves-effect waves-light me-1 d-flex gap-2 align-items-center">
                                                Import
                                                <i className="fas fa-download font-size-16"></i>
                                            </Button>
                                            <Button color="primary" className="waves-effect waves-light me-1 d-flex gap-2 align-items-center">
                                                Export
                                                <i className="fas fa-upload font-size-16"></i>
                                            </Button> */}
                                            <Button onClick={() => navigate('/client-add')} color="success" className="waves-effect waves-light d-flex align-items-center gap-2 me-1">
                                                <i className="fas fa-plus font-size-16"></i>
                                                Add New Client
                                            </Button>
                                        </div>
                                    </div>

                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalClients}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchClient(pagenumber) }}
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

export default Client;
