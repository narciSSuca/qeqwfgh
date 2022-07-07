import React, { useState, useEffect} from "react";
import { api } from "../../helpers/api";
import { getCookie, setCookie } from "../../helpers/cookie";
import './FeedbackMessage.scss';

export const FeedbackMessage = () => {

    const [categories, setCategories] = useState([{"$id":"1","id":1,"name":"Ошибки в работе приложения"},{"$id":"2","id":100,"name":"Прочее"},{"$id":"3","id":101,"name":"Проблемы с записью на прием"},{"$id":"4","id":104,"name":"Проблема с оплатой"}]);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState({});
    const [selectedProblemsId, setSelectedProblemsId] = useState({});
    const [modalActive, setModalActive] = useState(false);
    const [message, setMessage] = useState('');
    const [textContent, setTextContent] = useState('');
    const [face, setFace] = useState(0);

  const handleMessageChange = event => {
    // 👇️ access textarea value
    setMessage(event.target.value);
    console.log(event.target.value);
  };

  const handleTextChange = event => {
    setTextContent(event.target.value);
    console.log(event.target.value);
  };

    function createNewFeedback() {
        async function createFeedback(){
            let token = getCookie('token');
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+token);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("medorgId", getCookie('MEDORGID'));
            urlencoded.append("barcode", getCookie('BARCODE'));
            urlencoded.append("phone", getCookie('PHONEUSER'));
            urlencoded.append("categoryId", selectedCategories.id);
            urlencoded.append("message", message);
            
            let temp = await api(
                     `${getCookie('SERVERLINK')}/api/feedback/CreateProblem`,
                     'POST',
                     urlencoded,
                     myHeaders,
                 )            
        setFace(face+1);
        setMessage('');
        setModalActive(false);
    }

        createFeedback();
    }

    function createNewMessage() {
        async function createMessage(){
            let token = getCookie('token');
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+token);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("medorgId", getCookie('MEDORGID'));
            urlencoded.append("barcode", getCookie('BARCODE'));
            urlencoded.append("phone", getCookie('PHONEUSER'));

            
            urlencoded.append("problemId", selectedProblems.problemId);
            urlencoded.append("message", textContent);
            urlencoded.append("contentType", 1);

            let temp = await api(
                `${getCookie('SERVERLINK')}/api/feedback/AddMessageToProblem`,
                'POST',
                urlencoded,
                myHeaders,
            ) 

            console.log(temp.message);
            let newMessage = selectedProblems
            console.log(newMessage.messages);
            newMessage.messages.push(temp.message);
            console.log(newMessage);
            setSelectedProblems(newMessage);
            setFace(face+1);
            setTextContent('');
        }

        createMessage();
    }

    function getCategori(id) {
        
        //console.log(categories.findIndex(x => x.id === id))
        let categId = categories.findIndex(x => x.id === id);
        return <p>{categories[`${categId}`]['name']}</p>
    }
    // useEffect(() => {
    //     const abortController = new AbortController();
    //     const {signal} = abortController;
        
    //     const apiCall = async path => {
    //       try {
    //         let token = getCookie('token');
    //         var myHeaders = new Headers();
    //         myHeaders.append("Authorization", "Bearer "+token);
    //         myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
    //         var urlencoded = new URLSearchParams();
    //         urlencoded.append("medorgId", "1");
    //         urlencoded.append("barcode", getCookie('BARCODE'));
    //         urlencoded.append("phone", getCookie('PHONEUSER'));
  
    //         async function getCategories() {
    //              let temp = await api(
    //                  `https://patient.simplex48.ru/api/feedback/Categories/${getCookie('MEDORGID')}`,
    //                  'GET',
    //                  {},
    //                  {},
    //              )            
    //             setCategories(temp);
    //         }

    //         var feedbackBody = new URLSearchParams();
    //         feedbackBody.append("medorgId", getCookie('MEDORGID'));
    //         feedbackBody.append("barcode", getCookie('BARCODE'));
    //         feedbackBody.append("phone", getCookie('PHONEUSER'));
    
    //         async function getFeedback() {
    //             let temp = await api(
    //                 `https://patient.simplex48.ru/api/feedback/GetProblemsList`,
    //                 `POST`,
    //                 feedbackBody,
    //                 myHeaders
    //             )
    //             setProblems(temp['problems'][1]['messages']);
    //         }


    //         getFeedback();
    //         getCategories();
    //       } catch (e) {
    //         if (!signal?.aborted) {
    //           console.error(e);
    //         }
    //       }
    //     };
   
    //     apiCall(`https://patient.simplex48.ru/api/feedback/Categories/${getCookie('MEDORGID')}`);

        


    //     return () => {
    //       abortController.abort();
    //     };
    //   }, [setCategories]);
    //   console.log(problems);
    useEffect(() => {
        if (selectedProblems) {
            console.log(selectedProblems);
        }
    })

    useEffect(() => {
        let idCard = 0;

        if (selectedProblems) {
            idCard = selectedProblems.problemId
            console.log(selectedProblems);
        }
        //console.log(idCard);

        let token = getCookie('token');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        async function getCategories() {
            let temp = await api(
                `https://patient.simplex48.ru/api/feedback/Categories/1`,
                'GET',
                {},
                {},
            )            
           setCategories(temp);
        }

        var feedbackBody = new URLSearchParams();
        feedbackBody.append("medorgId", 1);
        feedbackBody.append("barcode", getCookie('BARCODE'));
        feedbackBody.append("phone", getCookie('PHONEUSER'));

        async function getFeedback() {
            let temp = await api(
                `https://patient.simplex48.ru/api/feedback/GetProblemsList`,
                `POST`,
                feedbackBody,
                myHeaders
            )
            Object.keys(temp.problems).forEach(element => {
                temp.problems[`${element}`]['lenghtMessages'] = temp.problems[`${element}`]['messages'].length;
            });

            setProblems(temp['problems'].reverse());
        }

        getCategories();
        getFeedback();
        //         if (selectedProblems) {
        //     //   idCard = selectedProblems.problemId
        //        problems.forEach(element => {
        //            if(element.problemId == idCard) {
        //                setSelectedProblems(element);
        //            }
        //        });
        //    }
        


        console.log(selectedProblems);
    }, [face]);

    function getListCategories() {
        return (
        <ul>
            {categories.map(cat =>(
                <li onClick={e=> setSelectedCategories(cat)}  ><b>{cat.name}</b></li>
            ))}
        </ul> )
    }

    function lastMessageDate() {

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
        


        return <> {h}:{mi} {y}.{m}.{d}</>; 
    }
    // console.log(categories);
    // let first = problems[1];
    // console.log(first);
    // for (const [key, value] of Object.entries(first)) {
    //     if( key == "messages") {
    //         console.log(key, value);
    //     }
    //   }


