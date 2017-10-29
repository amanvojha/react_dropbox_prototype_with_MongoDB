import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignIn from './App';
import SignUp from './routes/SignUp';
import Home from './routes/Home';
import Files from './routes/Files';
import Shared from './routes/Shared';
import Activity from './routes/Activity';
import EditProfile from './routes/EditProfile';
import Profile from './routes/Profile';
import DynamicPage from './routes/DynamicPage.js';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux"
import store from "./reducer/reducer"
import {BrowserRouter , Route, Switch } from 'react-router-dom';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import { setUsername, setHome } from "./actions/userActions";

const Pages = () => (

	<Switch>
		<Route path="/" exact component={SignIn} />
		<Route path="/SignUp" exact component={SignUp} />
		<Route path="/Home" exact component={Home} />
		<Route path="/Files" exact component={Files} />
		<Route path="/Shared" exact component={Shared} />
		<Route path="/Activity" exact component={Activity} />
		<Route path="/EditProfile" exact component={EditProfile} />
		<Route path="/Profile" exact component={Profile} />
		<Route path="/Page/:id" component={DynamicPage} />
	</Switch>
);


ReactDOM.render(
            <Provider store={store}>
            	<BrowserRouter>
            		<Pages />
            	</BrowserRouter>
            </Provider>
            , document.getElementById('root'));
registerServiceWorker();