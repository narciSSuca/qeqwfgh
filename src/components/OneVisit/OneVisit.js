import React, { useState , useEffect } from "react";
import { getCookie } from "../../helpers/cookie";
import { api } from "../../helpers/api";
import './OneVisit.scss';
import { useParams, useNavigate } from "react-router-dom";
import ModalPayment from "../ModalPayment/ModalPayment";

export const OneVisit = () => {
 const [modalActive, setModalActive] = useState(false);
 const [selectStar, setSelectStar] = useState(0);
 const [starDirty, setStarDirty] = useState(false);
 const [starError, setStarError] = useState();

  

  let encodeArray = JSON.parse(getCookie("CARDARRAY"));
  let encodeOrder = JSON.parse(getCookie("ORDERARRAY"));

  let encodeReview = JSON.parse(getCookie("CARDREVIEW"));;

  console.log(encodeReview);


  console.log(encodeArray);
  let token = getCookie('token');
  let paramsURL = useParams();
  let textInput = React.createRef();
  console.log(token);

  const navigate = useNavigate();

  let star = [];

  for (let i = 0; i < 5; ++i) {
    star.push(i+1);
  }

  function cardValid(encodeArray) {

    let request = "";

    if(encodeArray.documentSumDiscount > 0) {
      request = <>
              <div className="text-try">
                <p>оплачено</p>
              </div>
            </>;
    }

    if(encodeArray.documentPaySum !== null && encodeArray.documentPaySum > 0) {
      if (encodeArray.documentPaySum < encodeArray.documentSumDiscount) {
        request = <>
                <div className="text-try">
                  <p>оплачено {encodeArray.documentPaySum}</p>
                </div>
              </>
      } else if (encodeOrder !== null && encodeOrder.orderSum !== null && encodeOrder.orderSum < encodeArray.documentSumDiscount) {
        request = <>
                <div className="text-try">
                  <p>оплачено {encodeOrder.orderSum}</p>
                </div>
      </>;
      } 
    }

    if (encodeOrder !== null && encodeOrder.orderDate !== null && encodeArray.paymentStatus) {
      request = <>
              <div className="text-try">
                <p>оплачено <a href="#">{"Счёт №" + encodeOrder.orderNumber}</a></p>
              </div> 
            </>  
    }

    return request;
  }

  function cardNotValid(encodeArray) {
    let request = "";
    let send = "не оплачено";
    request = <>
                <div className="text-fallse">
                  <p> не оплачено</p>
                </div> 
              </>

    if (encodeArray.documentPaySum !== null && encodeArray.documentPaySum > 0) {
      if (encodeArray.documentPaySum < encodeArray.documentSumDiscount){
      
        request = <>
                <div className="text-try">
                  <p>оплачено {encodeArray.documentPaySum}</p>
                </div>
                </>; 
        
      }
    }

    if (encodeArray.documentSumDiscount > 0 ) {
      console.log(encodeOrder);
      if (encodeOrder !== null) {
        if (!encodeOrder.paymentStatus) {
          request = <>
          <div className="text-try">
            <p>оплачено {encodeArray.documentPaySum}</p>
          </div>
          
          <div>
            <button onClick={e =>setModalActive(true)} >Оплатить</button>
          </div>
          </>;
      }
        
    }
      }
      
     
     return request;
  }

  useEffect(() => {
        let addedTime = document.querySelectorAll('.star-rating');
        addedTime.forEach( div => {
            if (div.id <= selectStar) {
              div.style.color = "green";
            
            }

            if (div.id > selectStar) {
              div.style.color = "#bfbfbf";
            }
        })
  }, [selectStar]);

  async function CancelRecord(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let body = {medorgId: 1,barcode: getCookie('BARCODE'), phone: getCookie('PHONEUSER'),recordGUID: encodeArray.internetEntryGUID}
    body = new URLSearchParams(Object.entries(body)).toString();     

    let temp = await api(
        'https://patient.simplex48.ru/api/reception/CancelRecord',
        'POST',
        body,
        myHeaders
      )
      navigate('/visits');  
    
  }
  
  async function SetReview(){
    if (selectStar > 0) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+token);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      let body = {medorgId: 1,
                  barcode: getCookie('BARCODE'),
                  phone: getCookie('PHONEUSER'),
                  recordGUID: encodeArray.internetEntryGUID,
                  rating: selectStar,
                  review: textInput.current.value};

      body = new URLSearchParams(Object.entries(body)).toString();     

      let temp = await api(
          'https://patient.simplex48.ru/api/reception/SetReview',
          'POST',
          body,
          myHeaders
        );
      
      navigate('/visits');
    } else {
      setStarError("Поставьте оценку");
    }   
  }

  async function getEMKDate(guid) {
    let token = getCookie('token');

    let paymentHeaders = new Headers();
    paymentHeaders.append("Authorization", "Bearer "+token);
    paymentHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
    let paymentBody = {medorgId: 1,
                      barcode: getCookie("BARCODE"),
                      phone: getCookie("PHONEUSER"),
                      recordGUID: guid}
                      
   paymentBody = new URLSearchParams(Object.entries(paymentBody)).toString();     
      
  let  tempPayment = await api(
        'https://patient.simplex48.ru/api/reception/GetMedicalData',
        'POST',
        paymentBody,
        paymentHeaders
    )

    
  }
