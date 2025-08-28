import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
const AppRoutes = () => {
  return(
    <Routes>
      <Route path="/" element = {<Home/>} />
      <Route path="/dashboard" element = {<Dashboard/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
export default AppRoutes;