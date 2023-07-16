import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio"; 

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" Component={Main} />
                <Route exact path="/repositorio/:repositorio" Component={Repositorio} />
            </Routes>
        </BrowserRouter>
    );
}