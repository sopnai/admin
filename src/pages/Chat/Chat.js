import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import {
    Alert, Badge, CardTitle, Button, Modal, ModalBody, ModalHeader, CardImg, CardText, BreadcrumbItem, ModalFooter, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table
} from 'reactstrap';
import "./ChatView.scss";

import Breadcrumb from 'components/Common/Breadcrumb';
import { approveClientAction, deleteClientAction, getChat } from 'store/actions';
import DataTable from 'components/Datatable/DataTable';
import { ConfirmAlert, DeleteAlert, SuccessAlert, ErrorAlert } from 'components/Alert/Alert';
import { getChatH } from 'helpers/Module';

const Chat = () => {

    document.title = "Chat | Flawless Admin Panel";

    const dispatch = useDispatch();
    const { chat, isLoading } = useSelector(state => ({
        chat: state.ChatRD.chat,
        isLoading: state.ChatRD.isLoading,
    }));

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalClients, setTotalChats] = useState(0);
    const [data, setData] = useState();

    const [modal_large, setmodal_large] = useState(false);
    const [search, setSearch] = useState(null);
    const [searchDate, setSearchDate] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [senderId, setSenderId] = useState("");
    const [clientName, setClientName] = useState("");  // Store client name
    const [artistName, setArtistName] = useState("");  // Store artist name
    const [clientImage, setClientImage] = useState(""); // Store client image
    const [artistImage, setArtistImage] = useState(""); // Store artist image


    useEffect(() => {
        fetchChat(currentPage);
        console.log(chat);

    }, []);

    useEffect(() => {
        updateDataSet();
    }, [chat]);

    const fetchChat = async (pagenumber = currentPage) => {
        const payload = {
            page: pagenumber,
            search: search,
            startDate: searchDate ? moment(searchDate[0]).format('YYYY-MM-DD') : null,
            endDate: searchDate ? moment(searchDate[1]).format('YYYY-MM-DD') : null,
        }
        dispatch(getChat(payload));
    };

    const fetchChatMessages = async (chatItem) => {
        try {
            console.log("Selected Chat Data:", chatItem); // Log entire selected chat item

            const response = await getChatH({ senderId: chatItem.senderId, receiverId: chatItem.receiverId });
            console.log("Chat Messages Data:", response);

            setChatHistory(response.data); // Store chat data
            setSenderId(chatItem.senderId); // Save senderId for comparison

            if (chatItem.senderType === "user") {
                setClientName(chatItem.senderName);
                setArtistName(chatItem.receiverName);
                setClientImage(chatItem.senderProfileImage);
                setArtistImage(chatItem.receiverProfileImage);
            } else {
                setClientName(chatItem.receiverName);
                setArtistName(chatItem.senderName);
                setClientImage(chatItem.receiverProfileImage);
                setArtistImage(chatItem.senderProfileImage);
            }

            setmodal_large(true); // Open modal
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const updateDataSet = () => {
        if (chat?.data !== undefined) {
            const rowData = {
                columns: [
                    { label: "ID", field: "id", sort: "asc", width: 100 },
                    { label: "Client Name", field: "cname", sort: "asc", width: 250 },
                    { label: "Artist Name", field: "aname", sort: "asc", width: 250 },
                    { label: "Action", field: "action", width: 150 },
                ],
                rows: chat?.data?.map((chatItem, index) => {
                    // Determine client and artist based on senderType and receiverType
                    const isSenderUser = chatItem.senderType === "user";
                    const isReceiverUser = chatItem.receiverType === "user";

                    // Extract names and profile images
                    const clientName = isSenderUser ? chatItem.senderName : isReceiverUser ? chatItem.receiverName : "-";
                    const artistName = !isSenderUser ? chatItem.senderName : !isReceiverUser ? chatItem.receiverName : "-";
                    const clientImage = isSenderUser ? chatItem.senderProfileImage : isReceiverUser ? chatItem.receiverProfileImage : "";
                    const artistImage = !isSenderUser ? chatItem.senderProfileImage : !isReceiverUser ? chatItem.receiverProfileImage : "";

                    // Default placeholder image
                    const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

                    return {
                        id: index + 1,
                        cname: (
                            <div className="client-name-field d-flex align-items-center gap-3">
                                <img
                                    src={clientImage || defaultImage}
                                    className="chat-client-profile-image"
                                    alt="Client"
                                />
                                <div>
                                    <b>{clientName || "-"}</b>
                                </div>
                            </div>
                        ),
                        aname: (
                            <div className="client-name-field d-flex align-items-center gap-3">
                                <img
                                    src={artistImage || defaultImage}
                                    className="chat-client-profile-image"
                                    alt="Artist"
                                />
                                <div>
                                    <b>{artistName || "-"}</b>
                                </div>
                            </div>
                        ),
                        action: (
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-info fas fa-eye action-btn"
                                    onClick={() => fetchChatMessages(chatItem)} // Pass full chatItem
                                ></button>
                            </div>
                        ),
                    };
                }),
            };
            setCurrentPage(chat?.pagination?.currentPage);
            setTotalPages(chat?.pagination?.totalPages);
            setTotalChats(chat?.pagination?.totalChats);
            setData(rowData);
        }
    };


    // const handleSearch = () => {
    //     setData([]);
    //     fetchChat(1);
    // };

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };
    const tog_large = () => {
        setmodal_large(!modal_large);
        removeBodyCss();
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="" title="Dashboard" titleLink="/#" breadcrumbItem="All Chats" />


                    <Row>
                        <Col className="col-12">

                            <Card>
                                <CardBody>
                                    <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Chat List</h4>

                                    </div>
                                    {/* <div className="page-title-box d-flex align-items-center justify-content-between py-0 pb-3">
                                        <h4 className="mb-0 font-size-18">Client List</h4>
                                        <div className="d-flex">
                                           
                                            <Button onClick={() => navigate('/client-add')} color="success" className="waves-effect waves-light d-flex align-items-center gap-2 me-1">
                                                <i className="fas fa-plus font-size-16"></i>
                                                Add New Client
                                            </Button>
                                        </div>
                                    </div> */}

                                    {
                                        data ?
                                            <DataTable
                                                data={data}
                                                totalPage={totalPages}
                                                total={totalClients}
                                                currentPage={currentPage}
                                                onPageChange={(pagenumber) => { fetchChat(pagenumber) }}
                                                isLoading={isLoading}
                                            />
                                            : <>
                                                <table className="table table-bordered text-center">
                                                    <thead>
                                                        <tr>
                                                            <th>No Data Found</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>There are no records available.</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </>
                                    }


                                    <Col sm={6} md={4} xl={3}>
                                        <Modal isOpen={modal_large} toggle={tog_large} size="lg">
                                            <ModalHeader className="mt-0" toggle={tog_large}>
                                                Chat History
                                            </ModalHeader>
                                            <ModalBody>

                                                <div className="chat-header d-flex justify-content-between mb-3">
                                                    {/* Client Section */}
                                                    <div className='client-name-field d-flex align-items-center gap-3'>
                                                        <img
                                                            src={clientImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                            className='chat-client-profile-image'
                                                            alt="Client"
                                                        />
                                                        <div>
                                                            <b>{clientName || "-"}</b> <br />
                                                            <span>Client</span>
                                                        </div>
                                                    </div>

                                                    {/* Artist Section */}
                                                    <div className='client-name-field d-flex align-items-center gap-3 text-end'>
                                                        <div>
                                                            <b>{artistName || "-"}</b> <br />
                                                            <span className='text-info'>Artist</span>
                                                        </div>
                                                        <img
                                                            src={artistImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                            className='chat-client-profile-image'
                                                            alt="Artist"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="chat-container rounded">
                                                    {chatHistory.length > 0 ? (
                                                        chatHistory.map((chat, index) => {
                                                            const isCurrentUserSender = chat.senderId === senderId;

                                                            const isSentByArtist = chat.senderType === "artist";

                                                            const messageClass = isSentByArtist ? "sent" : "received";

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`chat-message ${messageClass}`}
                                                                >
                                                                    <p className="chat-text">{chat.message}</p>
                                                                    <span className="chat-time">
                                                                        {moment(chat.createdAt).format('hh:mm A')}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="no-messages">No chat history available.</p>
                                                    )}
                                                </div>
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

export default Chat;
