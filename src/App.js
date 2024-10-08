import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from '~/routes'
import DefaultLayout from "~/layouts";
import { Fragment } from "react";
import { ToastContainer } from 'react-toastify';
import Login from "./Login/Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer theme='colored' position='top-center'></ToastContainer>

        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>

          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;


            if (route.layout) {
              Layout = route.layout
            }
            else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
