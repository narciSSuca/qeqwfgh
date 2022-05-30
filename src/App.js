import React from 'react';
import {HashRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Home} from './pages/Home';
import {MyVisit} from './pages/MyVisit';
import {LoyaltyCard} from './pages/LoyaltyCard';
import {CardVisit} from "./pages/CardVisit";
import {Feedback} from "./pages/Feedback";
import {Authorization} from './pages/Authorization';
import {Notification} from './pages/Notification';
import {FogotPassword} from './pages/FogotPassword';
import {DocumentDogovor} from './pages/DocumentDogovor';
import {ElectronicMedicalCard} from "./pages/ElectronicMedicalCard";
import { getCookie, setCookie} from './helpers/cookie';
import { api } from './helpers/api';
const App = () => {
  
  async function GetMedicalDate(){
    let temp = await api(
      `https://narcissuca.github.io/config.json`,
      'GET',
      {},
      {},
    )
    setCookie('MEDORGID',temp['medorgId'],{});
    setCookie('CLINIKNAME',temp['clinik_name'],{});
    }
    GetMedicalDate();

  return (
    <HashRouter hashType="hashbang">
      <Routes>
        <Route path={'/'} element={<Authorization/>} />
        <Route path={'/home'} element={<Home/>} />
        <Route path={'/visits'} element={<MyVisit/>} />
        <Route path={'/visit/:meta/:array'} element={<CardVisit/>} /> 
        <Route path={'/loyaltycard'} element={<LoyaltyCard/>} />
        <Route path={'/emk/:guid'} element={<ElectronicMedicalCard/>} />
        <Route path={'/fogot/password/:number'} element={<FogotPassword/>}/>
        <Route path={'/notification'} element={<Notification/>}/> 
        <Route path={'/document'} element={<DocumentDogovor/>}/>
        <Route path={'/feedback'} element={<Feedback/>}/>
      </Routes>   
    </HashRouter>
    );    
  }
export default App;
