import PropTypes from 'prop-types';
import React, { useState } from "react";
import { Row, Col, Alert, Card, CardBody, Container, Form, FormFeedback, Label, Input } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Redux
import { connect, useDispatch } from "react-redux";

// import { withRouter, Link } from "react-router-dom"
import { Link } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';

// action
import { userForgetPassword } from "../../store/actions";

// import images
import logoSm from "../../assets/images/flawless.png";

// actions
import { getMobileProfileAction, updateForgotPasswordAction } from "../../store/actions";
import { ErrorAlert, SuccessAlert } from 'components/Alert/Alert';

const ForgetPasswordPage = props => {
    const dispatch = useDispatch();

    const [forgotView, setForgotView] = useState(1);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            mobile: '',
        },
        validationSchema: Yup.object({
            mobile: Yup.string().required("Please Enter Your Mobile Number"),
        }),
        onSubmit: async (values) => {
            getMobileProfileAction(values).then(res => {
                console.log(res);
                setForgotView(2);
            }).catch(err => {
                console.log(err);
                ErrorAlert(err?.response?.data?.message || err);
            })
        }
    });

    const otpForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            otp: '',
        },
        validationSchema: Yup.object({
            otp: Yup.string().length(6).required("Please Enter The OTP Number"),
        }),
        onSubmit: async (values) => {
            console.log(values);
            if (values?.otp === '111111') {
                setForgotView(3);
            } else {
                ErrorAlert("Please enter the valid OTP number!");
            }
        }
    });

    const passwordForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string().length(6).required("Please Enter The Password").label('New password'),
            confirmPassword: Yup.string().length(6).required("Please Enter The Confirm Password").label("Confirm password"),
        }),
        onSubmit: async (values) => {
            if (values?.newPassword === values?.confirmPassword) {
                values.adminId = 1;
                updateForgotPasswordAction(values).then(res => {
                    SuccessAlert("Sucessfully updated password!");
                    setForgotView(1);
                }).catch(err => {
                    ErrorAlert(err?.response?.data?.message || err);
                });
            } else {
                ErrorAlert("Please enter the valid new password and confirm password!");
            }
        }
    });

    document.title = "Forget Password | Flawless Admin Panel";

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={4}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary">
                                    <div className="text-primary text-center p-4">
                                        <h5 className="text-white font-size-20 p-2">Forget Password</h5>
                                        <Link to="/index" className="logo logo-admin">
                                            <img src={logoSm} height="24" alt="logo" />
                                        </Link>
                                    </div>
                                </div>
                                <CardBody className="p-4">
                                    {
                                        forgotView == 1 ?
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="mt-4"
                                            >
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlor="useremail">Mobile Number</Label>
                                                    <Input
                                                        name="mobile"
                                                        className="form-control"
                                                        placeholder="Enter mobile number"
                                                        type="tel"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.mobile || ""}
                                                        invalid={validation.touched.mobile && validation.errors.mobile ? true : false}
                                                    />
                                                    {validation.touched.mobile && validation.errors.mobile ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.mobile}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="row  mb-0">
                                                    <div className="col-12 text-end">
                                                        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Reset</button>
                                                    </div>
                                                </div>
                                            </Form> : null
                                    }

                                    {
                                        forgotView == 2 ?
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    otpForm.handleSubmit();
                                                    return false;
                                                }}
                                                className="mt-4"
                                            >
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlor="useremail">OTP Number</Label>
                                                    <Input
                                                        name="otp"
                                                        className="form-control"
                                                        placeholder="Enter mobile number"
                                                        type="tel"
                                                        onChange={otpForm.handleChange}
                                                        onBlur={otpForm.handleBlur}
                                                        value={otpForm.values.otp || ""}
                                                        invalid={otpForm.touched.otp && otpForm.errors.otp ? true : false}
                                                    />
                                                    {otpForm.touched.otp && otpForm.errors.otp ? (
                                                        <FormFeedback type="invalid"><div>{otpForm.errors.otp}</div></FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="row  mb-0">
                                                    <div className="col-12 text-end">
                                                        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Reset</button>
                                                    </div>
                                                </div>
                                            </Form> : null
                                    }

                                    {
                                        forgotView == 3 ?
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    passwordForm.handleSubmit();
                                                    return false;
                                                }}
                                                className="mt-4"
                                            >
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlor="useremail">New Password</Label>
                                                    <Input
                                                        name="newPassword"
                                                        className="form-control"
                                                        placeholder="Enter the new password"
                                                        type="password"
                                                        onChange={passwordForm.handleChange}
                                                        onBlur={passwordForm.handleBlur}
                                                        value={passwordForm.values.newPassword || ""}
                                                        invalid={passwordForm.touched.newPassword && passwordForm.errors.newPassword ? true : false}
                                                    />
                                                    {passwordForm.touched.newPassword && passwordForm.errors.newPassword ? (
                                                        <FormFeedback type="invalid"><div>{passwordForm.errors.newPassword}</div></FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlor="useremail">Confirm Password</Label>
                                                    <Input
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Enter the confirm password"
                                                        type="password"
                                                        onChange={passwordForm.handleChange}
                                                        onBlur={passwordForm.handleBlur}
                                                        value={passwordForm.values.confirmPassword || ""}
                                                        invalid={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword ? true : false}
                                                    />
                                                    {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword ? (
                                                        <FormFeedback type="invalid"><div>{passwordForm.errors.confirmPassword}</div></FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="row  mb-0">
                                                    <div className="col-12 text-end">
                                                        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Reset</button>
                                                    </div>
                                                </div>
                                            </Form> : null
                                    }



                                </CardBody>
                            </Card>
                            <div className="mt-5 text-center">
                                <p>Remember It ? <Link to="/login" className="fw-medium text-primary"> Sign In here </Link> </p>
                                <p>
                                    © {new Date().getFullYear()} Crafted with{" "}
                                    <i className="mdi mdi-heart text-danger" /> by Flawless
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

ForgetPasswordPage.propTypes = {
    forgetError: PropTypes.any,
    forgetSuccessMsg: PropTypes.any,
    history: PropTypes.object,
    userForgetPassword: PropTypes.func
};

const mapStatetoProps = state => {
    const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
    return { forgetError, forgetSuccessMsg };
};

export default withRouter(
    connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
);