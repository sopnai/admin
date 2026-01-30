import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
} from "reactstrap";
import { Link } from "react-router-dom";

import { connect, useSelector, useDispatch } from "react-redux";

import Salesdonut from "../AllCharts/apex/salesdonut";
import { getDashboard } from 'store/actions';

//i18n
import { withTranslation } from "react-i18next";

const Dashboard = props => {
    document.title = "Dashboard | Flawless Admin Panel";

    const dispatch = useDispatch();

    const [totalClients, setTotalClients] = useState(0);
    const [totalArtists, setTotalArtists] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalServices, setTotalServices] = useState(0);

    // State for booking status counts
    const [bookingStatus, setBookingStatus] = useState({
        pending: 0,
        completed: 0,
        confirmed: 0,
        cancelled: 0,
        payment_pending: 0,
        accepted: 0,
        paid: 0
    });

    const { dashboard, isLoading } = useSelector((state) => ({
        dashboard: state.DashboardRD.dashboard,
        isLoading: state.DashboardRD.isLoading,
    }));

    useEffect(() => {
        dispatch(getDashboard());
    }, [dispatch]);

    useEffect(() => {
        if (dashboard) {
            setTotalClients(dashboard.totalUserCount || 0);
            setTotalArtists(dashboard.totalArtistCount || 0);
            setTotalBookings(dashboard.totalBookingCount || 0);
            setTotalServices(dashboard.totalServiceCount || 0);
            setBookingStatus(dashboard.bookingCountsByStatus || {});
        }
    }, [dashboard]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h6 className="page-title">Dashboard</h6>
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item active">Welcome to Flawless Dashboard</li>
                                </ol>
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        <Col xl={6}>
                            <Row>
                                <Col md={6}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-user text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Clients
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    {totalClients}
                                                    {/* <i className="mdi mdi-arrow-up text-success ms-2"></i> */}
                                                </h4>

                                            </div>
                                            <div className="pt-2">
                                                <div className="float-end">
                                                    <Link to="/client" className="text-white-50">
                                                        <i className="mdi mdi-arrow-right h5"></i>
                                                    </Link>
                                                </div>
                                                <p className="text-white-50 mb-0 mt-1">View all client list</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-cut text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Artist
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    {totalArtists}
                                                    {/* <i className="mdi mdi-arrow-up text-success ms-2"></i> */}
                                                </h4>

                                            </div>
                                            <div className="pt-2">
                                                <div className="float-end">
                                                    <Link to="/artist" className="text-white-50">
                                                        <i className="mdi mdi-arrow-right h5"></i>
                                                    </Link>
                                                </div>
                                                <p className="text-white-50 mb-0 mt-1">View all artist list</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-ticket text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Bookings
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    {totalBookings}
                                                    {/* <i className="mdi mdi-arrow-up text-success ms-2"></i> */}
                                                </h4>

                                            </div>
                                            <div className="pt-2">
                                                <div className="float-end">
                                                    <Link to="/booking" className="text-white-50">
                                                        <i className="mdi mdi-arrow-right h5"></i>
                                                    </Link>
                                                </div>
                                                <p className="text-white-50 mb-0 mt-1">View all booking list</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="mini-stat bg-primary text-white">
                                        <CardBody>
                                            <div className="mb-4">
                                                <div className="float-start mini-stat-img d-flex align-items-center justify-content-center me-4">
                                                    <i className="ti-layout-list-post text-white fs-3"></i>
                                                </div>
                                                <h5 className="font-size-16 text-uppercase mt-0 text-white-50">
                                                    Total Services
                                                </h5>
                                                <h4 className="fw-medium font-size-24">
                                                    {totalServices}
                                                    {/* <i className="mdi mdi-arrow-up text-success ms-2"></i> */}
                                                </h4>

                                            </div>
                                            <div className="pt-2">
                                                <div className="float-end">
                                                    <Link to="/services" className="text-white-50">
                                                        <i className="mdi mdi-arrow-right h5"></i>
                                                    </Link>
                                                </div>
                                                <p className="text-white-50 mb-0 mt-1">View all services</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>
                        </Col>

                        <Col xl={6} className='d-flex  me-0 pe-0'>
                            <Row className='w-100 me-0 pe-0'>
                                <Col xl={12} className='d-flex flex-column  me-0 pe-0'>
                                    <Card className='h-100  me-0 pe-0'>
                                        <CardBody>
                                            <div className="cleafix bg-warning-subtle p-2 px-3 mb-3">
                                                <p className="float-start mb-0">

                                                    <h4 className="card-title">Bookings Report</h4>
                                                </p>
                                                <h5 className="font-18 mb-0 text-end">{totalBookings}</h5>
                                            </div>
                                            <div className='d-flex w-100 justify-content-around'>
                                                <div id="ct-donut" className="ct-chart wid ">
                                                    <Salesdonut bookingStatus={bookingStatus} />
                                                </div>
                                                <div className="w-50">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <span className="badge badge-size bg-warning">Pending</span>
                                                                </td>
                                                                <td className="text-end">{bookingStatus.pending || 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span className="badge badge-size bg-danger">Cancelled</span>
                                                                </td>
                                                                <td className="text-end">{bookingStatus.cancelled || 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span className="badge badge-size bg-info">Confirmed</span>
                                                                </td>
                                                                <td className="text-end">{bookingStatus.confirmed || 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <span className="badge badge-size bg-success">Completed</span>
                                                                </td>
                                                                <td className="text-end">{bookingStatus.completed || 0}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>



                            </Row>
                        </Col>


                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

Dashboard.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Dashboard);
