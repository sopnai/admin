import PropTypes from "prop-types";
import React, { useEffect, useCallback, useRef } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
    const location = useLocation();
    const ref = useRef();

    // Define a mapping of paths to menu items
    const pathToMenuItems = {
        "/dashboard": ["/", "/dashboard"],
        "/client": ["/client", "/client-add", "/client-edit/:id"],
        "/artist": ["/artist", "/artist-add", "/artist-edit/:id"],
        "/booking": ["/booking", "/booking-view/:id"],
        "/services": ["/services", "/service-view/:id", "/sub-services/:id", "/sub-service-view"],
        "/notification": ["/notification"],
        "/chat": ["/chat"],
        "/report": ["/report"],
        "/settings": ["/artist-lvl", "/app-version"],
    };

    const normalizePath = (path) => {
        return path
            .replace(/\/+$/, "") // Remove trailing slashes
            .replace(/\?.*$/, "") // Remove query parameters
            .replace(/\/\d+$/, "/:id") // Replace numeric IDs
            .replace(/\/[0-9a-fA-F-]{36}$/, "/:id")
    };



    const activateParentDropdown = useCallback((item) => {
        item.classList.add("active");
        const parent = item.parentElement;
        const parent2El = parent.childNodes[1];

        if (parent2El && parent2El.id !== "side-menu") {
            parent2El.classList.add("mm-show");
        }

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show"); // ul tag

                const parent3 = parent2.parentElement; // li tag
                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement; // ul
                    if (parent4) {
                        parent4.classList.add("mm-show"); // ul
                        const parent5 = parent4.parentElement;
                        if (parent5) {
                            parent5.classList.add("mm-show"); // li
                            parent5.childNodes[0].classList.add("mm-active"); // a tag
                        }
                    }
                }
            }
            scrollElement(item);
            return false;
        }
        scrollElement(item);
        return false;
    }, []);

    const removeActivation = (items) => {
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            const parent = items[i].parentElement;

            if (item && item.classList.contains("active")) {
                item.classList.remove("active");
            }
            if (parent) {
                const parent2El =
                    parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
                        ? parent.childNodes[1]
                        : null;
                if (parent2El && parent2El.id !== "side-menu") {
                    parent2El.classList.remove("mm-show");
                }

                parent.classList.remove("mm-active");
                const parent2 = parent.parentElement;

                if (parent2) {
                    parent2.classList.remove("mm-show");

                    const parent3 = parent2.parentElement;
                    if (parent3) {
                        parent3.classList.remove("mm-active"); // li
                        parent3.childNodes[0].classList.remove("mm-active");

                        const parent4 = parent3.parentElement; // ul
                        if (parent4) {
                            parent4.classList.remove("mm-show"); // ul
                            const parent5 = parent4.parentElement;
                            if (parent5) {
                                parent5.classList.remove("mm-show"); // li
                                parent5.childNodes[0].classList.remove("mm-active"); // a tag
                            }
                        }
                    }
                }
            }
        }
    };

    const activeMenu = useCallback(() => {
        const pathName = normalizePath(location.pathname);
        const ul = document.getElementById("side-menu");
        if (!ul) return;

        const items = ul.getElementsByTagName("a");
        removeActivation(items);

        let foundActive = false;

        // Iterate through the pathToMenuItems to find a match
        for (const [menuPath, paths] of Object.entries(pathToMenuItems)) {
            if (paths.includes(pathName)) {
                // Find the corresponding menu item and activate it
                for (let i = 0; i < items.length; i++) {
                    const itemPath = normalizePath(new URL(items[i].href, window.location.origin).pathname);
                    if (itemPath === menuPath) {
                        activateParentDropdown(items[i]);
                        foundActive = true;
                        break;
                    }
                }
            }
        }

        // If no match is found, check for direct path matches
        if (!foundActive) {
            for (let i = 0; i < items.length; i++) {
                const itemPath = normalizePath(new URL(items[i].href, window.location.origin).pathname);
                if (pathName === itemPath) {
                    activateParentDropdown(items[i]);
                    foundActive = true;
                }
            }
        }

        // Handle the "Settings" submenu separately
        const settingsMenu = document.querySelector('a[href="/#"]');
        const settingsSubMenu = settingsMenu?.nextElementSibling; // Get the submenu <ul>

        if (pathName === "/" || pathName === "") {
            if (settingsMenu) {
                settingsMenu.classList.remove("mm-active");
            }
            if (settingsSubMenu) {
                settingsSubMenu.classList.remove("mm-show");
            }
        } else if (["/artist-lvl", "/app-version"].includes(pathName)) {
            if (settingsMenu) {
                activateParentDropdown(settingsMenu);
            }
        }
    }, [location.pathname, activateParentDropdown]);

    useEffect(() => {
        ref.current.recalculate();
    }, []);

    useEffect(() => {
        new MetisMenu("#side-menu");
        activeMenu();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        activeMenu();
    }, [activeMenu]);

    function scrollElement(item) {
        if (item) {
            const currentPosition = item.offsetTop;
            if (currentPosition > window.innerHeight) {
                ref.current.getScrollElement().scrollTop = currentPosition - 300;
            }
        }
    }

    return (
        <React.Fragment>
            <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">{props.t("Main")} </li>
                        <li>
                            <Link to="/dashboard" className="waves-effect">
                                <i className="ti-home"></i>
                                <span>{props.t("Dashboard")}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/client" className="waves-effect">
                                <i className="ti-user"></i>
                                <span>Clients</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/artist" className="waves-effect">
                                <i className="ti-cut"></i>
                                <span>Artist</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/booking" className="waves-effect">
                                <i className="ti-ticket"></i>
                                <span>Booking Management</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/training-booking" className="waves-effect">
                                <i className="ti-ticket"></i>
                                <span>Training Booking</span>
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/services" className="waves-effect">
                                <i className="ti-layout-list-post"></i>
                                <span>Services</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/notification" className="waves-effect">
                                <i className="ti-bell"></i>
                                <span>Notification</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/chat" className="waves-effect">
                                <i className="ti-comment-alt"></i>
                                <span>Chat</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/report" className="waves-effect">
                                <i className="ti-list"></i>
                                <span>Revenue Report</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ti-settings"></i>
                                <span>{props.t("Settings")}</span>
                            </Link>
                            <ul className="sub-menu" aria-expanded="false">
                                <li>
                                    <Link to="/artist-lvl">{props.t("Artist Level")}</Link>
                                </li>
                                <li>
                                    <Link to="/app-version">{props.t("App Version")} </Link>
                                </li>
                                <li>
                                    <Link to="/page/terms-and-condition">{props.t("Terms and Condition")} </Link>
                                </li>
                                <li>
                                    <Link to="/page/privacy-policy">{props.t("Privacy Policy")} </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </SimpleBar>
        </React.Fragment>
    );
};

SidebarContent.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));