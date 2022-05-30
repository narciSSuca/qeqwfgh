import React, { useState, useEffect} from "react";
import { getCookie, setCookie } from "../../helpers/cookie";
import { api } from "../../helpers/api";
import './NotificationList.scss';

export const NotificationList = () => {
    ///api/notification/GetMessages
    const [messageList, setMessageList] = useState([]);
    const [selectedCard, setSelectedCard] = useState([]);
    const [cout,setCout] = useState(0);
    
    async function GetMessage() {
        
        let paymentHeaders = new Headers();
        let token = getCookie('token');
        paymentHeaders.append("Authorization", "Bearer "+token);
        paymentHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        let paymentBody = {medorgId: getCookie('MEDORGID'),
                          barcode: getCookie('BARCODE'),
                          phone: getCookie('PHONEUSER'),
                          messageType: 0,
                          onlyNew: false
           }
    
       paymentBody = new URLSearchParams(Object.entries(paymentBody)).toString();
    
        let tempPayment = await api(
            'https://patient.simplex48.ru/api/notification/GetMessages',
            'POST',
            paymentBody,
            paymentHeaders
        )               
       setMessageList(tempPayment['messages'])
       setCout(1);
 }



    useEffect(() => {
       
        GetMessage()
    }, [setMessageList, setSelectedCard])


    console.log(cout);
    console.log(messageList);

    async function getSingleNotification(id) {
        messageList.forEach(element => {
           if (element['id'] === id) {
               setSelectedCard(element);
               element.readed = true;
           } 
        });

        let paymentHeaders = new Headers();
        let token = getCookie('token');
        paymentHeaders.append("Authorization", "Bearer "+token);
        paymentHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        let paymentBody = {medorgId: getCookie('MEDORGID'),
                          barcode: getCookie('BARCODE'),
                          phone: getCookie('PHONEUSER'),
                          messageId: id
           }
    
       paymentBody = new URLSearchParams(Object.entries(paymentBody)).toString();
    

        let tempPayment = await api(
            'https://patient.simplex48.ru/api/notification/MarkAsReaded',
            'POST',
            paymentBody,
            paymentHeaders
        )

        tempPayment = await api (
            'https://patient.simplex48.ru/api/notification/GetMessage',
            'POST',
            paymentBody,
            paymentHeaders            
        )
        if (tempPayment.imageExists) {
            tempPayment.image = `data:image/jpg;base64,${tempPayment.image}`;
            
        }
        console.log(tempPayment);
        setSelectedCard(tempPayment);
    }

    async function deleteSingleNotification() {
        
        let paymentHeaders = new Headers();
        let token = getCookie('token');
        paymentHeaders.append("Authorization", "Bearer "+token);
        paymentHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        let paymentBody = {medorgId: 1,
                          barcode: getCookie('BARCODE'),
                          phone: getCookie('PHONEUSER'),
                          messageId: selectedCard.id
           }
    
       paymentBody = new URLSearchParams(Object.entries(paymentBody)).toString();
    
        let tempPayment = await api(
            'https://patient.simplex48.ru/api/notification/DeleteMessage',
            'POST',
            paymentBody,
            paymentHeaders
        )
      GetMessage();
      setSelectedCard([]);
    }

    function toISODate(milliseconds) {

    }

    function createDate(milliseconds) {

        var date = new Date(milliseconds);
        var y = date.getFullYear()
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();

        m = (m < 10) ? '0' + m : m;
        d = (d < 10) ? '0' + d : d;
        h = (h < 10) ? '0' + h : h;
        mi = (mi < 10)?'0' + mi:mi;
        


        return <p>{y}-{m}-{d} {h}:{mi}</p>; 
    }
   
    return (
   <>   
        <div className="body-notification">
            <div className="cards notification">
                {messageList.map(article => (
                    <div onClick={e=> getSingleNotification(article.id)} className="card notification" key={article.$id}>
                        <div className="card-body">
                            <h3> {article.title}</h3>
                            {createDate(article.сreationDate)}
                           {// <p>{article.сreationDate.split('T')[0]} {article.сreationDate.split(':')[0] }</p>
 }
                        </div>
                        
                            
                            {article.readed === true ? ( <div className="card-pult none">
                                    <div className="ring-notification none">
                                    </div>
                                    <p>прочитано</p>
                                    </div>
                            ) : (
                                <div className="card-pult">
                                    <div className="ring-notification">
                                    </div>
                                    <p>не прочитано</p>
                                    </div>
                            )}
                            
                       
                    </div>
                ))}
            </div>
            {selectedCard.length != 0 ? (
                <div className="singl-notification ">
                <div className="single-card">
                    {selectedCard.imageExists ? (
                    <div>
                        <img className="img-single" src={selectedCard.image}></img>
                    </div>  
                    ): (
                        <>
                        </>
                    )}
                    <div className="single-body">
                        <h3> {selectedCard.title}</h3>
                        <p>{selectedCard.message}</p>
                        <div>
                            <a className="btn btn-danger" onClick={e=> deleteSingleNotification()}>удалить</a>
                        </div>
                    </div>
                    
                    
  
                </div>
            </div>
            ) : (
                <>
                    
                </>
                
            )}
                
        </div>
   </>
    )
};



export default NotificationList;    