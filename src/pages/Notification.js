import React, { Fragment, useEffect } from "react";
import NotificationList from "../components/Notification/NotificationList";
import { Navbar } from "../components/Navbar";

export const Notification = () => {
    
    return (
      <Fragment>
          <Navbar />
          <NotificationList />
      </Fragment>
    );
  };



export default Notification;