return (
        <div className="feedback-body">

            <div className={modalActive ? "modal active" : "modal"} >
                <div className="modal__content new-size" onClick={e => e.stopPropagation()}>
                    <p>Если у вас возникли вопросы или проблемы при работе с приложением вы можете связаться с нами.</p>

                    {/* {modalActive ? getListCategories() : ""}
                        {getListCategories()} */}
                   
                    <ul className="list-problem">
                        {categories.map(cat =>(
                           <li onClick={e=> setSelectedCategories(cat)} className={cat.id == selectedCategories.id ? "categori-item categori-selected" : "categori-item"}  ><b>{cat.name}</b></li>
                        ))}
                    </ul>
                    <textarea value={message} onChange={handleMessageChange}></textarea>
                    <button className="cancel-button" onClick={e => setModalActive(false)} > Отмена </button>
                    {message && selectedCategories.id ? <button onClick={e=> createNewFeedback(e)}> Отправить заявку </button> : ""}
                        
                                
                </div>
            </div>

            <div className="feedback-content">
                <div className="feedback-list">
                <div className="stok"><p><b>Выберите обращение</b></p></div>
                    {problems.map(article=> (
                        <div className="problem-item" key={article.$id} onClick={e=> setSelectedProblems(article)}>
                            <div className="problem-title">
                               <p> {article.message} </p>
                            </div>
                            <div className="problem-categori">
                               <b> {getCategori(article.categoryId)} </b>
                            </div>
                            <div className="messages-count">
                                <p>Комментариев: {article.lenghtMessages}</p>
                                {article.messages.length  > 0 ? (
                                    <>
                                        <p className="dateCreateProblem"><p>последнее:  в {createDate(article.messages[article.messages.length - 1].dateTime)}</p></p>
                                    </>
                                ) : (
                                    <>
                                        <p className="dateCreateProblem"><p>создано:  в {createDate(article.dateTime)}</p></p>
                                    </>
                                )}

                            </div>
                        </div>
                    ))}
                </div>

                <div onClick={e=> setModalActive(true)} className="feedback-create">
                        <p> создать обращение</p>
                </div>
            </div>
            { Object.keys(selectedProblems).length > 0 ? (
                <div className="feedback-singl">
                    <div className="singl-header">
                        <h4><b>{selectedProblems.message}</b></h4>
                        <p>{createDate(selectedProblems.dateTime)}</p>
                        <hr></hr>
                    </div>
                    <div className="messages-list">
                        <ul >
                            { selectedProblems.messages.map(problem => (
                                //console.log(problem.message)
                                <li className={problem.source == 2 ? "messages-item you-message" : "messages-item"} key={problem.$id}>
                                    <p><b>{problem.message}</b></p>
                                    <p className="message-date">{createDate( problem.dateTime)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="input-menu">
                    <textarea value={textContent} onChange={handleTextChange} className="textareaElement"></textarea>
                    {/* <div class="textareaElement" contenteditable="true" ></div> */}
                    <div onClick={e=> createNewMessage()}>
                        <img src="send-message.png" height={27}></img>
                    </div>
                    </div>
                </div>
            ) : (
                  <></>
                // <div className="stok"> <h2>Выберете обращение</h2> </div>
            )}

        </div>
    );
    
}


export default FeedbackMessage;