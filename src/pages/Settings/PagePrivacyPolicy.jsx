import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Badge, Button, BreadcrumbItem, Card, CardTitle, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { pageGetAction, pageUpdateAction } from 'store/actions';
import { ErrorAlert, SuccessAlert } from 'components/Alert/Alert';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const PagePrivacyPolicy = () => {

    document.title = "Privacy Policy Page | Flawless Admin Panel";
    const dispatch = useDispatch();
    const [btnLoading, setBtnLoading] = useState(false);
    const [pageDescription, setPageDescription] = useState();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [dynamicData, setDynamicData] = useState(null);

    useEffect(() => {
        fetchPageData();
    }, []);

    const fetchPageData = async () => {
        const pagelist = await pageGetAction();
        if (pagelist?.data[1]?.page_description) {
            const blocksFromHTML = convertFromHTML(pagelist?.data[0]?.page_description);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
    };

    const handleSubmit = async () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = stateToHTML(contentState);
        try {
            const payload = {
                "pageTitle": "Privacy Policy",
                "pageDescription": rawContent
            }
            await pageUpdateAction(payload).then((res) => {
                SuccessAlert(res?.message || "Detail updated successfully!");
            }).catch((err) => {
                ErrorAlert(err);
            })
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    <Breadcrumb maintitle="Dashboard" title="Pages" titleLink="/#" breadcrumbItem="Privacy Policy"
                        handleSubmit={() => handleSubmit()}
                        isBtn={true}
                        btnLoading={btnLoading}
                        disabled={btnLoading}
                        btnTitle={
                            <>
                                Update Details
                            </>
                        }
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <div className='col-md-12'>
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange={(ed) => { setEditorState(ed) }}
                                            />
                                        </div>
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

export default PagePrivacyPolicy;
