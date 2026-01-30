import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Alert, CardImg, Button, Badge, BreadcrumbItem, Card, Modal, ModalBody, ModalHeader, CardBody, Col, Container, Dropdown, DropdownItem, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane, Form, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Breadcrumb from "components/Common/Breadcrumb";
import 'react-image-lightbox/style.css';
import { MDBDataTable } from "mdbreact";
import { ErrorAlert, WarningAlert, SuccessAlert, DeleteAlert } from "components/Alert/Alert";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { getCat, addUpdCatAction, deleteCatAction } from "store/actions";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "components/Datatable/DataTable";
import { LoadingBtn } from "components/Loading/Loading";


const ServiceView = () => {

    document.title = "Service View | Flawless Admin Panel";

    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const categoryData = useSelector(state => state.CatRD.categories[categoryId]);
    const isLoading = useSelector(state => state.CatRD.isLoading);

    const [modal_large, setmodal_large] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const [btnLoading, setBtnLoading] = useState(false);

    const [formData, setFormData] = useState({
        sName: "",
        categoryId: "",
        imgUrl: "",
        artistlevelId1: "Silver",
        artistlevelId2: "Gold",
        artistlevelId3: "Platinum",
        artistlevelId4: "Elite",
        price1: "",
        price2: "",
        price3: "",
        price4: "",
    });

    const [editServiceId, setEditServiceId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalServ, setTotalServ] = useState(0);
    const [data, setData] = useState(null);
    const [service_name, setServiceName] = useState(null);

    useEffect(() => {
        if (categoryId && currentPage) {
            fetchCategoryData(currentPage, categoryId);
        }
    }, [categoryId, currentPage]);

    useEffect(() => {
        if (categoryData) {
            updateDataSet(categoryData);
        }
    }, [categoryData]);

    const fetchCategoryData = async (pagenumber, categoryId) => {
        const payload = {
            page: pagenumber,
            service_name: service_name,
            categoryId: categoryId
        };

        dispatch(getCat(payload));
    };

    const updateDataSet = (categoryData) => {
        if (!categoryData || !categoryData.services) return;

        const rowData = {
            columns: [
                { label: "#", field: "id", sort: "asc", width: 50 },
                { label: "Service Image", field: "serviceImage", width: 150 },
                { label: "Service Name", field: "serviceName", sort: "asc", width: 150 },
                { label: "Total Sub-Services", field: "totalSubServices", sort: "asc", width: 100 },
                { label: "Artist Silver", field: "artistSilver", sort: "asc", width: 100 },
                { label: "Artist Gold", field: "artistGold", sort: "asc", width: 100 },
                { label: "Artist Platinum", field: "artistPlatinum", sort: "asc", width: 100 },
                { label: "Artist Elite", field: "artistElite", sort: "asc", width: 100 },
                { label: "Action", field: "action", width: 150 },
            ],
            rows: categoryData.services.map((service, index) => ({
                id: (categoryData?.pagination?.currentPage - 1) * 10 + index + 1,
                serviceImage: (
                    <CardImg
                        src={service.imgUrl || avatar1}
                        alt="service"
                        className="rounded-circle avatar-md bg-secondary service-images"
                    />
                ),
                serviceName: service.name || "-",
                totalSubServices: service.servicecategories?.length || "0",
                artistSilver: service.pricing?.find(p => p.artistlevelId === 1)?.price ? `$${service.pricing.find(p => p.artistlevelId === 1).price}` : "-",
                artistGold: service.pricing?.find(p => p.artistlevelId === 2)?.price ? `$${service.pricing.find(p => p.artistlevelId === 2).price}` : "-",
                artistPlatinum: service.pricing?.find(p => p.artistlevelId === 3)?.price ? `$${service.pricing.find(p => p.artistlevelId === 3).price}` : "-",
                artistElite: service.pricing?.find(p => p.artistlevelId === 4)?.price ? `$${service.pricing.find(p => p.artistlevelId === 4).price}` : "-",
                action: (
                    <div className="d-flex gap-2">
                        <Link to={`/sub-services/${service.id}`} state={{ service, from: location.pathname }}>
                            <i className="btn btn-info fas fa-eye action-btn"></i>
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
        setTotalServ(categoryData?.pagination?.totalService);
        setTotalPages(categoryData?.pagination?.totalPages);
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
        if (!profileImage && !editServiceId) {
            ErrorAlert('Upload the service Image!');
            return false;
        }
        if (!formData?.price1 || !formData?.price2 || !formData?.price3 || !formData?.price4) {
            ErrorAlert('Enter all artist level price!');
            return false;
        }

        setBtnLoading(true);

        const servData = new FormData();
        servData.append("name", formData.sName);
        servData.append("categoryId", categoryId);
        servData.append("imgUrl", profileImage);

        const pricingData = [
            { artistlevelId: 1, price: formData.price1 },
            { artistlevelId: 2, price: formData.price2 },
            { artistlevelId: 3, price: formData.price3 },
            { artistlevelId: 4, price: formData.price4 }
        ];
        servData.append("pricing", JSON.stringify(pricingData));

        if (editServiceId) {
            servData.append("actionType", "update");
            servData.append("serviceId", editServiceId);
        } else {
            servData.append("actionType", "create");
        }

        try {
            await addUpdCatAction(servData)
                .then((res) => {
                    SuccessAlert(res?.message).then(() => {
                        fetchCategoryData(currentPage, categoryId);
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
        setEditServiceId(service.id);
        setFormData({
            sName: service.name,
            categoryId: categoryId,
            imgUrl: service.imgUrl || "",
            artistlevelId1: "Silver",
            artistlevelId2: "Gold",
            artistlevelId3: "Platinum",
            artistlevelId4: "Elite",
            price1: service.pricing?.find(p => p.artistlevelId === 1)?.price || "",
            price2: service.pricing?.find(p => p.artistlevelId === 2)?.price || "",
            price3: service.pricing?.find(p => p.artistlevelId === 3)?.price || "",
            price4: service.pricing?.find(p => p.artistlevelId === 4)?.price || "",
        });
        tog_large();
    };

    const confirmDelete = async (id) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteCatAction(id).then((res) => {
                    SuccessAlert(res?.message);
                    fetchCategoryData(currentPage, categoryId);
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
        fetchCategoryData(categoryId, 1);
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb
                        maintitle={'Dashboard'}
                        title="All Services"
                        breadcrumbItem="Service View"
                        handleSubmit={() => {
                            setEditServiceId(null); // Reset edit mode
                            setFormData({ sName: "", price1: "", price2: "", price3: "", price4: "" }); // Clear form
                            tog_large();
                        }}
                        isBtn={true}
                        btnTitle={
                            <>
                                <i className="fas fa-plus me-1"></i>Add New Service
                            </>
                        }
                    />

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
                                                value={service_name}
                                                onChange={(e) => setServiceName(e.target.value)}
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
                                    <CardTitle className="h4 mb-4">{categoryId === "2" ? "Makeup Looks" : "Hair Styles"} Services</CardTitle>
                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalServ}
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
                                {editServiceId ? "Edit " : "Add "}
                                {categoryId === "2" ? "Makeup Looks" : "Hair Styles"} Service</ModalHeader>
                            <ModalBody>
                                <Row>

                                    <Col lg={"6"} className="form-group">
                                        <Label>Service Name</Label>
                                        <Input value={formData?.sName} type="text" name="sName" placeholder='Enter Service Name' className="form-control" onChange={handleInputChange} />
                                    </Col>
                                    <Col lg={"6"} className="form-group">
                                        <Label>Service Image</Label>
                                        <Input type="file" name="address" accept="image/*" className="form-control" onChange={handleImageChange} />
                                    </Col>

                                    <Col lg={'6'} className="form-group">
                                        <Label>Artist Level</Label>
                                        <Col lg={"12"} className="form-group">
                                            <Input value={"Silver"} type="text" name="artistlevelId1" className="form-control" disabled />
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <Input value={"Gold"} type="text" name="artistlevelId2" className="form-control" disabled />
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <Input value={"Platinum"} type="text" name="artistlevelId3" className="form-control" disabled />
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <Input value={"Elite"} type="text" name="artistlevelId4" className="form-control" disabled />
                                        </Col>
                                    </Col>

                                    <Col lg={"6"} className="form-group">
                                        <Label>Price</Label>
                                        <Col lg={"12"} className="form-group">
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price1} type="number" name="price1" placeholder='Enter Price' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price2} type="number" name="price2" placeholder='Enter Price' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price3} type="number" name="price3" placeholder='Enter Price' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price4} type="number" name="price4" placeholder='Enter Price' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>
                                    </Col>

                                    <Col lg={"12"} className=" mt-3 d-flex justify-content-end align-items-center gap-3">
                                        <Button color="primary" className="waves-effect waves-light" onClick={handleSubmit} disabled={btnLoading}>
                                            {btnLoading ? <LoadingBtn /> :
                                                <>
                                                    {editServiceId ?
                                                        <>
                                                            <i className='fas fa-edit'></i> Edit Service
                                                        </>
                                                        :
                                                        <>
                                                            <i className='fas fa-plus'></i> Add Service
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

export default ServiceView;
