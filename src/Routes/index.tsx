import { Navigate, useRoutes } from 'react-router';
import AccountLayout from '../layouts/AccountLayout';
import MainLayout from '../layouts/MainLayout';
import Blog from "../pages/Blog";
import Campaign from "../pages/Campaign";
import Home from "../pages/Home";
import Learn from "../pages/Learn";
import Login from "../pages/Login";
import Marketplace from "../pages/Marketplace";
import Post from '../pages/Post';
import SellToken from "../pages/SellToken.tsx";
import Signup from "../pages/Signup";
import Team from "../pages/Team";
import UserCampaigns from '../pages/UserCampaigns';
import UserComments from '../pages/UserComments';
import UserEditCampaign from '../pages/UserEditCampaign';
import UserPosts from '../pages/UserPosts';
import UserProfile from '../pages/UserProfile';
import UserSetting from '../pages/UserSetting';
import { getItemOfLocalStorage } from '../utils/functions';
import { ACCESS_TOKEN } from '../utils/constants';

const currentUser = getItemOfLocalStorage(ACCESS_TOKEN)

export default function Routes() {

  const routesOfMainLayout = [
    {
      name: 'Home',
      path: '/',
      element: <Home />
    },
    {
      name: 'Marketplace',
      path: '/marketplace',
      element: <Marketplace />
    },
    {
      name: 'Sell Token',
      path: '/sell-token',
      element: <SellToken />
    },
    {
      name: 'Team',
      path: '/team',
      element: <Team />
    },
    {
      name: 'Learn',
      path: '/learn',
      element: <Learn />
    },
    {
      name: 'Blog',
      path: '/blog',
      element: <Blog />
    },
    {
      path: '/campaigns/:id',
      element: <Campaign />
    },
    {
      name: 'Login',
      path: '/login',
      element: currentUser ? <Navigate to="/" /> : <Login />
    },
    {
      path: '/signup',
      element: currentUser ? <Navigate to="/" /> : <Signup />
    },
    {
      path: '/posts/:id',
      element: <Post />
    }
  ]

  const routesOfAccountLayout = [
    {
      path: '/account-manage/profile',
      element: <UserProfile />
    },
    {
      path: '/account-manage/setting',
      element: <UserSetting />
    },
    {
      path: '/account-manage/campaigns',
      element: <UserCampaigns />
    },
    {
      path: '/account-manage/campaigns/:id',
      element: <UserEditCampaign />
    },
    {
      path: '/account-manage/posts',
      element: <UserPosts />
    },
    {
      path: '/account-manage/comments',
      element: <UserComments />
    },
    
  ]

  return useRoutes([
    {
      element: <MainLayout />,
      children: routesOfMainLayout
    },
    {
      element: currentUser ? <AccountLayout /> : <Navigate to="/" />,
      children: routesOfAccountLayout
    }
  ])
}