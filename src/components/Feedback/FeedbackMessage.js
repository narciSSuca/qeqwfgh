import React, { useState, useEffect} from "react";
import { api } from "../../helpers/api";
import { getCookie, setCookie } from "../../helpers/cookie";
import './FeedbackMessage.scss';

export const FeedbackMessage = () => {

    const [categories, setCategories] = useState({});
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState({});

    function getCategori(id) {
        
        console.log(categories.findIndex(x => x.id === id))
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
        console.log(selectedProblems);
    })

    useEffect(() => {
        
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

            setProblems(temp['problems']);
        }
        
        getCategories();
        getFeedback();
    }, []);

return (
        <div className="feedback-body">
            <div className="feedback-content">
                <div className="feedback-list">
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
                            </div>
                        </div>
                    ))}
                </div>

                <div className="feedback-create">
                        <p> создать обращение</p>
                </div>
            </div>
            { Object.keys(selectedProblems).length > 0 ? (
                <div className="feedback-singl">
                    <div className="singl-header">

                    </div>
                    <div className="messages-list">

                    </div>
                    <div className="input-menu">
                        <input></input>
                    </div>
                </div>
            ) : (
                <div className=""> выберете обращение </div>
            )}

        </div>
    );
    
}


export default FeedbackMessage;