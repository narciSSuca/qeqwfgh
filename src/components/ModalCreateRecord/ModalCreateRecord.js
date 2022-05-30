import React, { useState, useEffect} from "react";
import "./modalC.scss";
import ModalPayment from "../ModalPayment/ModalPayment";
import { getCookie, setCookie } from "../../helpers/cookie";
import { api } from "../../helpers/api";
import { useNavigate, Link } from "react-router-dom";


export const ModalCreateRecord = ({active,setActive,specialization}) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    let tempPayment = "";

    const [formSelected, setFormSelected] = useState('');

    const [specSelectedId, setSpecSelectedId] = useState('');
    const [specSelectedName, setSpecSelectedName] = useState('');
    const [specDirty, setSpecDirty] = useState(false);
    const [specError, setSpecError] = useState("Выберите специальность");

    const [clinicSelectedId, setClinicSelectedId] = useState('');
    const [clinicSelectedName, setClinicSelectedName] = useState('');
    const [clinicDirty, setClinicDirty] = useState(false);
    const [clinicError, setClinicError] = useState("Выберите клинику");

    const [doctorSelectedId, setDoctorSelectedId] = useState('');
    const [doctorSelectedName, setDoctorSelectedName] = useState('');
    const [activInfo, setActivInfo] = useState(false);
    const [doctorSelectedPhoto, setDoctorSelectedPhoto] = useState([]);
    const [doctorSelectedDesc, setDoctorSelectedDesc] = useState([]);

    const [serviceSelectedId, setServiceSelectedId] = useState([]);
    const [serviceSelectedName, setServiceSelectedName] = useState([]);
    const [servicesSelected, setServicesSelected] = useState([]);

    const [elem, setElem] = useState();

    const [services, setServices] = useState([]);

    const [days, setDays] = useState();
    const [selectedMonth, setSelectedMonths] = useState();
    const [selectedDays, setSelectedDays] = useState();

    const [timeBlock, setTimeBlock] = useState({"$id":"3",
    "worker_id":21,
    "sched_id":5841,
    "medorg_id":1,
    "branch_id":1,
    "doctor_id":0,
    "cells":[]});
    const [selectedTimeBlock, setSelectedTimeBlock] = useState('');
    const [idNewRecord, setIdNewRecord] = useState('');

    const [maxOpenStep, setMaxOpenStep] = useState(0);
    const [step, setStep] = useState(0);

    const [workers, setWorkers] = useState([]);
    const [clinics, setClinics] = useState([]);
    let clinicInput = React.createRef();
    let specInput = React.createRef();
    
    function movingAroundMap(newStep) {
        if(newStep <= maxOpenStep){
            setStep(newStep);
        }
    }

    useEffect(() => {
        if (step > maxOpenStep) {
            setMaxOpenStep(step);
        }
    },[step]);


    useEffect(() => {
        console.log(maxOpenStep);
        console.log(step);
        //  let arwe = maxOpenStep;
        // //setMaxOpenStep(maxOpenStep.append(step));
        // // arwe.push(4);
        // // console.log(arwe);

        // maxOpenStep.forEach(element => {
        //     if(element != step) {
        //         console.log(step);
        //         console.log(maxOpenStep);
        //         // let arwe = maxOpenStep;
        //         // setMaxOpenStep(arwe.push(step))
        //     }
        // });

        if (active === false) {
            setStep('no');
        } else {
            if (step === 'no') {
                setStep(0);
                setMaxOpenStep(0);
            }
        }

        if (step === 3) {                                                   //БЛОКИ ВРЕМЕНИ
            let addedTime = document.querySelectorAll('.time-block');
            addedTime.forEach( div => {
                div.addEventListener('click', ()=>{
                    let addedDiv = document.querySelectorAll('.time-block');    
                    addedDiv.forEach(block => {
                        block.style.backgroundColor =  "#aae6aa";;    
                    })                
                    div.style.backgroundColor =  "#9db7e7";
                })
            })
        }

        if (step === 2 || step === 3) {                                     //МЕСЯЦА И ЛОГИКА КЛИКОВ ПО МЕСЯЦАМ
            let addedTr = document.querySelectorAll('.added-tr');
            addedTr.forEach( tr => {
                tr.addEventListener('click', ()=>{
                    setSelectedMonths(tr.id);
                    setSelectedDays('');
                    setSelectedTimeBlock('');
                    setStep(2);
                    createCalendar(2022, tr.id);
                    let addedDiv = document.querySelectorAll('.time-block');    
                    addedDiv.forEach(block => {
                        block.style.backgroundColor =  "#aae6aa";;    
                    })
                })
            })


            let dataP = document.querySelectorAll('.dataP');   
                    
            dataP.forEach( p => {                                            //ЛОГИКА ДНЕЙ И СТИЛЕЙ ИХ       
                for (let key in days[selectedMonth]) {
                    if ( p.id == days[selectedMonth][key]) {
                        
                        p.className = "active-days";
                        p.addEventListener('click', ()=>{
                        let dataPReb = document.querySelectorAll('.selected-active-days');
                        dataPReb.forEach(pDiv =>{
                            
                            for (let non in days[selectedMonth]) {
                                if ( pDiv.id == days[selectedMonth][non]) {
                                     pDiv.className = "active-days";
                                }
                            }         
                        })
                            let lenId = p.id;
                            if (lenId < 10) {
                                setSelectedDays(`0${p.id}`);
                                lenId = `0${p.id}`;     
                            } else {
                                setSelectedDays(p.id);
                                lenId = p.id;
                            }    
                            p.className = "selected-active-days";
                            GetTimeBloks(lenId);
                        })

                    }
                }
            })
                
        }
    });

    const moveStart = () => {      //КНОПКА ПЕРЕХОДА В НАЧАЛО
        setStep(0);
        setClinicSelectedId('');
        setClinicSelectedName('');
        setSpecSelectedName('');
        setSpecSelectedId('');
        setDoctorSelectedId('');
        setDoctorSelectedName('');
        setDoctorSelectedDesc('');
        setDoctorSelectedPhoto([]);
        setSelectedMonths('');
        setSelectedDays('');
        setSelectedTimeBlock('');
        setServices([]);
    }

    const setClinic = (event)=> {
        setClinicSelectedId(event.target.id);
        setClinicSelectedName(event.target.value);

        GetWorkers(event.target.id, specSelectedId);
        setStep(1);
    }

    const setSpecialization = (event) => {
        setSpecSelectedId(event.target.id);
        setSpecSelectedName(event.target.value);   
        setSpecDirty(true);
        setSpecError(``);

        GetClinic(event);
    }
    
    const setDoctor = (event) => {
        setDoctorSelectedId(event.target.id);
        setDoctorSelectedName(event.target.value);

        for (let prop in workers) {
            if (workers[prop]['id'] == event.target.id) {
                if (workers[prop]['photo'] == -1){
                    setDoctorSelectedPhoto(`i.webp`);
                } else {
                    setDoctorSelectedPhoto(`data:image/jpg;base64,${workers[prop]['photo']}`);
                }
                if (workers[prop]['desc'] == -1){
                    setDoctorSelectedDesc('Описание врача отсутствует');
                } else {
                    setDoctorSelectedDesc(workers[prop]['desc']);
                }
            } 
        }
        setActivInfo(true);
    }

     function createCalendar( year, month) {
        let months = `<div class="header-table">`;
        let d = '';
        for (let key of Object.keys(days)) {
            d = new Date(year, key-1);
            if (key == selectedMonth) {
                months = months + `<p id=${key} class="added-tr"}><b>` + d.toLocaleString('default', { month: 'long' }) + "</b></p>";
            } else {
                months = months + `<p id=${key} class="added-tr"}>` + d.toLocaleString('default', { month: 'long' }) + "</p>";    
            }
                
        }
        console.log(months);
        let mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
        d = new Date(year, mon);
        let table = `${months}
                        </p></div>
                    <table>
                        <tr>
                            <th>пн</th>
                            <th>вт</th>
                            <th>ср</th>
                            <th>чт</th>
                            <th>пт</th>
                            <th>сб</th>
                            <th>вс</th>
                        </tr>
                        <tr>`;
  
        // пробелы для первого ряда
        // с понедельника до первого дня месяца
        // * * * 1  2  3  4
        for (let i = 0; i < getDay(d); i++) {
          table += '<td></td>';
        }
  
        // <td> ячейки календаря с датами
        while (d.getMonth() == mon) {
          table += `<td id=${d.getDate()} class="dataP">` + d.getDate() + '</td>';
  
          if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
            table += '</tr><tr>';
          }
  
          d.setDate(d.getDate() + 1);
        }
  
        // добить таблицу пустыми ячейками, если нужно
        // 29 30 31 * * * *
        if (getDay(d) != 0) {
          for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
          }
        }
  
        // закрыть таблицу
        table += '</tr></table>';
  
        // let elem = document.getElementById('calendar');
        // elem.innerHTML = table;

        setElem(table);
    }
  
      function getDay(date) { // получить номер дня недели, от 0 (пн) до 6 (вс)
        let day = date.getDay();
        if (day == 0) day = 7; // сделать воскресенье (0) последним днем
        return day-1;
      }
    
    function getNameMonth(year,month) {
        let d = new Date(year, month-1);
        return d.toLocaleString('default', { month: 'long' });    
        
    }

    function serviceArrayShow(e) {                    //ФОРМИРОВАНИЕ УСЛУГ И СОХРАНЕНИЕ 
        let checkArray = new Array;
        let addedDiv = document.querySelectorAll('.service-check');    
        let allServices = new Array;
        let oneServices = {};

        addedDiv.forEach(block => {
            if(block.checked)  {
                checkArray.push(block.id);
            }
        })  

        services.forEach(service => {
            console.log(service.id);
            oneServices = {
                number: service.$id,
                servId: service.id,
                count: 1,
                cost: service.price,
                name: service.name
            }
            checkArray.forEach(idServicesPush => {
                if(idServicesPush == service.$id) {
                    allServices.push(oneServices);    
                }
            })
        })    
        setStep(5);
        setServicesSelected(allServices);

    }

    async function GetClinic(event){
        let temp = await api(
            `https://patient.simplex48.ru/api/Web/clinic/1/${event.target.id}`,
            'GET',
            {}, 
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        setClinics(temp);
        setClinicSelectedId(temp[0]['id']);
        setClinicSelectedName(temp[0]['name']);
        if (temp.length === 1) {
           GetWorkers(temp[0]['id'],event.target.id);
           setStep(1);
        }
    }

    async function GetWorkers(clinic, spec) {
        let temp = await api(
            //api/Web/allmedicdesc/{MEDORG_ID}/{BRA_ID}/{DOCT_ID}
            `https://patient.simplex48.ru/api/Web/allmedicdesc/1/${clinic}/${spec}`,
            'GET',
            {}, 
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        setWorkers(temp);            
    }

    async function GetTime() {
       
        let temp = await api(
            `https://patient.simplex48.ru/api/Web/freeDaysAllMedicByWorkers/1/${clinicSelectedId}/${specSelectedId}/${doctorSelectedId}/?RECEPTION_KIND=1`,
            'GET',
            {}, 
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        if ( typeof temp['WorkerWorkingDaysList'][0] !== 'undefined') {
            setDays(temp['WorkerWorkingDaysList'][0]['WorkingDayList']);
            
            let qwe = [];
            for (let i = 0; i < temp['WorkerWorkingDaysList'][0]['WorkingDayList'].length; i++) { 
                qwe[temp['WorkerWorkingDaysList'][0]['WorkingDayList'][i]['FreeDay'].substr(5,2).replace(/^0+/, '')] = [];
                }
            for (let key of Object.keys(qwe)) {
                for (let k = 0; k < temp['WorkerWorkingDaysList'][0]['WorkingDayList'].length; k++) {
                if (key === temp['WorkerWorkingDaysList'][0]['WorkingDayList'][k]['FreeDay'].substr(5,2).replace(/^0+/, '')) {
                        qwe[key].push(temp['WorkerWorkingDaysList'][0]['WorkingDayList'][k]['FreeDay'].substr(8,2).replace(/^0+/, ''));
                }
            }
            }
            console.log(qwe);
            setDays(qwe);
            setSelectedMonths(4);
            createCalendar( 2022, 4);

        } else {
            let elem = document.getElementById('calendar');
            elem.innerHTML = `<p align="center" fontcolor="red"> К сожалению у выбранного вами врача отсутствует информация о расписании приёма пациентов </p>`;
        }  
        setStep(2);
    }
    

    async function GetTimeBloks(day) {
        let token = getCookie('token');
        var getTimeHeaders = new Headers();
        getTimeHeaders.append("Authorization", "Bearer "+token);
        getTimeHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        


        let getTimeBody = {medorg_id: 1,
                            branch_id: clinicSelectedId,
                            worker_id: doctorSelectedId,
                            doctor_id: specSelectedId,
                            date_start: `2022-${selectedMonth.length >= 10 ? (selectedMonth) :(`0${selectedMonth}`)}-${day}`,
                            date_end: `2022-${selectedMonth.length >= 10 ? (selectedMonth) :(`0${selectedMonth}`)}-${day}`,
                            reception_kind: '1'
        }
        getTimeBody = new URLSearchParams(Object.entries(getTimeBody)).toString();    
        
        let temp = await api(
            `https://patient.simplex48.ru/api/Web/WorkerCells`,
            'POST',
            getTimeBody, 
            getTimeHeaders
        )
        setTimeBlock(temp['workers'][0]['schedule'][0]);
        setStep(3);
    }
    
    async function GetService(event){
        let temp = await api(
            //api/Web/clinic/{MEDORG_ID}/{DOCT_ID} 
            `https://patient.simplex48.ru/api/Web/allService/${1}/${specSelectedId}/?SOURCE=${1}&WORK_ID=${0}`,
            'GET',
            {}, 
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        setServices(temp);
        setStep(4);
    }

    async function RecordMobail(paymentCount){
        let MYINFOARRAY = JSON.parse(getCookie('USERDATA'));
        let token = getCookie('token');
        var recordMobileHeaders = new Headers();
        recordMobileHeaders.append("Authorization", "Bearer "+token);
        recordMobileHeaders.append("Content-Type", "application/x-www-form-urlencoded");


            // let recordMobileBody = {
            //                     MEDORG_ID: 1,
            //                     BRA_ID: clinicSelectedId,
            //                     WORK_ID: doctorSelectedId,
            //                     DOCT_ID: specSelectedId,
            //                     Date: `2022-${selectedMonth.length >= 10 ? (selectedMonth) :(`0${selectedMonth}`)}-${selectedDays}`,
            //                     timeInterval: selectedTimeBlock,
            //                     Name: MYINFOARRAY.name,
            //                     Phone: getCookie('PHONEUSER'),
            //                     seoCode: "",
            //                     clientCardNumber: "0100210000000113",
            //                     firstName: MYINFOARRAY.name,
            //                     middleName: MYINFOARRAY.surname,
            //                     lastName: MYINFOARRAY.patronymic,
            //                     birthday: MYINFOARRAY.bornDate,
            // }
            // recordMobileBody = new URLSearchParams(Object.entries(recordMobileBody)).toString();    

            let urlencoded = new URLSearchParams();
                urlencoded.append("MEDORG_ID", "1");
                urlencoded.append("BRA_ID", clinicSelectedId);
                urlencoded.append("WORK_ID", doctorSelectedId);
                urlencoded.append("DOCT_ID", specSelectedId);
                urlencoded.append("Date", `2022-${selectedMonth.length >= 10 ? (selectedMonth) :(`0${selectedMonth}`)}-${selectedDays}`);
                urlencoded.append("timeInterval", selectedTimeBlock);
                urlencoded.append("Name", MYINFOARRAY.name);
                urlencoded.append("Phone", getCookie('PHONEUSER'));            
                urlencoded.append("seoCode", "");    
                urlencoded.append("clientCardNumber", getCookie('BARCODE'));
                urlencoded.append("firstName", MYINFOARRAY.name);
                urlencoded.append("middleName", MYINFOARRAY.surname);
                urlencoded.append("lastName", MYINFOARRAY.patronymic);
                urlencoded.append("birthday", MYINFOARRAY.bornDate);

                for (let index = 0; index < servicesSelected.length; index++) {
                    urlencoded.append(`services[${index}][number]`, servicesSelected[index].number);
                    urlencoded.append(`services[${index}][servId]`, servicesSelected[index].servId);
                    urlencoded.append(`services[${index}][count]`, servicesSelected[index].count);
                    urlencoded.append(`services[${index}][cost]`, servicesSelected[index].cost);
                }

            let temp = await api(
                //api/Web/clinic/{MEDORG_ID}/{DOCT_ID} 
                `https://patient.simplex48.ru/api/Web/recordMobile`,
                'POST',
                urlencoded, 
                recordMobileHeaders
            )

            setIdNewRecord(temp);
            
        let askServer = await api(
            //api/Web/clinic/{MEDORG_ID}/{DOCT_ID} 
            `https://patient.simplex48.ru/api/Web/confirmationMobile/1/${temp}`,
            'GET',
            {},
            recordMobileHeaders
           )
        setStep(6);
    }

    async function getURL() {
        let userData = JSON.parse(getCookie("USERDATA"));
        let token = getCookie('token');
    
        let paymentHeaders = new Headers();
        paymentHeaders.append("Authorization", "Bearer "+token);
        paymentHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        let stringUrl = 'https://narcissuca.github.io/#/home';

        let paymentBody = {medorgId: 1,
                          surname: userData.surname,
                          name: userData.name,
                          patronimic: userData.patronymic,
                          bornDate: userData.bornDate,
                          sex: userData.sex,
                          idr: idNewRecord,
                          returnLink: stringUrl}
                          
       paymentBody = new URLSearchParams(Object.entries(paymentBody)).toString();     
          
        tempPayment = await api(
            'https://patient.simplex48.ru/api/Web/CreateOrder',
            'POST',
            paymentBody,
            paymentHeaders
        )
        //setDocumentPage(tempPayment.document.content.split('</html>')[0]);
        // setDocumentPage(tempPayment.document.content);
        setCookie('paymentUrl', tempPayment.order.paymentURL, {});
        localStorage.setItem('URL',tempPayment.order.paymentUrl);
        localStorage.setItem('DOGOVOR', tempPayment.document.content.split('</html>')[0]);
        setStep(7);
    }

    function getPaymentURL() {
        // localStorage.setItem('DOGOVOR', tempPayment.document.content.split('</html>')[0]);
        window.location.href = localStorage.URL;
        // console.log(documentPage);
    }     

    function getValidMonth() {
        let month = new Date(2022, selectedMonth-1).toLocaleString('default', { month: 'long' });
        
        const result = month.charAt(0).toUpperCase() + month.slice(1)
        return result;
       
    }

    return (
    <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
             <div className="form-record"  onClick={e => e.stopPropagation()}>
                <p className="form-title"><b>ЗАПИСЬ НА ПРИЁМ</b></p>
                <div className="step">
                    <p className="title-step" onClick={e=> movingAroundMap(0)}>1. Выбор специальности:  {specSelectedName} {step != 0 ? clinicSelectedName : ""}</p>
                    <div className={step === 0 && active ? "form-selected active" : "form-selected"}>
                        <p className="dop-title">Выберите специалиста к которому хотите записаться на приём</p>
                        <select ref={specInput} size={specialization.length}>
                        {specialization.map(article=> (<>
                            <option key={article.id} value={article.name} id={article.id} onClick={e=>setSpecialization(e)}>{article.name}</option>
                        </>))}
                        </select>
                        <div className="clinic-selected"> 
                            <p className="dop-title">Выбор поликлиники: {clinicSelectedName}</p>
                            <select ref={clinicInput } size={clinics.length}> 
                                {clinics.map(article=> (<>
                                    <option key={article.id} id={article.id} onClick={e=> setClinic(e)} >{article.name}</option>
                                </>))}
                            </select>
                        </div>
                    </div>
                </div>
               <div className="step">
                    <p className="title-step" onClick={e=> movingAroundMap(1)}>2. Выбор врача: {doctorSelectedName}</p>
                    <div className={step === 1 ? "form-selected active" : "form-selected"}>
                        <p className="dop-title" >Выберите врача, к которому желаете записаться на приём:</p>
                        <div className="doctors-info">
                            <div className="doctor-selected">
                                <select size="10">
                                {workers.map(article=> (<>
                                    <option key={article.id} value={article.name} onClick={e=> setDoctor(e)} id={article.id}>{article.name}</option>
                                </>))}
                                    <option value='любой врач'> любой врач </option>
                                </select>
                            </div>
                            <div className={activInfo === true ? "doctor-card active" : " doctor-card"}>
                                <div className="photo-info">
                                     <p className="docktor">{doctorSelectedDesc}</p>
                                    
                                    <div className="doctor-avatar">
                                        <img src={doctorSelectedPhoto}></img>                         
                                    </div> 
                                        
                                </div>
                                <div className="button-container">
                                    <button className="button-reset"  onClick={e=> setStep(step-1)}> назад </button>
                                    <button className="button-modal" onClick={e => GetTime(e)}>подтвердить</button>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="step">
                    <p className="title-step"  onClick={e=> movingAroundMap(2)}>3-4. Выбор даты и времени посещения: {selectedMonth ?( getNameMonth(2022,selectedMonth)): (<></>)} {selectedDays} {selectedTimeBlock}</p>
                    <div className={step === 2 ||step === 3 ? "form-selected active" : "form-selected"}>
                        <div className="date-info">    
                            <p className="dop-title" ><b>Выберите дату и время посещения:</b></p>
                            <div dangerouslySetInnerHTML={{__html: elem}} className="calendar" id="calendar">
                                
                            </div>
                            {/* {selectedDays && selectedMonth ?(<div className="button-container">
                                <button className="button-modal" onClick={e=>GetTimeBloks()}>Продолжить</button>
                                </div>) : (<></>)} */}
                            {step == 2 ? (
                                <button className="button-reset kostil"  onClick={e=> setStep(step-1)}> назад </button>
                            ) : (
                                <></>
                            )
                        }
                                
                        </div>            
                    </div>   
                    <div className={step === 3 && active ? "form-selected active" : "form-selected"}>
                        <div className="timeBlock-info">
                            <div className="time-list">
                                {timeBlock.cells.map(article=> (<> 
                                    {article.free == true ? (
                                        <div onClick={e=> setSelectedTimeBlock(article.time_start + "-"+article.time_end)} className={article.free === true ? "time-block" : "noActiv"}>
                                            <p > {article.time_start} {article.time_end} </p>
                                        </div>
                                        ): ("")}
                                    </>))}
                            </div>
                            {/* <div className="dop-info">
                                    <div className="block-info">
                                        <div className="info-elem-1">

                                        </div>
                                        <p className="info-text">
                                            - время не доступное для посещения
                                        </p>
                                    </div>
                                    <div className="block-info">
                                        <div className="info-elem-2">

                                        </div>
                                        <p className="info-text">
                                            - время доступное для посещения
                                        </p>
                                    </div>
                                    <div className="block-info">
                                        <div className="info-elem-3">

                                        </div>
                                        <p className="info-text">
                                            - выбранное время для посещения
                                        </p>
                                    </div>
                            </div> */}
                            {selectedTimeBlock  ?(<div className="button-container">
                                    <button className="button-reset"  onClick={e=> setStep(step-2)}> назад </button>
                                    <button className="button-modal" onClick={e=>GetService(e)}>продолжить</button>
                                </div>) : (<button className="button-reset"  onClick={e=> setStep(step-2)}> назад </button>)}
                        </div>        
                    </div>
                </div>

                <div className="step">
                    <p className="title-step"  onClick={e=> movingAroundMap(4)}>5. Выбор услуг: </p>
                        <div className={step === 4 && active ? "form-selected active" : "form-selected"}>
                            <p className="dop-title" ><b>Выберите услуги, которыми хотите воспользоваться </b></p>
                            <div className="service-list">
                                {services.map(service => (
                                    <div key={service.$id} className="service">
                                        <input type="checkbox" className="service-check" id={service.$id}/>
                                        {service.name} - {service.price}
                                    </div>
                                    
                                ))}
                            </div>
                            <div className="button-container">
                                <button className="button-reset"  onClick={e=> setStep(step-2)}> назад </button>
                                <button onClick={e=> serviceArrayShow(e) } className="button-modal">Продолжить</button>
                                
                            </div>    
                        </div>
                    <div></div>
                </div>

                <div className="step">
                    <p className="title-step" onClick={e=> movingAroundMap(5)} >6. Подтверждение заявки  </p>
                        <div className={step === 5 && active ? "form-selected active" : "form-selected"}>
                            <div className="confirm-record">
                                <div className="and-info">
                                    <p> <b> {clinicSelectedName} </b></p>
                                    <p>{getValidMonth()} {selectedDays} {selectedTimeBlock}</p>
                                    <p>{specSelectedName} {doctorSelectedName}</p>
                                
                                    <p><b>Выбранные услуги:</b></p>
                                    {servicesSelected.length !== 0 ?
                                    (servicesSelected.map(service => (
                                        <div key={service.$id} className="service">
                                          <p>  {service.name} - {service.cost} </p>
                                        </div>
                                        
                                    )))
                                     : 
                                    (<p>Услуги не выбранны</p>)
                                     }
                                   
                                </div>
                               
                            </div>
                            <div className="button-container">
                                <div className="button-section">
                                    <button className="button-reset"  onClick={e=> setStep(4)}> назад </button>
                                </div>
                                <div className="button-section">
                                    <button className="button-modal"  onClick={e=> RecordMobail(e)}> записаться </button>
                                </div>

                            </div>    
                        </div>
                </div>    
                <div className="step">
                    <p className="title-step"  onClick={e=> movingAroundMap(6)}>7. Оплата  </p>
                    <div className={step === 6 && active ? "form-selected active" : "form-selected"}>
                        <div className="button-container">
                            <div className="button-section">
                                <button onClick={() => setActive(false) } className="button-modal">Оплатить в клинике</button>
                            </div>
                            <div className="button-section">
                                <button className="button-modal" onClick={e=> getURL() } > Оплатить онлайн </button>
                            </div>         
                        </div>
                    </div>
                </div>        
                <div className={step === 7 && active ? "form-selected active" : "form-selected"}>
                    <p>Оригинал договора нужно будет подписать и получить в регистратуре медицинского центра</p>
                    <p><Link to="chart" target="_blank" to="/document" >ознакоититься с договором по данной ссылкой</Link></p>
                    <p>
                        Для получения подробной информации о правилах оплаты пройдетите по ссылке: 
                        <a href="https://mhk-lipetsk.ru/page/uslovija_oplati_i_vozvrata_sredstv">https://mhk-lipetsk.ru/page/uslovija_oplati_i_vozvrata_sredstv</a>
                    </p>
            
                    <button onClick={e=> getPaymentURL()}>Продолжить оплату</button>
                    <button className="cancel-button" onClick={e=> movingAroundMap(7)} >Вернуться</button>
                </div>
                <div className="close-button">
                    <button className="form-title close" onClick={() => setActive(false)} > ЗАКРЫТЬ ОКНО</button>
                </div>
            </div>
    </div>
    
        )
}


export default ModalCreateRecord;

