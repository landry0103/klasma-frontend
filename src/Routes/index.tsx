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
import { INDIVIDUAL, VALUE_OF_UNVERIFIED, VALUE_OF_VERIFIED } from '../utils/constants';
import useAuth from '../hooks/useAuth';
import Checkout from '../pages/Checkout';
import UserEditPost from '../pages/UserEditPost';
import ResendEmailVerification from '../pages/ResendEmailVerification';
import EmailVerificationResult from '../pages/EmailVerificationResult';

// const accessToken = getItemOfLocalStorage(ACCESS_TOKEN)
// const userType = getItemOfLocalStorage(USER_TYPE)

export default function Routes() {
  const { currentUser, userType } = useAuth()

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
    // {
    //   name: 'Sell Token',
    //   path: '/sell-token',
    //   element: <SellToken />
    // },
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
      path: '/checkout/:id',
      element: currentUser?.email_verified === VALUE_OF_VERIFIED ? <Checkout /> : <Navigate to="/login" />
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
    },
    {
      path: '/resend-email-verification',
      element: currentUser?.email_verified === VALUE_OF_UNVERIFIED ? <ResendEmailVerification /> : <Navigate to="/login" />
    },
    {
      path: '/email-verify/:verificationToken',
      element: currentUser?.email_verified !== VALUE_OF_UNVERIFIED ? <Home /> : <Navigate to="/" />
    },
    {
      path: '/email-verification-result',
      element: currentUser ? <EmailVerificationResult /> : <Navigate to="/login" />
    }
  ]

  const routesOfAccountIndividualLayout = [
    {
      path: '/account-manage/profile',
      element: <UserProfile />
    },
    {
      path: '/account-manage/setting',
      element: <UserSetting />
    },
    {
      path: '/account-manage/posts',
      element: <UserPosts />
    },
    {
      path: '/account-manage/posts/:mode',
      element: <UserEditPost />
    },
    {
      path: '/account-manage/posts/:mode/:id',
      element: <UserEditPost />
    },
    {
      path: '/account-manage/comments',
      element: <UserComments />
    }
  ]

  const routesOfAccountCompanyLayout = [
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
      path: '/account-manage/campaigns/:mode',
      element: <UserEditCampaign />
    },
    {
      path: '/account-manage/campaigns/:mode/:id',
      element: <UserEditCampaign />
    },
    {
      path: '/account-manage/posts',
      element: <UserPosts />
    },
    {
      path: '/account-manage/posts/:mode',
      element: <UserEditPost />
    },
    {
      path: '/account-manage/posts/:mode/:id',
      element: <UserEditPost />
    },
    {
      path: '/account-manage/comments',
      element: <UserComments />
    }
  ]

  return useRoutes([
    {
      element: <MainLayout />,
      children: routesOfMainLayout
    },
    {
      element: currentUser?.email_verified === VALUE_OF_VERIFIED ? <AccountLayout /> : <Navigate to="/" />,
      children: userType === INDIVIDUAL ? routesOfAccountIndividualLayout : routesOfAccountCompanyLayout
    }
  ])
}