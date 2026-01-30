import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Alert, Badge, Button, Modal, ModalBody, ModalHeader, CardImg, CardText, BreadcrumbItem, ModalFooter, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table
} from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import "./Services.scss";
import { useDispatch, useSelector } from 'react-redux';
import { getCat } from '../../store/actions';


const Services = () => {

    document.title = "Services | Flawless Admin Panel";

    const dispatch = useDispatch();
    const category1Data = useSelector(state => state.CatRD.categories[1]);
    const category2Data = useSelector(state => state.CatRD.categories[2]);
    const isLoading = useSelector(state => state.CatRD.isLoading);

    useEffect(() => {
        dispatch(getCat({ categoryId: 1 }));
        dispatch(getCat({ categoryId: 2 }));
    }, [dispatch]);


    useEffect(() => {
        if (category1Data) console.log("Category 1 Data:", category1Data);
        if (category2Data) console.log("Category 2 Data:", category2Data);
    }, [category1Data, category2Data]);

    // ML
    const MLServices = category2Data?.totalService || 0;
    const MLServiceCategories = category2Data?.totalServiceCategories || 0;

    // HL
    const HLServices = category1Data?.totalService || 0;
    const HLServiceCategories = category1Data?.totalServiceCategories || 0;

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Services" />

                    <Row>


                        <Col xl={6} md={12}>
                            <Link to={`/service-view/1`}>

                                <Card className="mini-stat">
                                    <CardBody className=' mb-0 pb-0'>
                                        <div className="mb-4">
                                            <div className="mini-stat-img bg-warning d-flex align-items-center justify-content-center me-4">
                                                <i className="ti-cut text-white fs-3"></i>
                                            </div>
                                            <h5 className="font-size-20 text-uppercase mt-3">
                                                Hair Styles
                                            </h5>
                                            <div className="mini-stat-label text-dark">
                                                <i className="ti-arrow-right fs-4 me-2"></i>
                                            </div>
                                        </div>
                                        <Row className='align-items-stretch pb-3'>
                                            <Col xl={6} md={6}>
                                                <Card className="mini-stat bg-warning text-white h-100">
                                                    <CardBody>
                                                        <div className="">
                                                            <div className="float-start d-flex align-items-center justify-content-center mini-stat-img me-4">
                                                                <i className="ti-file text-white fs-3"></i>
                                                            </div>
                                                            <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                                Total Services
                                                            </h5>
                                                            <h4 className="fw-medium font-size-24">
                                                                {HLServices}
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                            <Col xl={6} md={6}>
                                                <Card className="mini-stat bg-info text-white h-100">
                                                    <CardBody>
                                                        <div className="">
                                                            <div className="float-start d-flex align-items-center justify-content-center mini-stat-img me-4">
                                                                <i className="ti-files text-white fs-3"></i>
                                                            </div>
                                                            <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                                Total Sub-Services
                                                            </h5>
                                                            <h4 className="fw-medium font-size-24">
                                                                {HLServiceCategories}
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                    </CardBody>
                                </Card>
                            </Link>
                        </Col>

                        <Col xl={6} md={12}>
                            <Link to={`/service-view/2`}>

                                <Card className="mini-stat">
                                    <CardBody className=' mb-0 pb-0'>
                                        <div className="mb-4">
                                            <div className="mini-stat-img bg-primary d-flex align-items-center justify-content-center me-4">
                                                <i className="ti-user text-white fs-3"></i>
                                            </div>
                                            <h5 className="font-size-20 text-uppercase mt-3">
                                                Makeup Looks
                                            </h5>
                                            <div className="mini-stat-label text-dark">
                                                <i className="ti-arrow-right fs-4 me-2"></i>
                                            </div>
                                        </div>

                                        <Row className='align-items-stretch pb-3'>
                                            <Col xl={6} md={6}>
                                                <Card className="mini-stat bg-primary text-white h-100">
                                                    <CardBody>
                                                        <div className="">
                                                            <div className="float-start d-flex align-items-center justify-content-center mini-stat-img me-4">
                                                                <i className="ti-file text-white fs-3"></i>
                                                            </div>
                                                            <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                                Total Services
                                                            </h5>
                                                            <h4 className="fw-medium font-size-24">
                                                                {MLServices}
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                            <Col xl={6} md={6}>
                                                <Card className="mini-stat bg-success text-white h-100">
                                                    <CardBody>
                                                        <div className="">
                                                            <div className="float-start d-flex align-items-center justify-content-center mini-stat-img me-4">
                                                                <i className="ti-files text-white fs-3"></i>
                                                            </div>
                                                            <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                                Total Sub-Services
                                                            </h5>
                                                            <h4 className="fw-medium font-size-24">
                                                                {MLServiceCategories}
                                                            </h4>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                    </CardBody>
                                </Card>
                            </Link>
                        </Col>

                    </Row>


                </div>
            </div>
        </React.Fragment>
    );
};

export default Services;
