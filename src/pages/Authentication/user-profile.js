import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    CardBody,
    Button,
    Form,
    Nav, NavItem, NavLink, TabContent, TabPane,
    FormFeedback,
    Label,
    Input
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames";

// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import withRouter from 'components/Common/withRouter';

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// import avatar from "../../assets/images/users/user-4.jpg";
import avatar from "../../assets/images/flawless.png";

// actions
import { editProfile, getProfiles, resetProfileFlag } from "../../store/actions";
import { updateUserPassword, updateUserProfile } from 'helpers/Module';
import { ErrorAlert, SuccessAlert } from 'components/Alert/Alert';
import { LoadingBtn } from 'components/Loading/Loading';

const UserProfile = props => {

    document.title = "Profile | Flawless Admin Panel";

    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const dispatch = useDispatch();
    const profile = useSelector((state) => state.Profile) || [];

    useEffect(() => {
        dispatch(getProfiles({}));
    }, [dispatch]);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            console.log(profile?.profile);
            setName(profile?.profile?.name || '-');
            setEmail(profile?.profile?.email || '-');
            setMobile(profile?.profile?.mobile || '-');
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const userId = profile?.profile?.id;
        const updatedData = {
            name,
            email,
            mobile
        };

        try {
            await updateUserProfile(userId, updatedData).then((res) => {
                SuccessAlert(res?.message || "Password updated successfully!");
                dispatch(getProfiles({}));
            }).catch((e) => {
                const errorMessage = e?.response?.data?.message || e?.message || "An error occurred.";
                ErrorAlert(errorMessage);
            }).finally(() => {
                setBtnLoading(false);
            });
        } catch (error) {
            console.error("Error submitting client add:", error);
        }
        setBtnLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const updatedNewPassword = newPassword.trim() ? newPassword : currentPassword;
        const updatedConfirmPassword = confirmPassword.trim() ? confirmPassword : currentPassword;

        if (updatedNewPassword.length < 6) {
            ErrorAlert("Password must be at least 6 characters long!");
            return;
        }

        const passwordData = {
            adminId: profile?.profile?.id,
            currentPassword,
            newPassword: updatedNewPassword,
            confirmPassword: updatedConfirmPassword,
        };

        setBtnLoading(true);

        try {
            await updateUserPassword(passwordData)
                .then((res) => {
                    SuccessAlert(res?.message || "Password updated successfully!");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumb title="Flawless" breadcrumbItem="Profile" />

                    <Row>
                        <Col lg="12">

                            <Card>
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="mx-3">
                                            <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail" />
                                        </div>
                                        <div className="align-self-center flex-1">
                                            <div className="text-muted">
                                                <h5>{name}</h5>
                                                <p className="mb-1">{email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Card>
                        <Nav tabs className="nav nav-tabs nav-tabs-custom nav-justified">
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({
                                        active: customActiveTab === "1",
                                    })}
                                    onClick={() => {
                                        toggleCustom("1");
                                    }}
                                >
                                    <i className="bx bx-user-circle font-size-20"></i>
                                    <span className="d-none d-sm-block">
                                        <i className='fas fa-user-circle me-1'></i> Profile Details</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({
                                        active: customActiveTab === "2",
                                    })}
                                    onClick={() => {
                                        toggleCustom("2");
                                    }}
                                >
                                    <i className="bx bx-clipboard font-size-20"></i>
                                    <span className="d-none d-sm-block">
                                        <i className='fas fa-cog me-1'></i> Change Password</span>
                                </NavLink>
                            </NavItem>

                        </Nav>

                        <TabContent activeTab={customActiveTab} className="p-4" >
                            <TabPane tabId="1">
                                <Card>
                                    <CardBody>
                                        <Form className="form-horizontal" onSubmit={handleSubmit}>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <Label className="form-label req-lab">Name</Label>
                                                        <Input
                                                            name="name"
                                                            className="form-control"
                                                            placeholder="Enter Name"
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <Label className="form-label req-lab">Email ID</Label>
                                                        <Input
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Enter Email ID"
                                                            type="text"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <Label className="form-label req-lab">Mobile Number</Label>
                                                        <Input
                                                            name="mobile"
                                                            className="form-control"
                                                            placeholder="Enter Mobile Number"
                                                            type="text"
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center mt-4">
                                                <Button type="submit" color="danger" disabled={btnLoading}>
                                                    {btnLoading ? <LoadingBtn /> : <><i className='fas fa-edit me-1'></i> Update Profile</>}
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>

                            </TabPane>
                            <TabPane tabId="2">
                                <Card>
                                    <CardBody>
                                        <Form className="form-horizontal" onSubmit={handlePasswordChange}>
                                            <div className="form-group">
                                                <Label className="form-label req-lab">Current Password</Label>
                                                <Input
                                                    className="form-control"
                                                    placeholder="Enter Current Password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <Label className="form-label req-lab">New Password</Label>
                                                <Input
                                                    className="form-control"
                                                    placeholder="Enter New Password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <Label className="form-label req-lab">Confirm Password</Label>
                                                <Input
                                                    className="form-control"
                                                    placeholder="Confirm New Password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>

                                            {/* Show Password Checkbox */}
                                            <div className="form-group mt-3">
                                                <Input
                                                    type="checkbox"
                                                    id="showPassword"
                                                    checked={showPassword}
                                                    onChange={() => setShowPassword(!showPassword)}
                                                />
                                                <Label className="ms-2" htmlFor="showPassword">
                                                    Show Password
                                                </Label>
                                            </div>

                                            <div className="text-center mt-4">
                                                <Button type="submit" color="danger" disabled={btnLoading}>
                                                    {btnLoading ? <LoadingBtn /> : <><i className='fas fa-edit me-1'></i> Update Password</>}
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>


                            </TabPane>

                        </TabContent>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    );
};

UserProfile.propTypes = {
    editProfile: PropTypes.func,
    error: PropTypes.any,
    success: PropTypes.any
};

const mapStatetoProps = state => {
    const { error, success } = state.Profile;
    return { error, success };
};

export default withRouter(
    connect(mapStatetoProps, { editProfile, resetProfileFlag })(UserProfile)
);
