import React, { useState, useEffect } from 'react';
import Select from 'react-select2-wrapper';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import { connect, useSelector, useDispatch } from "react-redux";
import Flatpickr from 'react-flatpickr';
import moment from 'moment';

import { getArtist, approveArtistAction, deleteArtistAction } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./Artist.scss";

const Artist = () => {

    document.title = "Artist | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { artist, isLoading } = useSelector(state => ({
        artist: state.ArtistRD.artist,
        isLoading: state.ArtistRD.isLoading,
    }));

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalArtists, setTotalArtists] = useState(0);
    const [data, setData] = useState();

    const [search, setSearch] = useState(null);
    const [searchDate, setSearchDate] = useState(null);
    const [searchBusiness, setSearchBusiness] = useState(null);
    const [searchStatus, setSearchStatus] = useState(null);

    const businessTypes = [
        { id: 1, text: "Hair Styles" },
        { id: 2, text: "Makeup Looks" },
        { id: 3, text: "Both" },
    ];

    const status = [
        { id: 0, text: "Disapprove" },
        { id: 1, text: "Approved" },
    ];


    useEffect(() => {
        fetchArtist(currentPage);
    }, []);

    useEffect(() => {
        updateDataSet();
    }, [artist]);

    const fetchArtist = async (pagenumber = currentPage) => {
        const payload = {
            page: pagenumber,
            search: search,
            businessType: searchBusiness,
            status: searchStatus,
            startDate: searchDate ? moment(searchDate[0]).format('YYYY-MM-DD') : null,
            endDate: searchDate ? moment(searchDate[1]).format('YYYY-MM-DD') : null,
        }
        dispatch(getArtist(payload));
    };

    const updateDataSet = () => {
        if (artist?.artists != undefined) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Artist Name", field: "name", sort: "asc", width: 200 },
                    { label: "Phone", field: "phone", sort: "asc", width: 150 },
                    { label: "Business Type", field: "businessType", sort: "asc", width: 200 },
                    { label: "Status", field: "status", sort: "asc", width: 100 },
                    { label: "Created At", field: "createdAt", sort: "asc", width: 150 },
                    { label: "Action", field: "action", width: 150 },
                ],
                rows: artist?.artists?.map((v, index) => ({
                    id: (artist?.pagination?.currentPage - 1) * 10 + index + 1,
                    name: (
                        <div className='art-name-field'>
                            <img
                                src={
                                    v.profileImage && v.profileImage !== "undefined" && v.profileImage.trim() !== ""
                                        ? v.profileImage
                                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
                                }
                                className='art-profile-image'
                                alt="Profile"
                            />
                            {v.firstName || "-"} {v.lastName || ""}
                        </div>
                    ),

                    phone: ('+' + v.countryCode) + ' ' + v.mobile || "-",
                    businessType: v.businessType === 1 ? "Hair Styles" : v.businessType === 2 ? "Makeup Looks" : v.businessType === 3 ? "Both" : "Not Selected",
                    status: (
                        <Badge className={v.isApproved ? "bg-success badge-size" : "bg-danger badge-size"}>
                            {v.isApproved ? "Approved" : "Disapprove"}
                        </Badge>
                    ),
                    createdAt: new Date(v.createdDate).toLocaleDateString(),
                    action: (
                        <div className="d-flex gap-2">
                            <a
                                className={"fas cursor-pointer btn btn-warning waves-effect waves-light text-white " + (v.isApproved ? "fa-lock-open" : "fa-lock")}
                                onClick={() => confirmStatus(v.id, v.isApproved)}
                            ></a>
                            <a
                                className="fas fa-eye btn btn-info action-btn"
                                onClick={() => navigate(`/artist-edit/${v.id}`)}
                            ></a>
                            <a
                                className="fas fa-trash btn btn-danger action-btn"
                                onClick={() => confirmDelete(v.id)}
                            ></a>
                        </div>
                    ),
                })),
            };
            setCurrentPage(artist?.pagination?.currentPage);
            setTotalPages(artist?.pagination?.totalPages);
            setTotalArtists(artist?.pagination?.totalArtists);
            setData(rowData);
        }
    }

    const confirmStatus = (artistId, isApproved) => {
        const statusText = isApproved === 1 ? "Approved" : "Inactive";
        ConfirmAlert({
            title: `Artist Status: ${statusText}`,
            text: `The artist is currently ${statusText}. Would you like to change the status?`,
            confirmButtonText: isApproved === 1 ? 'Mark as Disapprove' : 'Mark as Approved',
            customClassBtn: isApproved === 1 ? 'btn btn-danger' : 'btn btn-success',
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(artistId, isApproved === 1 ? 0 : 1);
            }
        });
    };

    const updateStatus = async (artistId, newStatus) => {
        await approveArtistAction({
            "artistId": artistId,
            "status": newStatus
        }).then((res) => {
            SuccessAlert(res?.message);
            fetchArtist(artist?.pagination?.currentPage);
        }).catch((e) => {
            ErrorAlert(e);
        });
    };

    const confirmDelete = async (id) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteArtistAction(id).then((res) => {
                    SuccessAlert(res?.message);
                    fetchArtist(artist?.pagination?.currentPage);
                }).catch((e) => {
                    ErrorAlert(e);
                });
            }
        });
    };

    const _onSearch = () => {
        setData([]);
        fetchArtist(1);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Artist" />

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <Row className='searchrow g-3'>
                                        <Col xl={'3'} lg={'6'}>
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
                                        <Col xl={'3'} lg={'6'}>
                                            <Label>Business Type</Label>
                                            <Select
                                                className="form-control custom-select2"
                                                value={searchBusiness}
                                                onChange={(e) => { setSearchBusiness(e.target.value) }}
                                                data={businessTypes}
                                                options={{
                                                    placeholder: "Select Business Type",
                                                    width: '100%',
                                                }}
                                            />
                                        </Col>

                                        <Col xl={'3'} lg={'6'}>
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
                                        <Col xl={'3'} lg={'6'}>
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
                                        <Col lg={'12'} className='searchBtn d-flex justify-content-end'>
                                            <Button color="success" onClick={() => { _onSearch() }}> Search </Button>
                                            <Button color="warning" onClick={() => { window.location.reload() }}> Clear Search </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Artist List</h4>
                                        <div className="d-flex">
                                            <Button onClick={() => navigate('/artist-add')} color="success" className="waves-effect waves-light d-flex align-items-center gap-2 me-1">
                                                <i className="fas fa-plus font-size-16"></i>
                                                Add New Artist
                                            </Button>
                                        </div>
                                    </div>
                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalArtists}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchArtist(pagenumber) }}
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

export default Artist;
