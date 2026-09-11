import * as types from "../actions/actionTypes";


const initialState = {
    user:null,
    loading:false,
    error:null
};


export const loginReducer = (
    state=initialState,
    action
)=>{


switch(action.type){


case types.LOGIN_START:

return {
    ...state,
    loading:true,
    error:null
};



case types.LOGIN_SUCCESS:

return {
    ...state,
    loading:false,
    user:action.payload,
    error:null
};



case types.LOGIN_ERROR:

return {
    ...state,
    loading:false,
    error:action.payload
};



default:
return state;

}

};