import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom"
import { App } from "../../module/screen/App"

export default function Navigation() {
    return <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
        </Routes>
    </BrowserRouter>
}