import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Alert, Button, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, CardTitle, Form, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
// import "../Client.scss";

import Breadcrumb from "components/Common/Breadcrumb";
import 'react-select2-wrapper/css/select2.min.css';
import { connect, useSelector, useDispatch } from "react-redux";

import { getSingleClientAction, updateClientAction } from "store/actions";
import { ErrorAlert, SuccessAlert, ConfirmAlert } from "components/Alert/Alert";

const ClientEdit = () => {


    document.title = "Update Client | Flawless Admin Panel";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { singleClient } = useSelector(state => ({
        singleClient: state.ClientRD.singleClient,
    }));
    const { id } = useParams();

    const [formData, setFormData] = useState();
    const [addressData, setAddressData] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        dispatch(getSingleClientAction(id));
    }, [id]);

    useEffect(() => {
        if (singleClient) {
            setFormData(singleClient);
            setAddressData(singleClient?.addresses);
        }
        return () => {
            dispatch({ type: 'SINGLE_CLIENT', payload: null });
        }
    }, [singleClient]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            user: {
                ...prevState.user,
                [name]: value,
            },
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
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

    const handleSubmit = async () => {
        if (!formData?.user?.firstName) {
            ErrorAlert('Enter the first name!');
            return false;
        }
        if (!formData?.user?.lastName) {
            ErrorAlert('Enter the last name!');
            return false;
        }
        if (!formData?.user?.email || !validateEmail(formData?.user.email)) {
            ErrorAlert('Enter a valid email address!');
            return false;
        }
        if (!formData?.user?.phone) {
            ErrorAlert('Enter a valid phone number!');
            return false;
        }
        if (!formData?.user?.countryCode) {
            ErrorAlert('Enter the Country code!');
            return false;
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

        const clientEdit = new FormData();
        clientEdit.append('firstName', formData?.user?.firstName);
        clientEdit.append('lastName', formData?.user?.lastName);
        clientEdit.append('email', formData?.user?.email);
        clientEdit.append('phone', formData?.user?.phone);
        clientEdit.append('countryCode', formData?.user?.countryCode || '');
        clientEdit.append('address', formData?.user?.address || '');

        if (profileImage) {
            clientEdit.append('profileImage', profileImage);
        }

        clientEdit.append('addresses', JSON.stringify(addressData));

        try {
            await updateClientAction(formData.user.id, clientEdit).then((res) => {
                SuccessAlert(res?.message).then(() => {
                    navigate("/client");
                });
            }).catch((e) => {
                ErrorAlert(e);
            });
        } catch (error) {
            console.error("Error submitting client edit:", error);
        }
        setBtnLoading(false);
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


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb
                        maintitle={'Dashboard'}
                        title="All Client"
                        titleLink="/client"
                        breadcrumbItem="Update Client"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                <i className="fas fa-edit me-1"></i> Update Client Details
                            </>
                        }
                    />


                    <Row>
                        <Col className="col-12">

                            <Card>
                                <CardBody className="m-2">

                                    <h5 className="mb-4">Personal Information</h5>

                                    <Row>

                                        <Col lg={"4"} className="form-group">
                                            <Label className="req-lab">First Name</Label>
                                            <Input value={formData?.user?.firstName} type="text" placeholder="Enter First Name" name="firstName" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col lg={"4"} className="form-group">
                                            <Label className="req-lab">Last Name</Label>
                                            <Input value={formData?.user?.lastName} type="text" placeholder="Enter Last Name" name="lastName" className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col lg={"4"} className="form-group">
                                            <Label className="req-lab">Email</Label>
                                            <Input value={formData?.user?.email} type="text" placeholder="Enter Email Id" name="email" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col lg={"4"} className="form-group">
                                            <Label className="req-lab">Country Code</Label>
                                            <Input value={formData?.user?.countryCode} type="number" placeholder="Enter Code" name="countryCode" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col lg={"4"} className="form-group">
                                            <Label className="req-lab">Mobile</Label>
                                            <Input value={formData?.user?.phone} type="number" placeholder="Enter Phone Number" name="phone" className="form-control" onChange={handleInputChange} />
                                        </Col>

                                        <Col lg={"4"} className="form-group">

                                            <Label>Profile Image</Label>
                                            <div className="input-group has-validation">
                                                <Input
                                                    type="file"
                                                    name="profileImage"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={handleImageChange}
                                                />
                                                {formData?.user?.profileImage && formData?.user?.profileImage !== "undefined" && formData?.user?.profileImage !== null && formData?.user?.profileImage.trim() !== "" ? (
                                                    <a
                                                        href={formData?.user?.profileImage}
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
                                            <textarea value={formData?.user?.address} type="text" placeholder="Enter Address" name="address" className="form-control" onChange={handleInputChange} />
                                        </Col>


                                    </Row>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>

                    <Row className="evaddressTitle">
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
                                                                    {/* <Col lg={'4'} className="form-group">
                                                                        <Label>GEO Code</Label>
                                                                        <Input
                                                                            value={v.geocode || ''}
                                                                            type="text"
                                                                            name="geocode"
                                                                            className="form-control"
                                                                            placeholder="Enter GEO Code"
                                                                            onChange={(e) => handleInputChangeAddress(e, i)}
                                                                        />
                                                                    </Col> */}
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
                                                                                        <i className="fas fa-eye cursor-pointer me-1"></i>View
                                                                                    </a>
                                                                                ) : (
                                                                                    <i className="fas fa-eye text-muted"></i>
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

                </div>
            </div>
        </React.Fragment>
    );
};

export default ClientEdit;
