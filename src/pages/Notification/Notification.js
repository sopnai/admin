import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, CardTitle, Badge, Button, Modal, ModalBody, ModalHeader, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import Select from 'react-select2-wrapper';
import "./notification.scss";
import { MDBDataTable } from "mdbreact";
import moment from 'moment';
import { connect, useSelector, useDispatch } from "react-redux";
import { getNotification, addNotificationAction, } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import { LoadingBtn } from 'components/Loading/Loading';

const Notification = () => {

    document.title = "Notification | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { notification, isLoading } = useSelector(state => ({
        notification: state.NotificationRD.notification,
        isLoading: state.NotificationRD.isLoading,
    }));

    const [modal_large, setmodal_large] = useState(false);
    const [formData, setFormData] = useState({
        deviceName: "",
        title: "",
        des: "",
    });
    const [pricing, setPricing] = useState([
        { Dtype: '', price: '' }
    ]);

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [data, setData] = useState();
    const [btnLoading, setBtnLoading] = useState(false);

    const [search, setSearch] = useState(null);

    const Dtype = [
        { id: "all", text: "All" },
        { id: "android", text: "Android" },
        { id: "ios", text: "IOS" },
    ];

    useEffect(() => {
        fetchotification(currentPage);
    }, [])

    useEffect(() => {
        updateDataSet();
    }, [notification]);

    const fetchotification = async (pagenumber = currentPage) => {
        const payload = {
            page: pagenumber,
            search: search,
        }
        dispatch(getNotification(payload));
    };

    const updateDataSet = () => {
        if (notification?.notifications) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Device Type", field: "device_type", sort: "asc", width: 150 },
                    { label: "Title", field: "title", sort: "asc", width: 200 },
                    { label: "Description", field: "description", sort: "asc", width: 300 },
                    { label: "Created At", field: "created_at", sort: "asc", width: 200 }
                ],
                rows: notification.notifications.map((n, index) => ({
                    id: (notification?.currentPage - 1) * 10 + index + 1,
                    device_type: n?.device_type?.toUpperCase() || null,
                    title: n.title,
                    description: n.description,
                    created_at: moment(n.created_at).format('DD-MM-YYYY')
                })),
            };

            setCurrentPage(notification?.currentPage);
            setTotalPages(notification?.totalPages);
            setTotalNotifications(notification?.total);
            setData(rowData);
        }
    };


    const handleDtypeChange = (e, index) => {
        const value = e.target.value;
        const updatedPricing = [...pricing];
        updatedPricing[index].Dtype = value;
        setPricing(updatedPricing);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        tog_large();
    };

    const handleAddNotification = async () => {
        if (!pricing[0].Dtype || !formData.title || !formData.des) {
            ErrorAlert("All fields are required!");
            return;
        }

        const payload = {
            device_type: pricing[0].Dtype.toLowerCase(),
            title: formData.title.trim(),
            description: formData.des.trim(),
        };

        setBtnLoading(true);

        try {
            await addNotificationAction(payload)
                .then((res) => {
                    SuccessAlert(res?.message).then(() => {
                        fetchotification();
                        setmodal_large(false);
                        setFormData({ deviceName: "", title: "", des: "" });
                        setPricing([{ Dtype: '', price: '' }]);
                    });
                })
                .catch((e) => {
                    const errorMessage = e?.response?.data?.message || e?.message || "An error occurred.";
                    ErrorAlert(errorMessage);
                })
                .finally(() => {
                    setBtnLoading(false);
                });
        } catch (error) {
            console.error("Error submitting client add:", error);
        }
        setBtnLoading(false);
    };

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };
    const tog_large = () => {
        setmodal_large(!modal_large);
        removeBodyCss();
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnTitle={
                            <>
                                <i className='fas fa-plus me-2'></i>Add Notification
                            </>
                        } breadcrumbItem="All Notification" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="h4 mb-3">Notifications</CardTitle>
                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalNotifications}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchotification(pagenumber) }}
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

                    <Col sm={6} md={4} xl={3}>
                        <Modal isOpen={modal_large} toggle={tog_large} size="lg">
                            <ModalHeader className="mt-0" toggle={tog_large}>Add Notification</ModalHeader>
                            <ModalBody>
                                <Row>

                                    <Col lg={"6"} className="form-group">
                                        <Label>Device Name</Label>
                                        <Select
                                            value={pricing[0].Dtype} // Bind to the first item in the pricing array
                                            onChange={(e) => handleDtypeChange(e, 0)} // Pass the index (0 for the first item)
                                            data={Dtype}
                                            options={{
                                                placeholder: "Select Device Type",
                                                width: '100%',
                                            }}
                                            className="custom-select2"
                                        />
                                    </Col>
                                    <Col lg={"6"} className="form-group">
                                        <Label>Notification Title</Label>
                                        <Input value={formData?.title} type="text" name="title" placeholder='Enter Notification Title' className="form-control" onChange={handleInputChange} />
                                    </Col>
                                    <Col lg={"12"} className="form-group">
                                        <Label>Description</Label>
                                        <textarea
                                            value={formData.des}
                                            name="des"
                                            placeholder="Enter Description"
                                            className="form-control"
                                            onChange={handleInputChange}
                                            rows={4}
                                        />
                                    </Col>


                                    <Col lg={"12"} className=" mt-3 d-flex justify-content-end align-items-center gap-3">
                                        <Button color="primary" className="waves-effect waves-light" onClick={handleAddNotification} disabled={btnLoading}>
                                            {btnLoading ? <LoadingBtn /> : <><i className='fas fa-paper-plane me-2'></i> Send Notification</>}
                                        </Button>

                                        <Button color="secondary" className="waves-effect waves-light" onClick={tog_large}>
                                            Close
                                        </Button>
                                    </Col>

                                </Row>
                            </ModalBody>
                        </Modal>
                    </Col>

                </div>
            </div>
        </React.Fragment>
    );
};

export default Notification;
