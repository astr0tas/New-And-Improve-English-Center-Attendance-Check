import { createContext, useState } from "react"

export const context = createContext();

export const ContextProvider = (props) =>
{
      const [chosenRole, setChosenRole] = useState(0);
      const [staffType, setStaffType] = useState(0);

      return (
            <context.Provider value={ { chosenRole, setChosenRole, staffType, setStaffType } }>
                  { props.children }
            </context.Provider>
      );
}