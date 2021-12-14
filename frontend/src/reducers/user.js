const defaultState={
    currentUser:'',
};

function userReducers(state=defaultState,action){
    switch(action.type){
        case 'SET_USER':
            return {
                ...state,
                currentUser:action.payload,            
    };
    default:
        return state;
} 
}

export default userReducers;
