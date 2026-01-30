import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardTitle, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./settings.scss";
import { useDispatch, useSelector } from 'react-redux';
import { getAppV } from 'store/actions';
import { updateAppV } from 'helpers/Module';
import { ErrorAlert, SuccessAlert } from 'components/Alert/Alert';

const AppVersion = () => {

    document.title = "App Version | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { appV, isLoading } = useSelector(state => ({
        appV: state.AppVRD.appV,
        isLoading: state.AppVRD.isLoading,
    }));

    const [btnLoading, setBtnLoading] = useState(false);
    const [formData, setFormData] = useState({
        android: "",
        IOS: "",
    });

    useEffect(() => {
        fetchAppV();
    }, [])

    useEffect(() => {
        if (appV && appV.appversion) {
            const versions = appV.appversion;

            setFormData({
                android: versions?.[0]?.android_version,
                IOS: versions?.[0]?.ios_version,
            });
        }
    }, [appV]);

    const fetchAppV = async () => {
        dispatch(getAppV());
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {

        const AppV =
            { androidversion: formData.android, iosversion: formData.IOS };

        setBtnLoading(true);

        try {
            await updateAppV(AppV)
                .then((res) => {
                    SuccessAlert(res?.message || "Password updated successfully!");
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
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="App Version"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                <i className="ti-info-alt me-2"></i>
                                Update App Version
                            </>
                        }
                    />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col lg={"6"} className="form-group">
                                            <Label>Android Version</Label>
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend"><i className="ti-android"></i></span>
                                                <Input value={formData?.android} type="text" name="android" placeholder='' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>
                                        <Col lg={"6"} className="form-group">
                                            <Label>IOS Version</Label>
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend"><i className="ti-apple"></i></span>
                                                <Input value={formData?.IOS} type="text" name="IOS" placeholder='' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col>

                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AppVersion;
