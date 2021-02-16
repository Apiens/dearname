import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

const AppContext = createContext({
  store: { jwtToken: "", isAuthenticated: false },
  dispatch: ({ type }: { type: string }) => {},
});

const reducer = (prevState: any, action: any) => {
  const { type } = action;
  if (type === SET_TOKEN) {
    const { payload: jwtToken } = action;
    return {
      ...prevState,
      jwtToken,
      isAuthenticated: true,
    };
  } else if (type === DELETE_TOKEN) {
    return {
      ...prevState,
      jwtToken: "",
      isAuthenticated: false,
    };
  }
  return prevState;
};

export const AppProvider = ({ children }: any) => {
  const jwtToken = getStorageItem("jwtToken", "");
  const [store, dispatch] = useReducer(reducer, {
    jwtToken,
    isAuthenticated: jwtToken.length > 0,
  });

  useEffect(() => {
    // console.log("'store' changed");
    // console.log("store: ", store);
    const { jwtToken } = store;
    setStorageItem("jwtToken", jwtToken);
  }, [store]);

  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

//Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";

//Action Creators
export const setToken = (token: any) => ({ type: SET_TOKEN, payload: token });
export const deleteToken = () => ({ type: DELETE_TOKEN });
