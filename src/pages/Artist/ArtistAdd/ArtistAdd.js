import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Alert, Button, BreadcrumbItem, Card, CardImg, CardBody, Col, Modal, ModalBody, ModalHeader, Container, Dropdown, DropdownItem, CardTitle, Form, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Select from 'react-select2-wrapper';
import { connect, useSelector, useDispatch } from "react-redux";

import { getSingleArtistAction, addArtistAction } from "store/actions";
import { ErrorAlert, SuccessAlert, ConfirmAlert, DeleteAlert } from "components/Alert/Alert";
import Breadcrumb from "components/Common/Breadcrumb";
import Lightbox from 'react-image-lightbox';
import { LoadingBtn } from "components/Loading/Loading";

const ArtistAdd = () => {

    document.title = "Add Artist | Flawless Admin Panel";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [selectedBusinessType, setSelectedBusinessType] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [portfolioImage, setPortfolioImage] = useState(null);
    const [modal_large, setmodal_large] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [portfolio, setPortfolio] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "",
        address: "",
        businessType: "",
        videoUrl: "",
        isApproved: "",
        facebook: "",
        licenceUrl: "",
        sin: "",
        instagram: "",
    });
    const [addressData, setAddressData] = useState([
        { state: '', city: '', pincode: '', geocode: '', street: '', isdefault: 0 }
    ]);

    const businessTypes = [
        { id: 1, text: "Hair Styles" },
        { id: 2, text: "Makeup Looks" },
        { id: 3, text: "Both" },
    ];

    const status = [
        { id: 0, text: "Disapprove" },
        { id: 1, text: "Approved" },
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "sin" && value.length > 9) {
            return;
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleBusinessTypeChange = (e) => {
        setSelectedBusinessType(e.target.value);
        setFormData((prevState) => ({
            ...prevState,
            businessType: e.target.value,
        }));
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(Number(e.target.value));
        setFormData((prevState) => ({
            ...prevState,
            isApproved: e.target.value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };
    const handlePortfolioImageChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 25 * 1024 * 1024; // 25MB in bytes

        const validFiles = [];
        for (const file of files) {
            if (file.size > maxSize) {
                ErrorAlert(`"${file.name}" exceeds the 25MB limit. Please select a smaller file.`);
            } else {
                validFiles.push({
                    id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
                    URL: URL.createObjectURL(file), // Create preview URL
                    file,
                });
            }
        }

        if (validFiles.length > 0) {
            setPortfolio((prevPortfolio) => [...prevPortfolio, ...validFiles]);
        }
    };


    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // const validatePhone = (phone) => {
    //     const regex = /^\d{10}$/;
    //     return regex.test(phone);
    // };

    const validateSSN = (ssn) => {
        const regex = /^\d{9}$/;
        return regex.test(ssn);
    };


    const handleSubmit = async () => {
        if (!formData?.firstName) {
            ErrorAlert('Enter the first name!');
            return false;
        }
        if (!formData?.lastName) {
            ErrorAlert('Enter the last name!');
            return false;
        }
        if (!formData?.licenceUrl) {
            ErrorAlert('Enter the licence URL!');
            return false;
        }
        if (!formData?.sin || !validateSSN(formData?.sin)) {
            ErrorAlert('Enter a valid 9-digit SSN number!');
            return false;
        }
        if (!formData?.facebook) {
            ErrorAlert('Enter a valid Facebook URL!');
            return false;
        }
        if (!formData?.instagram) {
            ErrorAlert('Enter a valid Instagram URL!');
            return false;
        }
        if (!formData?.email || !validateEmail(formData?.email)) {
            ErrorAlert('Enter a valid email address!');
            return false;
        }
        if (!formData?.mobile) {
            ErrorAlert('Enter a valid phone number!');
            return false;
        }
        if (!formData?.countryCode) {
            ErrorAlert('Enter the Country code!');
            return false;
        }
        if (!selectedBusinessType) {
            ErrorAlert("Please select a business type.");
            return;
        }
        if (portfolio.length === 0) {
            ErrorAlert("Please add portfolio images of your past work.");
            return;
        }
        const hasDefaultAddress = addressData.some(address => address.isdefault === 1);
        if (!hasDefaultAddress) {
            ErrorAlert('Please select a default address!');
            return false;
        }
        for (const address of addressData) {
            if (!address.state.trim()) {
                ErrorAlert('State is required in the address!');
                return false;
            }
            if (!address.city.trim()) {
                ErrorAlert('City is required in the address!');
                return false;
            }
            // if (!address.pincode.trim()) {
            //     ErrorAlert('Pincode is required in the address!');
            //     return false;
            // }
            // if (!/^\d{5,6}$/.test(address.pincode.trim())) {
            //     ErrorAlert('Enter a valid 5 or 6-digit pincode!');
            //     return false;
            // }
            // if (!address.street.trim()) {
            //     ErrorAlert('Street is required in the address!');
            //     return false;
            // }
        }
        setBtnLoading(true);

        try {
            let data = new FormData();
            data.append('firstName', formData?.firstName);
            data.append('lastName', formData?.lastName);
            data.append('email', formData?.email);
            data.append('businessType', formData?.businessType);
            data.append('mobile', formData?.mobile);
            data.append('address', formData?.address);
            data.append('videoUrl', formData?.videoUrl);
            data.append('countryCode', formData?.countryCode);
            // data.append('isApproved', formData?.isApproved || 0);
            data.append('facebook', formData?.facebook);
            data.append('licenceUrl', formData?.licenceUrl);
            data.append('instagram', formData?.instagram);
            data.append('sin', formData?.sin);
            data.append('addresses', JSON.stringify(addressData));
            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            // Append portfolio images
            portfolio.forEach((image, index) => {
                if (image.file) {
                    data.append(`images[]`, image.file);
                }
            });

            await addArtistAction(data).then((res) => {
                SuccessAlert(res?.message).then(() => {
                    navigate("/artist");
                });
            }).catch((e) => {
                const errorMessage = e?.response?.data?.message || e?.message || "An error occurred.";
                ErrorAlert(errorMessage);
            })
        } catch (error) {
            console.error("Error submitting artist status:", error);
        }
        setBtnLoading(false);
    };

    const confirmDeleteImg = (imageId) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then((result) => {
            if (result.isConfirmed) {
                setPortfolio((prevPortfolio) => prevPortfolio.filter((img) => img.id !== imageId));
                SuccessAlert("Image deleted successfully!");
            }
        });
    };

    const handleDefaultAddressChange = (i) => {
        setAddressData((prevAddresses) =>
            prevAddresses.map((address, ii) => i === ii ? { ...address, isdefault: 1 } : { ...address, isdefault: 0 })
        );
    }

    const handleDeleteAddress = (index) => {
        ConfirmAlert({
            title: 'Delete Address',
            text: 'Are you sure you want to delete this address?',
            confirmButtonText: 'Yes, Delete',
            customClassBtn: 'btn btn-danger',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedAddresses = addressData.filter((_, i) => i !== index);
                setAddressData(updatedAddresses);
                SuccessAlert('Address deleted successfully!');
            }
        }).catch(() => {
            ErrorAlert('Failed to delete address!');
        });
    }

    const handleAddAddress = () => {
        const newAddress = {
            state: '',
            city: '',
            pincode: '',
            geocode: '',
            street: '',
            isdefault: 0,
        };
        setAddressData((prevState) => ([...prevState, newAddress]));
    };

    const handleInputChangeAddress = (e, i) => {
        const { name, value } = e.target;
        setAddressData((prevAddresses) =>
            prevAddresses.map((address, index) =>
                index === i ? { ...address, [name]: value } : address
            )
        );
    };

    const isValidUrl = (url) => {
        try {
            return url && new URL(url);
        } catch (error) {
            return false;
        }
    };

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };
    const tog_large = () => {
        setmodal_large(!modal_large);
        setPortfolioImage(null);
        removeBodyCss();
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb
                        maintitle={'Dashboard'}
                        title="All Artist"
                        titleLink="/artist"
                        breadcrumbItem="Add Artist"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                <i className="fas fa-plus me-1"></i> Add Artist Details
                            </>
                        }
                    />

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">First Name</Label>
                                            <Input value={formData?.firstName} type="text" name="firstName" placeholder="Enter First Name" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Last Name</Label>
                                            <Input value={formData?.lastName} type="text" name="lastName" placeholder="Enter Last Name" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Email</Label>
                                            <Input value={formData?.email} type="text" name="email" placeholder="Enter Email Id" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"1"} lg={"2"} className="form-group">
                                            <Label className="req-lab">Country</Label>
                                            <Input value={formData?.countryCode} type="number" name="countryCode" placeholder="Code" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"3"} lg={"4"} className="form-group">
                                            <Label className="req-lab">Mobile</Label>
                                            <Input value={formData?.mobile} type="number" name="mobile" placeholder="Enter Mobile Number" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Licence Url</Label>
                                            <div className="input-group has-validation">
                                                <Input
                                                    value={formData?.licenceUrl || ''}
                                                    type="text"
                                                    name="licenceUrl"
                                                    className="form-control"
                                                    placeholder="Enter Licence URL"
                                                    onChange={handleInputChange}
                                                />
                                                {formData?.licenceUrl && isValidUrl(formData.licenceUrl) ? (
                                                    <a
                                                        href={formData.licenceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="input-group-text"
                                                        id="inputGroupPrepend"
                                                    >
                                                        <i className="ti-image me-2"></i> View
                                                    </a>
                                                ) : (
                                                    <span className="input-group-text text-danger" id="inputGroupPrepend">
                                                        Invalid URL
                                                    </span>
                                                )}
                                            </div>
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label>Video Url</Label>
                                            <div className="input-group has-validation">
                                                <Input
                                                    value={formData?.videoUrl || ''}
                                                    type="text"
                                                    name="videoUrl"
                                                    className="form-control"
                                                    placeholder="Enter Video URL"
                                                    onChange={handleInputChange}
                                                />
                                                {formData?.videoUrl && isValidUrl(formData?.videoUrl) ? (
                                                    <a
                                                        href={formData?.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="input-group-text"
                                                        id="inputGroupPrepend"
                                                    >
                                                        <i className="fas fa-video me-2"></i> View
                                                    </a>
                                                ) : (
                                                    <span className="input-group-text text-danger" id="inputGroupPrepend">
                                                        Invalid URL
                                                    </span>
                                                )}
                                            </div>
                                        </Col>

                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">SSN</Label>
                                            <Input value={formData?.sin} type="number" name="sin" maxLength="9" placeholder="Enter SSN" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Facebook</Label>
                                            <Input value={formData?.facebook} type="text" name="facebook" placeholder="Enter Facebook URL" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Instagram</Label>
                                            <Input value={formData?.instagram} type="text" name="instagram" placeholder="Enter Instragram URL" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col xl={'4'} lg={'6'} className="form-group">
                                            <Label className="req-lab">Business Type</Label>
                                            <Select
                                                value={selectedBusinessType}
                                                onChange={handleBusinessTypeChange}
                                                data={businessTypes}
                                                options={{
                                                    placeholder: "Select Business Type",
                                                    width: '100%',
                                                }}
                                                className="custom-select2"
                                            />
                                        </Col>
                                        {/* <Col xl={'4'} lg={'6'} className="form-group">
                                            <Label>Active Status</Label>
                                            <Select
                                                value={selectedStatus}
                                                onChange={handleStatusChange}
                                                data={status}
                                                options={{
                                                    placeholder: "Select Active Status",
                                                    width: '100%',
                                                }}
                                                className="custom-select2"
                                            />
                                        </Col> */}
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label>Profile Image</Label>
                                            <Input type="file" name="address" accept="image/*" className="form-control" onChange={handleImageChange} />
                                            {
                                                formData?.profileImage ?
                                                    <div className="mt-2"><a href={formData?.profileImage} target="_blank">Last Uploaded Profile Image</a></div> : null
                                            }
                                        </Col>

                                        <Col lg={"12"} className="form-group">
                                            <Label>Address</Label>
                                            <textarea value={formData?.address} type="text" name="address" placeholder="Enter Address" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>

                    <Row className="evaddressTitle my-3">
                        <Col>
                            <h4>Address List</h4>
                        </Col>
                        <Col>
                            <Button color="warning" onClick={() => handleAddAddress()}>
                                <i className="fas fa-plus me-1"></i> Add New Address
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                addressData?.map((v, i) => {
                                    return (
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    <Col className="col-12" key={i}>
                                                        <Card>
                                                            <CardBody>
                                                                <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                                                                    <h5>{`Address ${i + 1}`}</h5>
                                                                    <span>
                                                                        Default Address
                                                                        <Input
                                                                            style={{ cursor: "pointer" }}
                                                                            type="checkbox"
                                                                            className="ms-2 success"
                                                                            checked={v.isdefault === 1}
                                                                            onChange={() => handleDefaultAddressChange(i)}
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <Row>
                                                                    <Col lg={'4'} className="form-group">
                                                                        <Label>State</Label>
                                                                        <Input
                                                                            value={v.state || ''}
                                                                            type="text"
                                                                            name="state"
                                                                            className="form-control"
                                                                            placeholder="Enter State"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={'4'} className="form-group">
                                                                        <Label>City</Label>
                                                                        <Input
                                                                            value={v.city || ''}
                                                                            type="text"
                                                                            name="city"
                                                                            className="form-control"
                                                                            placeholder="Enter City"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={'4'} className="form-group">
                                                                        <Label>PIN Code</Label>
                                                                        <Input
                                                                            value={v.pincode || ''}
                                                                            type="number"
                                                                            name="pincode"
                                                                            className="form-control"
                                                                            placeholder="Enter PIN Code"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={'4'} className="form-group">
                                                                        <Label>GEO Code</Label>
                                                                        <Input
                                                                            value={v.geocode || ''}
                                                                            type="text"
                                                                            name="geocode"
                                                                            className="form-control"
                                                                            placeholder="Enter GEO Code"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={'8'} className="form-group">
                                                                        <Label>Street Address</Label>
                                                                        <Input
                                                                            value={v.street || ''}
                                                                            type="text"
                                                                            name="street"
                                                                            className="form-control"
                                                                            placeholder="Enter Street Address"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col>
                                                                    <Col lg={'4'} className="form-group mb-0">
                                                                        <Button color="danger" className="waves-effect waves-light" onClick={() => handleDeleteAddress(i)}>
                                                                            <i className="fas fa-trash me-1"></i> Remove Address
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    )
                                })
                            }
                        </Col>
                    </Row>

                    <Row className="evaddressTitle my-3">
                        <Col>
                            <h4>Artist Portfolio</h4>
                        </Col>
                        <Col>
                            <Button color="warning" onClick={() => fileInputRef.current.click()}>
                                <i className="fas fa-plus me-1"></i> Add New Image
                            </Button>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handlePortfolioImageChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>

                            <Card>
                                <CardBody>
                                    <Row>
                                        {portfolio.length > 0 ? (
                                            portfolio.map((image, index) => (
                                                <Col sm={6} md={4} lg={4} xl={3} xxl={2} key={index}>
                                                    <Card className=" border border-secondary">
                                                        <CardImg
                                                            top
                                                            className="img-fluid rounded"
                                                            src={image.URL}
                                                            alt={`Card ${index + 1}`}
                                                            style={{
                                                                height: "250px",
                                                                width: "100%",
                                                                objectFit: "cover",
                                                                objectPosition: "top",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                setPhotoIndex(index);
                                                                setIsOpen(true);
                                                            }}
                                                        />
                                                        <CardBody className="text-center">
                                                            <Button color="danger" className="waves-effect waves-light" onClick={() => confirmDeleteImg(image.id)}>
                                                                <i className="fas fa-trash me-1"></i> Remove
                                                            </Button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <p className="text-center mb-0">No images available</p>
                                        )}
                                    </Row>

                                    {isOpen && portfolio.length > 0 && (
                                        <Lightbox
                                            mainSrc={portfolio[photoIndex].URL}
                                            nextSrc={portfolio[(photoIndex + 1) % portfolio.length].URL}
                                            prevSrc={portfolio[(photoIndex + portfolio.length - 1) % portfolio.length].URL}
                                            onCloseRequest={() => setIsOpen(false)}
                                            onMovePrevRequest={() =>
                                                setPhotoIndex((photoIndex + portfolio.length - 1) % portfolio.length)
                                            }
                                            onMoveNextRequest={() =>
                                                setPhotoIndex((photoIndex + 1) % portfolio.length)
                                            }
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </React.Fragment>
    );
};

export default ArtistAdd;
