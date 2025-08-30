import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile'
const AppRoutes = () => {
  return(
    <Routes>
      <Route path="/" element = {<Home/>} />
      <Route path="/dashboard" element = {<Dashboard/>}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
export default AppRoutes;