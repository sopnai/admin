import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Alert, Button, BreadcrumbItem, Card, CardImg, CardBody, Col, Modal, ModalBody, ModalHeader, Container, Dropdown, DropdownItem, CardTitle, Form, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Select from 'react-select2-wrapper';
import Dropzone from "react-dropzone";
import { connect, useSelector, useDispatch } from "react-redux";

import { addArtistImgAction, deleteArtistAction, deleteArtistImgAction, getSingleArtistAction, updateArtistAction, getArtistLvl } from "store/actions";
import { ErrorAlert, SuccessAlert, ConfirmAlert, DeleteAlert } from "components/Alert/Alert";
import Breadcrumb from "components/Common/Breadcrumb";
import Lightbox from 'react-image-lightbox';
import { LoadingBtn } from "components/Loading/Loading";

const ArtistEdit = () => {

    document.title = "Update Artist | Flawless Admin Panel";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { singleart, artistLvl } = useSelector(state => ({
        singleart: state.ArtistRD.singleart,
        artistLvl: state.ArtistLvlRD.artistLvl,
    }));
    const { id } = useParams();

    const [selectedBusinessType, setSelectedBusinessType] = useState(null);
    const [selectedArtistType, setSelectedArtistType] = useState(null);
    const [listArtistType, setListArtistType] = useState([
        { text: "Silver" },
        { text: "Gold" },
        { text: "Platinum" },
        { text: "Elite" },
    ]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [formData, setFormData] = useState();
    const [addressData, setAddressData] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [portfolioImage, setPortfolioImage] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [modal_large, setmodal_large] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [portfolio, setPortfolio] = useState([]);

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
        dispatch(getSingleArtistAction(id));
        dispatch(getArtistLvl());
    }, [id]);

    useEffect(() => {
        if (singleart) {
            setFormData(singleart?.artist);
            setAddressData(singleart?.addresses);
            setSelectedBusinessType(singleart?.artist?.businessType);
            setSelectedStatus(singleart?.artist?.isApproved);
            setPortfolio(singleart?.artist?.images);
            setSelectedArtistType(singleart?.artist?.level);
        }
        return () => {
            dispatch({ type: 'SINGLE_ARTIST', payload: null });
        }
    }, [singleart]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "sin" && value.length > 9) return;
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

    const validateURL = (url) => {
        const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
        return regex.test(url);
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
        if (!formData?.sin || !validateSSN(formData?.sin)) {
            ErrorAlert('Enter a valid 9-digit SSN number!');
            return false;
        }
        // if (!formData?.facebook) {
        //     ErrorAlert('Enter a valid Facebook URL!');
        //     return false;
        // }
        // if (!formData?.instagram) {
        //     ErrorAlert('Enter a valid Instagram URL!');
        //     return false;
        // }
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
        if (!addressData.length > 0) {
            ErrorAlert('Enter the Address details!');
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
            data.append('level', selectedArtistType);
            data.append('facebook', formData?.facebook);
            data.append('licenceUrl', formData?.licenceUrl);
            data.append('instagram', formData?.instagram);
            data.append('sin', formData?.sin);
            data.append('addresses', JSON.stringify(addressData));
            if (profileImage) {
                data.append('profileImage', profileImage);
            }
            await updateArtistAction(formData.id, data).then((res) => {
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

    const handleImageUpload = async () => {
        if (!portfolioImage) {
            ErrorAlert("Please select an image to upload.");
            return;
        }

        setBtnLoading(true);

        const formData = new FormData();
        formData.append("artistId", id);
        portfolioImage.forEach((image, index) => {
            formData.append(`images[]`, image);
        });

        try {
            await addArtistImgAction(formData).then((res) => {
                SuccessAlert(res?.message).then(() => {
                    dispatch(getSingleArtistAction(id));
                    tog_large();
                    setPortfolioImage(null);
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


    const confirmDeleteImg = async (AImgId) => {
        DeleteAlert({
            title: "Are you sure?",
            text: "Do you really want to delete this record?",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteArtistImgAction(AImgId, id)
                    .then((res) => {
                        SuccessAlert(res?.message);
                        dispatch(getSingleArtistAction(id));
                    })
                    .catch((e) => {
                        ErrorAlert(e);
                    });
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
        var updateAddress = addressData;
        updateAddress[i] = { ...updateAddress[i], [name]: value }
        setAddressData(updateAddress);
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
                        breadcrumbItem="Update Artist"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                <i className="fas fa-edit me-1"></i> Update Artist Details
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
                                            <Input value={formData?.firstName} type="text" placeholder="Enter First Name" name="firstName" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Last Name</Label>
                                            <Input value={formData?.lastName} type="text" placeholder="Enter Last Name" name="lastName" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label className="req-lab">Email</Label>
                                            <Input value={formData?.email} type="text" name="email" placeholder="Enter Email Id" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"1"} lg={"2"} className="form-group">
                                            <Label className="req-lab">Country</Label>
                                            <Input value={formData?.countryCode} type="number" placeholder="Code" name="countryCode" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"3"} lg={"4"} className="form-group">
                                            <Label className="req-lab">Mobile</Label>
                                            <Input value={formData?.mobile} type="number" placeholder="Enter Phone Number" name="mobile" className="form-control" onChange={handleInputChange} />
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
                                                        <i className="fas fa-image me-2"></i> View
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
                                                    onChange={handleInputChange}
                                                />
                                                {formData?.videoUrl && isValidUrl(formData?.videoUrl) ? (
                                                    <a
                                                        href={formData?.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="input-group-text"
                                                        placeholder="Enter Video URL"
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
                                            <Input value={formData?.sin} type="number" maxLength="9" placeholder="Enter SSN" name="sin" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label>Facebook</Label>
                                            <Input value={formData?.facebook} type="text" placeholder="Enter Facebook URL" name="facebook" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label>Instagram</Label>
                                            <Input value={formData?.instagram} type="text" placeholder="Enter Instagram URL" name="instagram" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col xl={"4"} lg={"6"} className="form-group">
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

                                        <Col xl={"4"} lg={"6"} className="form-group">
                                            <Label>Artist Level</Label>
                                            <Select
                                                value={selectedArtistType}
                                                onChange={(e) => { setSelectedArtistType(e.target.value) }}
                                                data={listArtistType}
                                                options={{
                                                    placeholder: "Select Artist Level",
                                                    width: '100%',
                                                }}
                                                className="custom-select2"
                                            />
                                        </Col>

                                        {/* <Col xl={"4"} lg={"6"} className="form-group">
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
                                            <div className="input-group has-validation">
                                                <Input
                                                    type="file"
                                                    name="profileImage"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={handleImageChange}
                                                />
                                                {formData?.profileImage && formData?.profileImage !== "undefined" && formData?.profileImage !== null && formData?.profileImage.trim() !== "" ? (
                                                    <a
                                                        href={formData.profileImage}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="input-group-text"
                                                        id="inputGroupPrepend"
                                                    >
                                                        <i className="fas fa-image me-2"></i>View
                                                    </a>
                                                ) : (
                                                    <span className="input-group-text " id="inputGroupPrepend">
                                                        <i className="fas fa-image"></i>
                                                    </span>
                                                )}
                                            </div>

                                        </Col>
                                        <Col lg={"12"} className="form-group">
                                            <Label>Address</Label>
                                            <textarea value={formData?.address} type="text" name="address" className="form-control" onChange={handleInputChange} />
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
                                                                        <div className="input-group has-validation">
                                                                            <Input
                                                                                value={v.geocode || ''}
                                                                                type="text"
                                                                                name="geocode"
                                                                                className="form-control"
                                                                                placeholder="Enter GEO Code"
                                                                                onChange={(e) => handleInputChangeAddress(e, i)}
                                                                            />
                                                                            <span className="input-group-text" id="inputGroupPrepend">
                                                                                {v.geocode ? (
                                                                                    <a
                                                                                        href={`https://www.google.com/maps?q=${v.geocode}`}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{ color: "inherit", textDecoration: "none" }}
                                                                                    >
                                                                                        <i className="fas fa-map cursor-pointer me-1"></i> View
                                                                                    </a>
                                                                                ) : (
                                                                                    <i className="fas fa-map text-muted"></i>
                                                                                )}
                                                                            </span>
                                                                        </div>
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
                            <Button color="warning" onClick={tog_large}>
                                <i className="fas fa-plus me-1"></i> Add New Image
                            </Button>
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
                                                                height: "200px",
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
                                            <p className="text-center">No images available</p>
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
                                    <Col sm={6} md={4} xl={3}>
                                        <Modal isOpen={modal_large} toggle={tog_large} size="md">
                                            <ModalHeader className="mt-0" toggle={tog_large}>Add Images</ModalHeader>
                                            <ModalBody>
                                                <Row>

                                                    <Col lg={"12"} className="form-group">
                                                        <Label>Artist Image</Label>
                                                        <Input type="file" accept="image/*" multiple name="address" className="form-control" onChange={handlePortfolioImageChange} />
                                                    </Col>

                                                    <Col lg={"12"} className=" mt-3 d-flex justify-content-end align-items-center gap-3">
                                                        <Button color="primary" className="waves-effect waves-light" disabled={btnLoading} onClick={handleImageUpload}>
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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        </React.Fragment>
    );
};

export default ArtistEdit;
