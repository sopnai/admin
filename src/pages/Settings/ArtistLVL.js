import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardTitle, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./settings.scss";
import { connect, useSelector, useDispatch } from "react-redux";
import { getArtistLvl } from 'store/actions';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import { updateArtistLvl } from 'helpers/Module';

const ArtistLVL = () => {

    document.title = "Artist Level | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { artistLvl, isLoading } = useSelector(state => ({
        artistLvl: state.ArtistLvlRD.artistLvl,
        isLoading: state.ArtistLvlRD.isLoading,
    }));

    const [btnLoading, setBtnLoading] = useState(false);
    const [formData, setFormData] = useState({
        artLVL1: "",
        des1: "",

        artLVL2: "",
        des2: "",

        artLVL3: "",
        des3: "",

        artLVL4: "",
        des4: "",
    });

    useEffect(() => {
        fetchArtistLvl();
    }, [])

    useEffect(() => {
        if (artistLvl && artistLvl.artistlevel) {
            const levels = artistLvl.artistlevel;

            setFormData({
                artLVL1: levels[0]?.name || "",
                des1: levels[0]?.description || "",

                artLVL2: levels[1]?.name || "",
                des2: levels[1]?.description || "",

                artLVL3: levels[2]?.name || "",
                des3: levels[2]?.description || "",

                artLVL4: levels[3]?.name || "",
                des4: levels[3]?.description || "",
            });
        }
    }, [artistLvl]);

    const fetchArtistLvl = async () => {
        dispatch(getArtistLvl());
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {

        const ArtistLVL = [
            { artistleveleid: 1, name: formData.artLVL1, description: formData.des1 },
            { artistleveleid: 2, name: formData.artLVL2, description: formData.des2 },
            { artistleveleid: 3, name: formData.artLVL3, description: formData.des3 },
            { artistleveleid: 4, name: formData.artLVL4, description: formData.des4 },
        ];

        setBtnLoading(true);

        try {
            await updateArtistLvl(ArtistLVL)
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

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Artist Level"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                <i className="fas fa-edit me-2"></i>Update Artist Level
                            </>
                        }

                    />

                    <Row>
                        <Col lg={12}>

                            <Card>
                                <CardBody>
                                    <Row>
                                        <h5 className='mb-3'>Level -<span className='text-dark'> 1</span></h5>
                                        <Col lg={"4"} className="form-group">
                                            <Label>Artist Level Name</Label>
                                            <Input value={formData?.artLVL1} type="text" name="artLVL1" placeholder='' className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        <Col lg={"8"} className="form-group">
                                            <Label>Description</Label>
                                            <textarea
                                                value={formData.des1}
                                                type="text"
                                                name="des1"
                                                placeholder="Enter Description"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                rows={1}
                                            />
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
                                    <Row>
                                        <h5 className='mb-3'>Level -<span className='text-dark'> 2</span></h5>
                                        <Col lg={"4"} className="form-group">
                                            <Label>Artist Level Name</Label>
                                            <Input value={formData?.artLVL2} type="text" name="artLVL2" placeholder='' className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        {/* <Col lg={"3"} className="form-group">
                                            <Label>Price</Label>
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price2} type="numer" name="prce" placeholder='' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col> */}
                                        <Col lg={"8"} className="form-group">
                                            <Label>Description</Label>
                                            <textarea
                                                value={formData.des2}
                                                name="des2"
                                                placeholder="Enter Description"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                rows={1}
                                            />
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
                                    <Row>
                                        <h5 className='mb-3'>Level -<span className='text-dark'> 3</span></h5>
                                        <Col lg={"4"} className="form-group">
                                            <Label>Artist Level Name</Label>
                                            <Input value={formData?.artLVL3} type="text" name="artLVL3" placeholder='' className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        {/* <Col lg={"3"} className="form-group">
                                            <Label>Price</Label>
                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price3} type="numer" name="prce" placeholder='' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col> */}
                                        <Col lg={"8"} className="form-group">
                                            <Label>Description</Label>
                                            <textarea
                                                value={formData.des3}
                                                name="des3"
                                                placeholder="Enter Description"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                rows={1}
                                            />
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
                                    <Row>
                                        <h5 className='mb-3'>Level -<span className='text-dark'> 4</span></h5>
                                        <Col lg={"4"} className="form-group">
                                            <Label>Artist Level Name</Label>
                                            <Input value={formData?.artLVL4} type="text" name="artLVL4" placeholder='' className="form-control" onChange={handleInputChange} />
                                        </Col>
                                        {/* <Col lg={"3"} className="form-group">
                                            <Label>Price</Label>

                                            <div className="input-group has-validation">
                                                <span className="input-group-text" id="inputGroupPrepend">$</span>
                                                <Input value={formData?.price4} type="numer" name="prce" placeholder='' className="form-control" onChange={handleInputChange} />
                                            </div>
                                        </Col> */}
                                        <Col lg={"8"} className="form-group">
                                            <Label>Description</Label>
                                            <textarea
                                                value={formData.des4}
                                                name="des4"
                                                placeholder="Enter Description"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                rows={1}
                                            />
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

export default ArtistLVL;
