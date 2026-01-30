import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Alert, Badge, CardTitle, Button, Modal, ModalBody, ModalHeader, CardImg, CardText, BreadcrumbItem, ModalFooter, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table
} from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import "../Services.scss";
import { ErrorAlert, DeleteAlert, SuccessAlert, ConfirmAlert } from "components/Alert/Alert";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import avatar5 from "../../../assets/images/users/avatar-1.jpg";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { addUpdSubsAction, deleteSubsAction, getSubs } from 'store/actions';
import { LoadingBtn } from 'components/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';

const SubServiceView = () => {

    document.title = "Sub Service View | Flawless Admin Panel";

    const location = useLocation();
    const dispatch = useDispatch();
    const service = location.state?.service;
    const sId = service?.id;
    const currentPage = location.state?.currentPage;
    const servId = location.state?.servId;

    const subServ = useSelector(state => state.SubServRD.subServ[servId] || []);

    useEffect(() => {
        console.log("Received Sub-Service Data:", sId, currentPage, servId);
    }, [service]);

    const [modal_large, setmodal_large] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [data, setData] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        if (servId && currentPage) {
            fetchSubServiceData(currentPage, servId);
        }
    }, [servId, currentPage]);

    useEffect(() => {
        if (subServ) {
            setData(subServ);
            console.log("arrval data", subServ);

        }
    }, [subServ]);

    const fetchSubServiceData = async (pagenumber, serviceId) => {
        const payload = {
            page: pagenumber,
            servId: serviceId
        };

        dispatch(getSubs(payload));
    };

    const matchedSubService = data?.subServices?.find(sub => sub.id === sId);
    const images = matchedSubService?.imgUrls || [];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleSubmit = async () => {

        if (!profileImage) {
            ErrorAlert('Upload the service Image!');
            return false;
        }

        setBtnLoading(true);

        const servData = new FormData();
        servData.append("name", service?.name);
        servData.append("serviceId", service?.serviceId);
        servData.append("imgUrl", profileImage);

        servData.append("actionType", "create");

        try {
            await addUpdSubsAction(servData).then((res) => {
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

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };
    const tog_large = () => {
        setmodal_large(!modal_large);
        removeBodyCss();
    };

    const confirmDelete = async (imageId) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this image?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteSubsAction(imageId)  // Pass the image ID
                    .then((res) => {
                        SuccessAlert(res?.message);
                        fetchSubServiceData(currentPage, servId); // Refresh data after delete
                    })
                    .catch((e) => {
                        ErrorAlert(e);
                    });
            }
        });
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb
                        maintitle={'Dashboard'}
                        title="All Sub-Services"
                        breadcrumbItem="Sub-Service View"
                        handleSubmit={() => { tog_large(); }}
                        isBtn={true}
                        btnTitle={
                            <>
                                <i className="fas fa-plus me-1"></i>Add Image
                            </>}
                    />

                    <Row>

                        <Col md={12}>
                            <Card className="mini-stat">
                                <CardBody>
                                    <div className=" d-flex align-items-center gap-3">
                                        <CardImg
                                            src={service.imgUrls?.length > 0 ? service.imgUrls[0]?.imgUrl : avatar1}
                                            alt="Sub-Service"
                                            className="rounded-circle avatar-md service-images"
                                        />

                                        <h5 className="font-size-20 text-uppercase">
                                            {service?.name || '-'}
                                        </h5>

                                    </div>

                                </CardBody>
                            </Card>
                        </Col>

                    </Row>

                    <Row>
                        {images.map((image, index) => (
                            <Col md={6} lg={4} xl={3} xxl={2} key={index}>
                                <Card className=' border border-secondary'>
                                    <CardImg
                                        top
                                        className="img-fluid rounded"
                                        src={image.imgUrl}
                                        alt={`Card ${index + 1}`}
                                        style={{
                                            height: "250px", // Set a fixed height
                                            width: "100%", // Ensure it takes full width
                                            objectFit: "cover", // Crop to fit without stretching
                                            objectPosition: "top",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setPhotoIndex(index);
                                            setIsOpen(true);
                                        }}
                                    />
                                    <CardBody className="text-center">
                                        <Button color="danger" className="waves-effect waves-light" onClick={() => confirmDelete(image.id)}>
                                            <i className="fas fa-trash me-1"></i> Remove
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {isOpen && (
                        <Lightbox
                            mainSrc={images[photoIndex]?.imgUrl}
                            nextSrc={images[(photoIndex + 1) % images.length]?.imgUrl}
                            prevSrc={images[(photoIndex + images.length - 1) % images.length]?.imgUrl}
                            onCloseRequest={() => setIsOpen(false)}
                            onMovePrevRequest={() =>
                                setPhotoIndex((photoIndex + images.length - 1) % images.length)
                            }
                            onMoveNextRequest={() =>
                                setPhotoIndex((photoIndex + 1) % images.length)
                            }
                        />

                    )}


                    <Col sm={6} md={4} xl={3}>
                        <Modal isOpen={modal_large} toggle={tog_large} size="md">
                            <ModalHeader className="mt-0" toggle={tog_large}>Add Images</ModalHeader>
                            <ModalBody>
                                <Row>

                                    <Col lg={"12"} className="form-group">
                                        <Label>Service Image</Label>
                                        <Input type="file" accept="image/*" name="address" className="form-control" onChange={handleImageChange} />
                                    </Col>


                                    <Col lg={"12"} className=" mt-3 d-flex justify-content-end align-items-center gap-3">
                                        <Button color="primary" className="waves-effect waves-light" onClick={handleSubmit} disabled={btnLoading}>
                                            {btnLoading ? <LoadingBtn /> : <><i className='fas fa-plus me-1'></i> Add Image</>}
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

export default SubServiceView;
