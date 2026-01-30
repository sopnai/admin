import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import {
    Alert, Badge, CardTitle, Button, Modal, ModalBody, ModalHeader, CardImg, CardText, BreadcrumbItem, ModalFooter, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table
} from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import "../Services.scss";
import { MDBDataTable } from "mdbreact";
import { ErrorAlert, DeleteAlert, WarningAlert, SuccessAlert, ConfirmAlert } from "components/Alert/Alert";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import avatar5 from "../../../assets/images/users/avatar-1.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { addUpdSubsAction, deleteSubsAction, getSubs } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { LoadingBtn } from 'components/Loading/Loading';

const SubServices = () => {

    document.title = "Sub Services | Flawless Admin Panel";

    const { servId } = useParams(); // Get servId from URL params
    const dispatch = useDispatch();
    const location = useLocation();
    const subServ = useSelector(state => state.SubServRD.subServ[servId] || []);
    const isLoading = useSelector(state => state.SubServRD.isLoading);

    const [modal_large, setmodal_large] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        sName: "",
        categoryId: "",
        imgUrl: "",
    });

    const [editSubsId, setEditSubsId] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubServ, setTotalSubServ] = useState(0);
    const [data, setData] = useState(null);
    const [subservice_name, setSubServiceName] = useState(null);

    useEffect(() => {
        if (servId && currentPage) {
            fetchSubServiceData(currentPage, servId);
        }
    }, [servId, currentPage]);

    useEffect(() => {
        if (subServ) {
            updateDataSet(subServ);
        }
    }, [subServ]);

    const fetchSubServiceData = async (pagenumber, serviceId) => {
        const payload = {
            page: pagenumber,
            subservice_name: subservice_name,
            servId: serviceId
        };

        dispatch(getSubs(payload));
    };


    const SubsImg = subServ?.service?.imgUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    const SubsName = subServ?.service?.name || "-";

    // artist lvl prices
    const SubsSilver = subServ?.serviceprice?.[0]?.price || "0";
    const SubsGold = subServ?.serviceprice?.[1]?.price || "0";
    const SubsPlat = subServ?.serviceprice?.[2]?.price || "0";
    const SubsElite = subServ?.serviceprice?.[3]?.price || "0";


    const updateDataSet = (subServ) => {
        if (!subServ?.subServices) return; // Ensure subServices exists

        const rowData = {
            columns: [
                { label: "#", field: "id", sort: "asc", width: 50 },
                { label: "Sub-Service Image", field: "subServiceImage", width: 150 },
                { label: "Sub-Service Name", field: "subServiceName", sort: "asc", width: 150 },
                { label: "Action", field: "action", width: 150 },
            ],
            rows: subServ.subServices.map((service, index) => ({
                id: (subServ?.currentPage - 1) * 10 + index + 1,
                subServiceImage: (
                    <CardImg
                        src={service.imgUrls?.[0]?.imgUrl || avatar1} // Get first image from array
                        alt="sub-service"
                        className="rounded-circle avatar-md bg-secondary service-images"
                    />
                ),
                subServiceName: service.name || "-",
                action: (
                    <div className="d-flex gap-2">
                        <Link
                            to={{
                                pathname: "/sub-service-view",
                            }}
                            state={{ service, currentPage, servId, from: location.pathname }} // Store previous path
                        >
                            <span className="btn btn-info action-btn">View Images</span>
                        </Link>

                        <button
                            className="btn btn-success fas fa-edit action-btn"
                            onClick={() => handleEdit(service)}
                        ></button>
                        <button
                            className="btn btn-danger fas fa-trash action-btn"
                            onClick={() => confirmDelete(service.id)}
                        ></button>
                    </div>
                ),
            })),
        };

        setData(rowData);
        setTotalSubServ(subServ.total);
        setTotalPages(subServ?.totalPages);

    };


    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleSubmit = async () => {

        if (!formData?.sName) {
            ErrorAlert('Enter the service name!');
            return false;
        }
        if (!profileImage && !editSubsId) {
            ErrorAlert('Upload the service Image!');
            return false;
        }

        setBtnLoading(true);

        const servData = new FormData();
        servData.append("name", formData.sName);
        servData.append("serviceId", servId);
        servData.append("imgUrl", profileImage);

        if (editSubsId) {
            servData.append("actionType", "update");
            servData.append("subServiceId", editSubsId); // Append ID when editing
        } else {
            servData.append("actionType", "create"); // Create new service
        }

        try {
            await addUpdSubsAction(servData)
                .then((res) => {
                    SuccessAlert(res?.message).then(() => {
                        fetchSubServiceData(currentPage, servId);
                        tog_large();
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

    const handleEdit = (service) => {
        setEditSubsId(service.id);
        setFormData({
            sName: service.name,
            servId: servId,
            imgUrl: service.imgUrl || "",
        });
        tog_large();
    };

    const confirmDelete = async (id) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteSubsAction(id).then((res) => {
                    SuccessAlert(res?.message);
                    fetchSubServiceData(currentPage, servId);
                }).catch((e) => {
                    ErrorAlert(e);
                });
            }
        });
    };

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };
    const tog_large = () => {
        setmodal_large(!modal_large);
        removeBodyCss();
    };

    const handleSearch = () => {
        setData([]);
        fetchSubServiceData(1, servId);
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb
                        maintitle={'Dashboard'}
                        title="Service View"
                        breadcrumbItem="All Sub-Services"
                    // handleSubmit={() => handleSubmit()}
                    // isBtn={true}
                    // btnTitle={'Add New Service'}
                    />

                    <Row>

                        <Col md={12}>
                            <Card className="mini-stat">
                                <CardBody>
                                    <div className="mb-4 d-flex align-items-center gap-3">
                                        <CardImg
                                            src={SubsImg}
                                            alt="veltrix"
                                            className="rounded-circle avatar-md service-images"
                                        />
                                        <h5 className="font-size-20 text-uppercase">
                                            {SubsName}
                                        </h5>

                                    </div>

                                    <Row>
                                        <Col lg={3} className="mt-2">
                                            <Card className="border">
                                                <CardBody>
                                                    <CardTitle className="h4 mt-0">
                                                        Artist Silver Level
                                                    </CardTitle>
                                                    <p className="card-text">
                                                        ${SubsSilver} Price
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={3} className="mt-2">
                                            <Card className="border">
                                                <CardBody>
                                                    <CardTitle className="h4 mt-0">
                                                        Artist Gold Level
                                                    </CardTitle>
                                                    <p className="card-text">
                                                        ${SubsGold} Price
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={3} className="mt-2">
                                            <Card className="border">
                                                <CardBody>
                                                    <CardTitle className="h4 mt-0">
                                                        Artist Platinum Level
                                                    </CardTitle>
                                                    <p className="card-text">
                                                        ${SubsPlat} Price
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={3} className="mt-2">
                                            <Card className="border">
                                                <CardBody>
                                                    <CardTitle className="h4 mt-0">
                                                        Artist Elite Level
                                                    </CardTitle>
                                                    <p className="card-text">
                                                        ${SubsElite} Price
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>

                        </Col>

                    </Row>

                    <Row>
                        <Col lg={12}>

                            <Card>
                                <CardBody>
                                    <Row className='searchrow g-3'>
                                        <Col lg={'8'}>
                                            <Label>Search</Label>
                                            <Input
                                                type="text"
                                                id="search"
                                                name="search"
                                                className="form-control"
                                                placeholder="Search any value"
                                                value={subservice_name}
                                                onChange={(e) => setSubServiceName(e.target.value)}
                                            />
                                        </Col>

                                        <Col lg={'4'} className='searchBtn justify justify-content-end'>
                                            <Button color="success" onClick={() => { handleSearch() }}> Search </Button>
                                            <Button color="warning" onClick={() => { window.location.reload() }}> Clear Search </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>


                            <Card>
                                <CardBody>
                                    <div className='d-flex justify-content-between mb-3'>
                                        <CardTitle className="h4">{SubsName} Sub-Services</CardTitle>
                                        <Button color="warning"
                                            onClick={() => {
                                                setEditSubsId(null);
                                                tog_large();
                                            }}
                                            className="waves-effect waves-light">
                                            <i className="fas fa-plus me-2"></i>
                                            Add New Sub-Service
                                        </Button>
                                    </div>

                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalSubServ}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => setCurrentPage(pagenumber)}
                                                isLoading={isLoading}
                                            />
                                            : <>
                                                <table className="table table-bordered text-center">
                                                    <thead>
                                                        <tr>
                                                            <th>No Data Found</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>There are no records available.</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Col sm={6} md={4} xl={3}>
                        <Modal isOpen={modal_large} toggle={tog_large} size="lg">
                            <ModalHeader className="mt-0" toggle={tog_large}>
                                {editSubsId ? "Edit " : "Add "}
                                {SubsName} Sub-Service</ModalHeader>
                            <ModalBody>
                                <Row>

                                    <Col lg={"6"} className="form-group">
                                        <Label>Sub-Service Name</Label>
                                        <Input value={formData?.sName} type="text" name="sName" placeholder='Enter Service Name' className="form-control" onChange={handleInputChange} />
                                    </Col>
                                    <Col lg={"6"} className="form-group">
                                        <Label>Sub-Service Image</Label>
                                        <Input type="file" accept="image/*" name="address" className="form-control" onChange={handleImageChange} />
                                    </Col>


                                    <Col lg={"12"} className=" mt-3 d-flex justify-content-end align-items-center gap-3">
                                        <Button color="primary" className="waves-effect waves-light" onClick={handleSubmit} disabled={btnLoading}>
                                            {btnLoading ? <LoadingBtn /> :
                                                <>
                                                    {editSubsId ?
                                                        <>
                                                            <i className='fas fa-edit'></i> Edit Sub-Service
                                                        </>
                                                        :
                                                        <>
                                                            <i className='fas fa-plus'></i> Add Sub-Service
                                                        </>}
                                                </>}
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

export default SubServices;
