import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom"
import { App } from "../../screen/Home"

export default function Navigation() {
    return <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
        </Routes>
    </BrowserRouter>
}