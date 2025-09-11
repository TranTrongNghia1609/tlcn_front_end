import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile'
import ProblemDetail from "../pages/ProblemDetail";
const AppRoutes = () => {
  return(
    <Routes>
      <Route path="/" element = {<Home/>} />
      <Route path="/onboarding" element = {<Home isShowOnboarding={true}/>} />
      <Route path="/dashboard" element = {<Dashboard/>}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/problem/:id" element={<ProblemDetail/>}/>
    </Routes>
  )
}
export default AppRoutes;