import React, { createContext, useReducer, useContext } from 'react';

const BudgetStateContext = createContext();
const BudgetDispatchContext = createContext();

function budgetReducer(state, action) {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        [action.key]: action.value,
        [`${action.key}_trigger`]: new Date() // listeners can use this in e.g. a useEffect dependency array
      }
    }
    case 'clear': {
      return {}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, {});

  return (
    <BudgetStateContext.Provider value={state}>
      <BudgetDispatchContext.Provider value={dispatch}>
        {children}
      </BudgetDispatchContext.Provider>
    </BudgetStateContext.Provider>
  );
}

function useBudgetState() {
  const context = useContext(BudgetStateContext);
  if (context === undefined) {
    throw new Error('useBudgetState must be used within a BudgetProvider');
  }
  return context;
}

function useBudgetDispatch() {
  const context = useContext(BudgetDispatchContext);
  if (context === undefined) {
    throw new Error('useBudgetDispatch must be used within a BudgetProvider');
  }
  return context;
}

export { BudgetProvider, useBudgetState, useBudgetDispatch }