console.log()
getEMKDate();
    return ( <>
    <div className="content">
        <div className="title-info">
          <p className="date-visit">{encodeArray.date.split('T')[0]}</p>
          <p className="time-visit">{encodeArray.timeString}</p>
          <p>{encodeArray.branchName}</p>
        </div>

        <div className="worker-info">
          <p><b>{encodeArray.doctorName}</b></p>
          <p>{encodeArray.workerName}</p>
        </div>

        <div className="payment-status">

         <div>
          {encodeArray.sum - encodeArray.sumDiscount !== 0
          ? (<p>Cкидка {encodeArray.sum - encodeArray.sumDiscount}.р</p>)
          : (<></>)}
        
            <p>Итого: {encodeArray.sumDiscount}.0 р.</p>
          </div>    
            {encodeArray.paymentStatus
              ? (
                cardValid(encodeArray)
              ) : (
                cardNotValid(encodeArray)
              )  
              }          



         
          
          { typeof encodeArray.paymentStatus === "boolean" && !!!encodeArray.paymentStatus && encodeArray.internetRecordState === 1
            ? (<button onClick={e =>setModalActive(true)} >Оплатить</button>)
            : (<p>  </p>)}
          {paramsURL.array !== "history" && (encodeArray.internetRecordState === 1 || encodeArray.internetRecordState === 0) ? (<button onClick={e => CancelRecord()} className="reset-button">Отменить запись на приём</button>) : ""}

        </div>
        <div>
          <p><b>Услуги:</b></p>
          {encodeArray.services.map(value => (
            <div key={value.$id} className="services-list">
              <p> {value.servName}</p>
              <p> {value.cost}p.</p>
            </div>

          ))}
        </div>
        
        {paramsURL.array == "history" && encodeArray.paymentStatus == true && encodeReview ?  (
          <>
            {encodeReview !== null && encodeReview.rating == null && encodeReview.review == null ? ( 
              <div className="rating-content">
                <hr>
                  {/* линия */}
                </hr>  

                <div>

                  <div className="rating-title">
                    <p><b>Оценка посещения:</b></p>
                  </div>

                  <div className="raiting" >   
                  {star.map(value => (
                    <div className="star-rating selected-star" onClick={e=> setSelectStar(e.target.id)} key={value} id={value}>★</div>
                  ))
                  }
                   
                  </div>
                  
                </div>

                <textarea ref={textInput} placeholder="Введите отзыв о посещении" ></textarea>  
                <button onClick={e => SetReview()}>Отправить</button>
             </div>
            ) : (
              <div className="rating-content">
                <hr>
                  {/* линия */}
                </hr>  

                <div>

                  <div className="rating-title">
                    <p><b>Оценка посещения:</b></p>
                  </div>

                  <div className="rating">  
                    {star.map(value => (
                      <div key={value}>
                        {encodeReview !== null && encodeReview.rating >= value ? (
                          <div className=" selected-stars"  key={value} id={value}>★</div>
                        ) : (
                          <div className=" star-rating"  key={value} id={value}>★</div>
                        )}
                        
                      </div>
                    ))
                    }</div>

                </div>
                {encodeReview !== null ? (<p>{encodeReview.review}</p>) : ("")}
                
             </div>
            )} 
          </>
        ) : ("")}
          <ModalPayment active={modalActive} setActive={setModalActive} type={0}/> 
      </div>
      </>
    )
    
  }
export default OneVisit;