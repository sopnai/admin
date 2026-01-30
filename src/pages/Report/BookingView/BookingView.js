import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Alert, Button, Badge, BreadcrumbItem, Card, CardBody, Col, Container, Dropdown, DropdownItem, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane, Form, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';

import moment from 'moment';
import { connect, useSelector, useDispatch } from "react-redux";
import { getSingleBookingAction, statusBookingAction } from "store/actions";
import Breadcrumb from "components/Common/Breadcrumb";
import classnames from "classnames";
import style from "./booking.module.css";
import { FaStar } from "react-icons/fa";
import { ErrorAlert, SuccessAlert } from "components/Alert/Alert";

const BookingView = () => {

    document.title = "Booking View | Flawless Admin Panel";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { singleBooking } = useSelector(state => ({
        singleBooking: state.BookingRD.singleBooking,
    }));

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        dispatch(getSingleBookingAction(id));
    }, [id]);

    useEffect(() => {
        if (singleBooking) {
            setBookings(singleBooking?.booking);
        }
        return () => {
            dispatch({ type: 'SINGLE_BOOKING', payload: null });
        }
    }, [singleBooking]);

    const calculateRemainingPayment = (total, paid) => {
        if (!total || isNaN(total)) return "-";
        if (!paid || isNaN(paid) || paid === 0) return `$ ${total.toFixed(2)}`;
        const remaining = total - paid;
        return remaining > 0 ? `$ ${remaining.toFixed(2)}` : "$ 0.00";
    };

    //client details
    const clientImg = bookings?.userDetails?.[0]?.profileImage || "../../../assets/images/users/avatar-1.jpg";
    const clientName = bookings?.userDetails?.[0]
        ? `${bookings?.userDetails?.[0]?.firstName || "-"} ${bookings?.userDetails?.[0]?.lastName || ""}`.trim()
        : "-";
    const countryCode = bookings?.userDetails?.[0]?.countryCode || "-";
    const clientPhone = bookings?.userDetails?.[0]?.phone || "";
    const clientEmail = bookings?.userDetails?.[0]?.email || "-";

    const clientAddress = bookings?.userDetails?.[0]?.address || "-";
    const clientCity = bookings?.useraddress?.city || "-";
    const clientState = bookings?.useraddress?.state || "-";
    const clientPincode = bookings?.useraddress?.pincode || "-";
    const clientGeocode = bookings?.useraddress?.geocode || "-";


    //booking details
    const bookingTotalAmount = parseFloat(bookings?.totalAmount) || 0;
    const bookingAmountPaid = parseFloat(bookings?.amountPaid) || 0;
    const bookingRemainingPayment = calculateRemainingPayment(bookingTotalAmount, bookingAmountPaid);
    const bookingTotalTravelFee = parseFloat(bookings?.totalTravelFee) || 0;
    const bookingTotalGratuity = parseFloat(bookings?.totalGratuity) || 0;
    const bookingFee = bookings?.usercart?.bookingFee || "0";
    const bookingTime = moment(bookings?.createdAt).format('DD-MM-YYYY hh:mm A');
    const bookingType =
        bookings?.bookingItems?.[0]?.bookingType === "later"
            ? "Future"
            : bookings?.bookingItems?.[0]?.bookingType === "now"
                ? "Immediate"
                : "-";
    const bookingStatus = bookings?.status || "-";


    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-warning text-dark';
            case 'confirmed': return 'bg-info text-white';
            case 'cancelled': return 'bg-danger text-white';
            case 'completed': return 'bg-success text-white';
            case 'payment_pending': return 'bg-warning-subtle text-dark';
            case 'paid': return 'bg-primary text-white';
            default: return 'bg-dark text-white';
        }
    };

    const handleStatusChange = (bookingId, currentStatus) => {
        window.Swal.fire({
            title: 'Change Booking Status',
            input: 'select',
            inputOptions: {
                'pending': 'Pending',
                'confirmed': 'Confirmed',
                'cancelled': 'Cancelled',
                'completed': 'Completed',
                'payment_pending': 'Payment Pending'
            },
            inputPlaceholder: 'Select a status',
            showCancelButton: true,
            inputValue: currentStatus,
            confirmButtonText: 'Update Status',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newStatus = result.value;

                const payload = {
                    bookingId: bookingId,
                    status: newStatus
                };

                statusBookingAction(payload)
                    .then((res) => {
                        SuccessAlert(res?.message);
                        dispatch(getSingleBookingAction(id));
                    })
                    .catch((e) => {
                        ErrorAlert(e?.message);
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
                        title="All Bookings"
                        titleLink="/booking"
                        breadcrumbItem="Booking View"
                    />

                    <Row>
                        <Col>
                            <Card className="pt-2 px-2">
                                <CardBody>
                                    <Row>
                                        <Card>
                                            <h5 className="font-size-16 mb-4 d-flex align-items-center gap-3">
                                                <i className="ti-user bg-primary text-white rounded p-3"></i>
                                                <h5 className="font-size-20 text-uppercase mb-0">
                                                    Client Details
                                                </h5>
                                            </h5>

                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr className="table-secondary">
                                                        <th>Client Image</th>
                                                        <th>Client Name</th>
                                                        <th>Email Id</th>
                                                        <th>Phone Number</th>
                                                    </tr>
                                                    <tr className=" align-middle">
                                                        <td className="align-middle">
                                                            <ol className="breadcrumb mb-0 d-flex align-items-center gap-3 p-0">
                                                                <img
                                                                    src={clientImg}
                                                                    alt=""
                                                                    className="avatar-sm rounded-circle img-thumbnail"
                                                                />
                                                            </ol>
                                                        </td>
                                                        <td className="align-middle">
                                                            <span>{clientName}</span>
                                                        </td>
                                                        <td className="align-middle">
                                                            <span>{clientEmail}</span>
                                                        </td>
                                                        <td className="align-middle">
                                                            <span>+{countryCode} {clientPhone}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>


                                            <Row>
                                                <Card>
                                                    <div>
                                                        <h5 className="font-size-16 mb-0 mt-3 pb-0">Selected Address</h5>
                                                        <div className="table-responsive">
                                                            <table className="table table-nowrap table-bordered table-centered mt-4">
                                                                <thead>
                                                                    <tr class="table-secondary">
                                                                        <th>Address</th>
                                                                        <th>State</th>
                                                                        <th>City</th>
                                                                        <th>PIN Code</th>
                                                                        <th>GEO Code</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{clientAddress}</td>
                                                                        <td>{clientState}</td>
                                                                        <td>{clientCity}</td>
                                                                        <td>{clientPincode}</td>
                                                                        <td>{clientGeocode}</td>
                                                                        <td>
                                                                            {clientGeocode !== "-" ? (
                                                                                <a
                                                                                    href={`https://www.google.com/maps?q=${clientGeocode}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <i className="fas fa-eye cursor-pointer"></i>&nbsp; View Location
                                                                                </a>
                                                                            ) : (
                                                                                <span>No Location Available</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Row>
                                        </Card>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className="pt-2 px-2">
                                <CardBody>
                                    <Row>
                                        <Card>
                                            <h5 className="font-size-16 mb-4 d-flex align-items-center gap-3">
                                                <i className="ti-cut bg-primary text-white rounded p-3"></i>
                                                <h5 className="font-size-20 text-uppercase mb-0">
                                                    Artist Details
                                                </h5>
                                            </h5>

                                            {/* <div>
                                                {bookings?.bookingItems?.map((item, index) => (
                                                    <table key={item.id || index} className="table table-bordered mb-4">
                                                        <thead>
                                                            <tr className="table-secondary">
                                                                <th>Artist Name</th>
                                                                <th>Business Type</th>
                                                                <th>Phone Number</th>
                                                                <th>Address</th>
                                                                <th colSpan={2}>Service Name</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td rowSpan="6">
                                                                    <ol className="breadcrumb mb-0 d-flex align-items-center gap-3">
                                                                        <img
                                                                            src={item.artistDetails?.licenceUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                                            alt={item.artistDetails?.firstName || "Artist"}
                                                                            className="avatar-md rounded-circle img-thumbnail"
                                                                        />
                                                                        <div>
                                                                            <h5 className="mb-0">
                                                                                {item.artistDetails?.firstName || "-"} {item.artistDetails?.lastName || "-"}
                                                                            </h5>
                                                                            <p className="mb-0">{item.artistDetails?.email || "-"}</p>
                                                                        </div>
                                                                    </ol>
                                                                </td>
                                                                <td>
                                                                    {item.artistDetails?.businessType === 1
                                                                        ? "Hair Styles"
                                                                        : item.artistDetails?.businessType === 2
                                                                            ? "Makeup Looks"
                                                                            : item.artistDetails?.businessType === 3
                                                                                ? "Hair Styles & Makeup Looks"
                                                                                : "-"}
                                                                </td>

                                                                <td>+{item.artistDetails?.countryCode || "-"} {item.artistDetails?.mobile || "-"}</td>
                                                                <td>{item.artistDetails?.address || "-"}</td>
                                                                <td colSpan={2}>{item.serviceName || "-"}</td>
                                                            </tr>
                                                            <tr className="table-secondary">
                                                                <th>Booking Time</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                                <th>Travel Fee</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            <tr>
                                                                <td>{moment(item.bookingTime).format('DD-MM-YYYY hh:mm A')}</td>
                                                                <td>{item.quantity || 0}</td>
                                                                <td>$ {item.price || 0}</td>
                                                                <td>$ {item.travelFee || 0}</td>
                                                                <td>
                                                                    <Badge className={`badge-size ${getStatusClass(item.status)}`}>
                                                                        {item.status}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                            <tr className="table-secondary">
                                                                <th>Gratuity</th>
                                                                <th>Textured Hair Amount</th>
                                                                <th>Blowout Amount</th>
                                                                <th colSpan="2">Total Amount</th>
                                                            </tr>
                                                            <tr>
                                                                <td>$ {item.gratuity || 0}</td>
                                                                <td>$ {item.longHairAmount || 0}</td>
                                                                <td>$ {item.addOnAmount || 0}</td>
                                                                <td colSpan="2">
                                                                    $ {(
                                                                        (parseFloat(item.price || 0) * (item.quantity > 1 ? item.quantity : 1)) +  // Multiply price by quantity
                                                                        (parseFloat(item.longHairAmount || 0) * (item.quantity > 1 ? item.quantity : 1)) + // Multiply longHairAmount by quantity
                                                                        (parseFloat(item.addOnAmount || 0) * (item.quantity > 1 ? item.quantity : 1)) + // Multiply addOnAmount by quantity
                                                                        parseFloat(item.gratuity || 0) + // Add gratuity
                                                                        parseFloat(item.travelFee || 0) // Add travel fee
                                                                    ).toFixed(2)}
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                ))}
                                            </div> */}

                                            <div>
                                                {bookings?.bookingItems?.map((item, index) => (
                                                    <table key={item.id || index} className="table table-bordered mb-4">
                                                        <thead>
                                                            <tr className="table-secondary">
                                                                <th>Artist Name</th>
                                                                <th>Booking Time</th>
                                                                <th colSpan={2}>Business Type</th>
                                                                <th colSpan={2}>Service Name</th>
                                                                <th colSpan={2}>Phone Number</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td rowSpan="6">
                                                                    <ol className="breadcrumb mb-0 d-flex align-items-center gap-3">
                                                                        <img
                                                                            src={item.artistDetails?.licenceUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                                            alt={item.artistDetails?.firstName || "Artist"}
                                                                            className="avatar-md rounded-circle img-thumbnail"
                                                                        />
                                                                        <div>
                                                                            <h5 className="mb-0">
                                                                                {item.artistDetails?.firstName || "-"} {item.artistDetails?.lastName || "-"}
                                                                            </h5>
                                                                            <p className="mb-0">{item.artistDetails?.email || "-"}</p>
                                                                        </div>
                                                                    </ol>
                                                                </td>
                                                                <td>{moment(item.bookingTime).format('DD-MM-YYYY hh:mm A')}</td>
                                                                <td colSpan={2}>
                                                                    {item.artistDetails?.businessType === 1
                                                                        ? "Hair Styles"
                                                                        : item.artistDetails?.businessType === 2
                                                                            ? "Makeup Looks"
                                                                            : item.artistDetails?.businessType === 3
                                                                                ? "Hair Styles & Makeup Looks"
                                                                                : "-"}
                                                                </td>
                                                                <td colSpan={2}>{item.serviceName || "-"}</td>
                                                                <td colSpan={2}>+{item.artistDetails?.countryCode || "-"} {item.artistDetails?.mobile || "-"}</td>
                                                            </tr>
                                                            <tr className="table-secondary">
                                                                <th>Quantity</th>
                                                                <th>Service Price</th>
                                                                <th>Travel Fee</th>
                                                                <th>Gratuity</th>
                                                                <th>Textured Hair Amount</th>
                                                                <th>Blowout Amount</th>
                                                                <th>Total Amount</th>
                                                            </tr>
                                                            <tr>
                                                                <td>{item.quantity || 0}</td>
                                                                <td>$ {item.price || 0}</td>
                                                                <td>$ {item.travelFee || 0}</td>

                                                                <td>$ {item.gratuity || 0}</td>
                                                                <td>$ {item.longHairAmount || 0}</td>
                                                                <td>$ {item.addOnAmount || 0}</td>
                                                                <td >
                                                                    $ {(
                                                                        (parseFloat(item.price || 0) * (item.quantity > 1 ? item.quantity : 1)) +  // Multiply price by quantity
                                                                        (parseFloat(item.longHairAmount || 0) * (item.quantity > 1 ? item.quantity : 1)) + // Multiply longHairAmount by quantity
                                                                        (parseFloat(item.addOnAmount || 0) * (item.quantity > 1 ? item.quantity : 1)) + // Multiply addOnAmount by quantity
                                                                        parseFloat(item.gratuity || 0) + // Add gratuity
                                                                        parseFloat(item.travelFee || 0) // Add travel fee
                                                                    ).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                            <tr className="table-secondary">
                                                                <th colSpan={6}>Address</th>
                                                                <th colSpan={6}>Status</th>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={6}>{item.artistDetails?.address || "-"}</td>
                                                                <td colSpan={6}>
                                                                    <Badge className={`badge-size ${getStatusClass(item.status)}`}>
                                                                        {item.status}
                                                                    </Badge>
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                ))}
                                            </div>

                                        </Card>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className="pt-2 px-2">
                                <CardBody>
                                    <Row>
                                        <Card>
                                            <h5 className="font-size-16 mb-4 d-flex align-items-center gap-3">
                                                <i className="ti-ticket bg-primary text-white rounded p-3"></i>
                                                <h5 className="font-size-20 text-uppercase mb-0">
                                                    Booking Details
                                                </h5>
                                            </h5>

                                            <Row>
                                                <Card>

                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <td class="table-secondary"><b>Sub-Total Amount:</b></td>
                                                                <td>$ {bookingTotalAmount}</td>
                                                                <td class="table-secondary"><b>Booking Fee:</b></td>
                                                                <td>$ {bookingFee}</td>
                                                                <td class="table-secondary"><b>Total Order Amount:</b></td>
                                                                <td>
                                                                    $ {(parseFloat(bookingTotalAmount || 0) + parseFloat(bookingFee || 0)).toFixed(2)}
                                                                </td>

                                                            </tr>
                                                            <tr>

                                                                <td class="table-secondary"><b>Paid Order Amount:</b></td>
                                                                <td>$ {bookingAmountPaid}</td>
                                                                <td class="table-secondary" ><b>Remaining Order Amount:</b></td>
                                                                <td>{bookingRemainingPayment}</td>
                                                                <td class="table-secondary"><b>Booking Status</b></td>
                                                                <td>
                                                                    <div className="d-flex gap-3 align-items-center">
                                                                        <Badge className={`badge-size ${getStatusClass(bookingStatus)}`}>{bookingStatus}</Badge>
                                                                        {bookingStatus !== "completed" && (
                                                                            <a
                                                                                className="fas fa-edit text-primary cursor-pointer"
                                                                                onClick={() => handleStatusChange(bookings.id, bookings.status)}
                                                                            ></a>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                            <tr>

                                                                <td class="table-secondary"><b>Booking Date:</b></td>
                                                                <td>{bookingTime}</td>
                                                                <td class="table-secondary"><b>Booking Type:</b></td>
                                                                <td colSpan={3}>{bookingType}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                </Card>
                                            </Row>


                                        </Card>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className="pt-2 px-2">
                                <CardBody>
                                    <Row>
                                        <Card>
                                            <h5 className="font-size-16 mb-4 d-flex align-items-center gap-3">
                                                <i className="ti-star bg-primary text-white rounded p-3"></i>
                                                <h5 className="font-size-20 text-uppercase mb-0">
                                                    Ratings & Reviews
                                                </h5>
                                            </h5>

                                            <Row>
                                                <Card>
                                                    <div className="table-responsive">
                                                        <table className="table table-nowrap table-bordered table-centered ">
                                                            <thead>
                                                                <tr class="table-secondary">
                                                                    <th>Service Name</th>
                                                                    <th>Service Review</th>
                                                                    <th>Artist Name</th>
                                                                    <th>Artist Review</th>
                                                                    <th>Ratings</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {bookings?.bookingItems?.map((item, index) => (
                                                                    <tr key={item.id || index}>
                                                                        <td>{item.serviceName || "-"}</td>
                                                                        <td>{item.how_service || "-"}</td>
                                                                        <td>
                                                                            {item.artistDetails?.firstName || "-"} {item.artistDetails?.lastName || "-"}
                                                                        </td>
                                                                        <td>{item.how_artist || "-"}</td>
                                                                        <td>
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <FaStar
                                                                                    key={i}
                                                                                    color={i < (item.rating || 0) ? "gold" : "gray"}
                                                                                    size={18}
                                                                                />
                                                                            ))}
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Card>
                                            </Row>


                                        </Card>
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

export default BookingView;
