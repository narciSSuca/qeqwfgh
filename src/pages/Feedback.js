import React, { Fragment } from "react";
import FeedbackMessage from "../components/Feedback/FeedbackMessage";
import { Navbar } from "../components/Navbar";

export const Feedback = () => {
return (
        <Fragment>
            <Navbar />
            <FeedbackMessage />
        </Fragment>
      );
    
}


export default Feedback;