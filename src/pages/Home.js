import React, {useEffect} from "react";
import { getCookie,deleteCookie } from "../helpers/cookie";
import { useNavigate } from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate(); 
    
    function CookiesDelete() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    function logOut() {
        CookiesDelete()
        deleteCookie("BARCODE")
        navigate("/");
    }

    useEffect(() => {
        if (getCookie('BARCODE') === undefined) {
            navigate("/");
            }
    })
         
        return (
        <div className="container ">
                <h1 className="display-4"> ТУТ БУДЕТ СПИСОК ПОЛИКЛИНИК</h1>
                <p className="lead">
                    Версия приложения <strong>1.0.4</strong>
                </p>
                <a onClick={logOut} > выйти из аккаунта</a>
                
                <a href="/#/visits" > мои посещения </a>
        </div>
        )
    
}


export default Home;