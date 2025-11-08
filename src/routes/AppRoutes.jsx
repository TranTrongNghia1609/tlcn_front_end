import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/DashBoard';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile'
import WorkSpace from "@/pages/WorkSpace";
import Problems from "@/pages/Problem";
import LandingPage from "@/pages/LandingPage"; 
const AppRoutes = () => {
  return(
    <Routes>
      <Route path="/" element = {<LandingPage/>} />
      <Route path= "/home" element ={<Home/>} />
      <Route path="/onboarding" element = {<Home isShowOnboarding={true}/>} />
      <Route path="/dashboard" element = {<Dashboard/>}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/problemset/problem/:id" element={<WorkSpace/>}/>
      <Route path="/problemset/problem/:id" element={<WorkSpace/>}/>
      <Route path="/problemset" element={<Problems/>}/>
    </Routes>
  )
}
export default AppRoutes;