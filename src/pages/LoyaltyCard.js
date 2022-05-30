import React, { Fragment, useEffect } from "react";
import MyVisitsList from "../components/MyVizits/MyVisitsList";
import LoyaltyCardContent from "../components/LoyaltyCard/LoyaltyCardContent";
import { Navbar } from "../components/Navbar";

export const LoyaltyCard = () => {
    
    return (
      <Fragment>
          <Navbar />
          <LoyaltyCardContent />
      </Fragment>
    );
  };



export default LoyaltyCard;