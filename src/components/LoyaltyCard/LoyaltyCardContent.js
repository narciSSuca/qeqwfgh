import React, { useState, useEffect} from "react";
import { getCookie, setCookie } from "../../helpers/cookie";
import './LoyaltyCardContent.scss';

export const LoyaltyCardContent = () => {

    let medCard = JSON.parse(getCookie('CARDPERS'));
    let userCard = JSON.parse(getCookie('USERDATA'));

    return (
        <div className="loyalty-card">
            <div className="card-loyl">
                
                <div className="card-name">
                    <img src="logoClinik.png"></img>
                    
                    <div className="user-fio">
                        <p>{userCard.surname} {userCard.name}</p> 
                        <p>{userCard.patronymic}</p>
                    </div>
                </div>
               
                <div className="user-bonus">
                    {medCard.discount > 0 ? (
                        <div className="user-diskount bonus-item">
                            <p className="card-item"><b>Cкидка:</b></p>
                            <p className="card-item">{medCard.discount}.0%</p>
                        </div>
                    ) :
                    (
                        <></>
                    )}

                    {medCard.useBonusPoints ? (
                        <div className="user-points bonus-item">
                            <p className="card-item"><b>Накоплено баллов:</b></p>
                            <p className="card-item">{medCard.bonusPoints}</p>
                        </div>
                    ) : (
                        <></>
                    )

                    }


                </div>

            </div>
        </div>
    )
};



export default LoyaltyCardContent;    