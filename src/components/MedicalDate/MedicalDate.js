import React, { useState, useEffect} from "react";
import { deleteCookie, getCookie, setCookie } from "../../helpers/cookie";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";
import { useBarcode } from 'react-barcode';
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import './MedicalDate.scss';

export const MedicalDate = () => {
  let documentsArray = [{
    name: 'James',
    country: 'Chile',
  }];

  if (localStorage.getItem('DOCUMENTARRAY')) {
    if (typeof JSON.parse(localStorage.getItem('DOCUMENTARRAY')) !== 'undefined') {
      documentsArray = JSON.parse(localStorage.getItem('DOCUMENTARRAY'));
      console.log(typeof documentsArray)
    }
  }
    const [cards, setCards] = useState([]);
    const [hrefDown, setHrefDown] = useState();
    const [documentConstArray, setDocumentConstArray] = useState(documentsArray);
    let token = getCookie('token');

    let paramsURL = useParams();
    setCookie("scrollId",paramsURL.guid,{});


    function stringRun() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
      return text;
    }

    const getDocumentContent = (documents, guidRecord) => {
      let content = [];
      let useHrefArray = [];
      
      for (let idx in documents) {
        let arrayCount = 0;
        if (typeof documents[`${[guidRecord]}`] !== 'undefined') {
          for (let id in documents[`${[guidRecord]}`]) {
            let document = documents[`${[guidRecord]}`][id];
            if(useHrefArray.indexOf(document['href']) ) {
              content.push(<li onClick={e=> createDocument(`data:application/pdf;base64,${document['document64']}`,document['name'])} key={stringRun()}>{document['name']}.pdf</li>);
              useHrefArray.push(document['href']);
            }
          }
        }
        return content;
      }  
    };
    
    const getZipButton = (documents, guidRecord) => {
      let content = [];
      let useHrefArray = [];
      
      for (let idx in documents) {
        let arrayCount = 0;
        if (typeof documents[`${[guidRecord]}`] !== 'undefined') {
          for (let id in documents[`${[guidRecord]}`]) {
            let document = documents[`${[guidRecord]}`][id];
            if(useHrefArray.indexOf(document['href']) ) {
              useHrefArray.push(document['href']);
              arrayCount++;
            }
          }
        }
        if (arrayCount > 0) {
          return <img src="zip-file.png" onClick={e=> getZip(documents, guidRecord)}></img> 
        }
      }  
    }

    const getDocumentButton = (guidRecord, id, documentCount) => {
     if (documentConstArray[guidRecord]){
        return <button className="" id={`${id}button`} onClick={e=>  GetMedicalDataFresh(guidRecord, id,)}>Обновить запись</button>
      } else {
        return <button className="" id={`${id}button`} onClick={e=>  GetMedicalDataFresh(guidRecord, id,)}>Запросить выписку</button>
      }

    }

    const getZip = (documents, guidRecord) => {
      let content = [];
      let useHrefArray = [];
      let qwe = {};
      let zip = new JSZip();
      console.log("asd")

      for (let idx in documents) {
        let arrayCount = 0;
        if (typeof documents[`${[guidRecord]}`] !== 'undefined') {
          for (let id in documents[`${[guidRecord]}`]) {
            let document = documents[`${[guidRecord]}`][id];
            let string = stringRun();
            console.log(useHrefArray.indexOf);
            if(useHrefArray.indexOf(document['href']) == -1 ) {
              zip.file( `${document['name']}-${string}.pdf`,document['document64'], {base64: true});
              useHrefArray.push(document['href']);
              arrayCount++;
            }
          }
          
        }
        
      }
      zip.generateAsync({type:"blob"}).then(function(zipcontent) {
        saveAs(zipcontent, "example.zip");
       });
    }

    const createDocument = (dataurl, filename) => {
      let a = document.createElement("a");
      let file = dataURLtoFile(dataurl, filename);
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();

    }

    function getListingDocument(guid) {
        let guidArray = JSON.parse(localStorage.getItem('DOCUMENTARRAY'));
        if (typeof guidArray[`${guid}`] !== 'undefined') {
          let listing = "";
          let documentArray = guidArray[`${guid}`];
           for (let key in documentArray) {
            let documentName = documentArray[key][`fileName`];
            listing += `<a href="#">${documentName}</a>`
        }
          console.log(typeof documentArray);
          return listing
        }
    }

    async function GetMedicalDataFresh(guid, elementId){
      document.getElementById(`${elementId}button`).style.backgroundColor ="gray";
      document.getElementById(`${elementId}message`).innerHTML = "Запрос на получение документов отправлен в медицинскую организацию. Ожидается ответ...";
      document.getElementById(`${elementId}message`).style.color ="green";
      let guidRecords = guid;
      GetMedicalDate(guid);                                           

      let timerId = setTimeout(function tick() {
        let recordArray = new Array();

        CheckMedicalDate(guid);                                       
        if(getCookie('medicalPrepared') == 1) {                       

          let medicalData = JSON.parse(getCookie(`${guid}`));
          console.log(medicalData['items']);

          setCookie(`${guid}`, JSON.stringify(medicalData['items']));
          deleteCookie('medicalPrepared');
          GetPreparedMedicalDate(guid, guidRecords);
          document.getElementById(`${elementId}button`).style.backgroundColor ="green";
          document.getElementById(`${elementId}message`).innerHTML = "Документы для скачивание будут доступны через некоторое время после нажатия на кнопку";
          
        } else {
          timerId = setTimeout(tick, 2000);
        }  
      }, 2000);
      

    }
   
    
  console.log(cards['2f4a9071-bd46-45c4-a35b-9da2261e188e']);

    async function GetMedicalDate(guid){
        
        let medicalHeaders = new Headers();
        medicalHeaders.append("Authorization", "Bearer "+token);
        medicalHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var bodyMedical = new URLSearchParams();
        bodyMedical.append("medorgId", "1");
        bodyMedical.append("barcode", getCookie('BARCODE'));
        bodyMedical.append("phone", getCookie('PHONEUSER'));
        bodyMedical.append("recordGUID", guid);

        let temp = await api(
            `https://patient.simplex48.ru/api/reception/GetMedicalData`,
            'POST',
            bodyMedical,
            medicalHeaders,
        )
        setCookie(`${guid}`,temp['ActionGUID'],{});
    }

    async function CheckMedicalDate(guid) {
      
      let medicalHeaders = new Headers();
      medicalHeaders.append("Authorization", "Bearer "+token);
      medicalHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      let actionGUID = getCookie(`${guid}`);


      let bodyMedical = new URLSearchParams();
      bodyMedical.append("medorgId", "1");
      bodyMedical.append("barcode", getCookie('BARCODE'));
      bodyMedical.append("phone", getCookie('PHONEUSER'));
      bodyMedical.append("GUID", `${actionGUID}`);        

      let method = 'POST';

      let request = await fetch('https://patient.simplex48.ru/api/action/CheckActionForMobile', {
        method: method,
        body: bodyMedical,
        headers: medicalHeaders});  

        let response = await request.json();
      
      if (request.status == 200 && method == 'POST' && response['Action'] !== null){  
        setCookie('medicalPrepared',1,{});
        setCookie(`${guid}`, response['Action']['Data']);
      }  
    }

    async function GetPreparedMedicalDate(guid, recordGUID){

        let medicalHeaders = new Headers();
        medicalHeaders.append("Authorization", "Bearer "+token);
        medicalHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let actionGUID = JSON.parse(getCookie(`${guid}`));
        console.log(actionGUID);
        let arrayDocs= {};
        for (let index = 0; index < actionGUID.length; index++) {
          
          let dataGUID = actionGUID[index]['guid'];

          var bodyMedical = new URLSearchParams();
          bodyMedical.append("medorgId", "1");
          bodyMedical.append("barcode", getCookie('BARCODE'));
          bodyMedical.append("phone", getCookie('PHONEUSER'));
          bodyMedical.append("dataGUID", dataGUID);
          
          let request = await fetch('https://patient.simplex48.ru/api/reception/GetTransferData', {
            method: 'POST',
            body: bodyMedical,
            headers: medicalHeaders});  
    
            let response = await request.json();
            console.log(typeof response['data']);
    
            let file = dataURLtoFile(`data:application/pdf;base64,${response['data']}`,'голова.pdf');
            let href = URL.createObjectURL(file);
            setHrefDown(href);
           console.log(response);
            let newItem = {
              document64: response['data'],
              name: actionGUID[index]['name'],
              href: href,
              fileName: actionGUID[index]['fileName']
            }
            arrayDocs[index] = newItem; 
            let guidArray = {};
            if (!localStorage.getItem('DOCUMENTARRAY')) {
              guidArray = new Object();
            } else {
              guidArray = JSON.parse(localStorage.getItem('DOCUMENTARRAY'));
            }
            guidArray[`${recordGUID}`] = arrayDocs;
            setDocumentConstArray(guidArray);
            localStorage.setItem('DOCUMENTARRAY', JSON.stringify(guidArray));
          }
          return arrayDocs;
    }

    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }

    useEffect(() => {
        const abortController = new AbortController();
        const {signal} = abortController;
        
        const apiCall = async path => {
          try {
            let token = getCookie('token');
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+token);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
            var urlencoded = new URLSearchParams();
            urlencoded.append("medorgId", "1");
            urlencoded.append("BranchId", "1");
            urlencoded.append("barcode", getCookie('BARCODE'));
            urlencoded.append("phone", getCookie('PHONEUSER'));
  
            let request = await fetch(path, {
              method: 'POST',
              body: urlencoded,
              headers: myHeaders});
  
            let response = await request.json();
            let newResponse = new Array;

            for (let index = 0; index < response['history'].length; index++) {
                let card = response['history'][index];
                if (card['hazMedicalData']){
                    newResponse.push(card);
                }
            }

            console.log(newResponse);
            setCards(newResponse);
  
          } catch (e) {
            if (!signal?.aborted) {
              console.error(e);
            }
          }
        };
   
        apiCall('https://patient.simplex48.ru/api/reception/UserRecords/');

        


        return () => {
          abortController.abort();
        };
      }, [setCards]);

    return (
    <>
    <div className="card-list">
        <div className="card-visit">
            <div className="cards">
                {cards.map(article=> (
                    <div className={article.internetEntryGUID == getCookie("scrollId") ? ("card select") : ("card")} key={article.$id}  id={article.internetEntryGUID} >
                        <div className="card-noeq">
                          <div className="top-info">
                            <div className="card-date">
                                <p className="date-visit">{article.date.split('T')[0]}</p>
                                <p  className="time-visit">{article.timeString}</p>
                                <p>{article.branchName}</p>
                            </div>
                            <p className="" ><b>{article.doctorName}</b></p>
                            <div className="document-list">
                              <ul>{getDocumentContent(documentConstArray,article.internetEntryGUID)}</ul>  
                              <div className="zip-button">
                                {getZipButton(documentConstArray,article.internetEntryGUID)}
                              </div>
                            </div>
                            </div>
                            <div className="bottom-info">
                              {getDocumentButton(article.internetEntryGUID, article.$id, article.medicalDataCount)}
                             
                              <b><p className="message" id={`${article.$id}message`}> Документы для скачивание будут доступны через <br></br>некоторое время после нажатия на кнопку</p> </b>
                              <p className="" >{article.workerName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    </>
    
    );
};



export default MedicalDate;    