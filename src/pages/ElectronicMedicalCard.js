import React, { Fragment } from "react";
import MedicalDate from "../components/MedicalDate/MedicalDate";
import { Navbar } from "../components/Navbar";

export const ElectronicMedicalCard = () => {
         
    return (
        <Fragment>
            <Navbar />
            <MedicalDate />
        </Fragment>
      );
    
}


export default ElectronicMedicalCard;