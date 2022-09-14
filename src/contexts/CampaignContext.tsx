import { createContext, useReducer, useContext } from 'react';
import api from '../utils/api';
import {
  ERROR,
  ID_OF_STATUS_CLOSED,
  MESSAGE_CAMPAIGN_CREATE_SUCCESS,
  MESSAGE_CAMPAIGN_UPDATE_SUCCESS,
  MESSAGE_INVESTED_SUCCESS,
  SUCCESS
} from '../utils/constants';
import { ICampaign, ICampaignReq, IInvestment, IInvestReq } from '../utils/interfaces';
import { AlertMessageContext } from './AlertMessageContext';
import { LoadingContext } from './LoadingContext';

/* --------------------------------------------------------------- */

interface IInitialState {
  campaign: ICampaign | null;
  campaigns: Array<ICampaign>;
  investmentsOfCampaign: Array<IInvestment>;
}

interface IAction {
  type: string,
  payload: any
}

interface IProps {
  children: any
}

interface IHandlers {
  [key: string]: Function,
}

/* --------------------------------------------------------------- */

const initialState: IInitialState = {
  campaign: null,
  campaigns: [],
  investmentsOfCampaign: []
};

const handlers: IHandlers = {
  SET_CAMPAIGN: (state: object, action: IAction) => {
    return {
      ...state,
      campaign: action.payload
    };
  },
  SET_CAMPAIGNS: (state: object, action: IAction) => {
    return {
      ...state,
      campaigns: action.payload
    };
  },
  SET_INVESTMENTS_OF_CAMPAIGN: (state: object, action: IAction) => {
    return {
      ...state,
      investmentOfCampaign: action.payload
    };
  },
};

const reducer = (state: object, action: IAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const CampaignContext = createContext({
  ...initialState,
  saveCampaignAct: (reqData: ICampaignReq, id?: number) => Promise.resolve(),
  getCampaignsByCompanyIdAct: (companyId: number) => Promise.resolve(),
  getCampaignByIdAct: (id: number) => Promise.resolve(),
  getAllCampaignsAct: () => Promise.resolve(),
  investAct: (investReq: IInvestReq) => Promise.resolve(),
  closeCampaignAct: (campaignId: number) => Promise.resolve()
});

//  Provider
function CampaignProvider({ children }: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { openAlert } = useContext(AlertMessageContext)
  const { openLoading, closeLoading } = useContext(LoadingContext)

  //  Create or edit campaign
  const saveCampaignAct = (reqData: ICampaignReq, id?: number) => {
    openLoading()
    if (id) {
      /* --------------- Edit campaign ----------------- */
      api.put(`/campaign/update/${id}`, reqData)
        .then(() => {
          openAlert({
            severity: SUCCESS,
            message: MESSAGE_CAMPAIGN_UPDATE_SUCCESS
          })
          closeLoading()
        })
        .catch(error => {
          openAlert({
            severity: ERROR,
            message: error.response.data
          })
          closeLoading()
        })
      /* ----------------------------------------------- */
    } else {
      /* --------------- Create campaign --------------- */
      api.post('/campaign/create', reqData)
        .then(() => {
          openAlert({
            severity: SUCCESS,
            message: MESSAGE_CAMPAIGN_CREATE_SUCCESS
          })
          closeLoading()
        })
        .catch(error => {
          openAlert({
            severity: ERROR,
            message: error.response.data
          })
          closeLoading()
        })
      /* ----------------------------------------------- */
    }
  }

  //  Get campaigns of a company
  const getCampaignsByCompanyIdAct = (companyId: number) => {
    openLoading()
    api.get(`/campaign/get-campaigns-by-company-id/${companyId}`)
      .then(response => {
        dispatch({
          type: 'SET_CAMPAIGNS',
          payload: response.data
        })
        closeLoading()
      })
      .catch(error => {
        dispatch({
          type: 'SET_CAMPAIGNS',
          payload: []
        })
        openAlert({
          severity: ERROR,
          message: error.response.data
        })
        closeLoading()
      })
  }

  //  Get a campaign by its id
  const getCampaignByIdAct = (id: number) => {
    openLoading()
    api.get(`/campaign/get-campaign-by-id/${id}`)
      .then(response => {
        dispatch({
          type: 'SET_CAMPAIGN',
          payload: response.data.campaign
        })
        dispatch({
          type: 'SET_INVESTMENTS_OF_CAMPAIGN',
          payload: response.data.investments
        })
        closeLoading()
      })
      .catch(error => {
        dispatch({
          type: 'SET_CAMPAIGN',
          payload: null
        })
        dispatch({
          type: 'SET_INVESTMENTS_OF_CAMPAIGN',
          payload: []
        })
        openAlert({
          severity: ERROR,
          message: error.response.data
        })
        closeLoading()
      })
  }

  //  Get all campaigns
  const getAllCampaignsAct = () => {
    openLoading()
    api.get('/campaign/get-all')
      .then(response => {
        console.log('>>> campaigns => ', response.data)
        dispatch({
          type: 'SET_CAMPAIGNS',
          payload: response.data
        })
        closeLoading()
      })
      .catch(error => {
        dispatch({
          type: 'SET_CAMPAIGNS',
          payload: []
        })
        openAlert({
          severity: ERROR,
          message: error.response.data
        })
        closeLoading()
      })
  }

  //  Invest to campaign
  const investAct = (investReq: IInvestReq) => {
    openLoading()
    api.post('/campaign/invest', investReq)
      .then(() => {
        openAlert({
          severity: SUCCESS,
          message: MESSAGE_INVESTED_SUCCESS
        })
        closeLoading()
      })
      .catch(error => {
        openAlert({
          severity: ERROR,
          message: error.response.data
        })
        closeLoading()
      })
  }

  //  Close a campaign
  const closeCampaignAct = (campaignId: number) => {
    openLoading()
    api.put(`/campaign/update-campaign-status/${campaignId}`, { id_status: ID_OF_STATUS_CLOSED })
      .then(response => {
        dispatch({
          type: 'SET_CAMPAIGN',
          payload: {
            ...state.campaign,
            id_status: ID_OF_STATUS_CLOSED
          }
        })
        closeLoading()
      })
      .catch(error => {
        console.log('>>>>>>>> error of closeCampaignAct => ', error)
        closeLoading()
      })
  }

  return (
    <CampaignContext.Provider
      value={{
        ...state,
        saveCampaignAct,
        getCampaignsByCompanyIdAct,
        getCampaignByIdAct,
        getAllCampaignsAct,
        investAct,
        closeCampaignAct
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export { CampaignContext, CampaignProvider };