import React from "react"

const SecurityContext = React.createContext(
    {
        authenticated: false, 
        setAuthenticated: () => {},
        authorize: () => {},
        user: {},
        get: () => {},
        post: () => {},
    }
);
export default SecurityContext;