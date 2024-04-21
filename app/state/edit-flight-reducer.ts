export const editFlightReducer = (state: EditFlightState, action: EditFlightAction) => {
 switch(action.type) {
   case "formElementChange":
     return {
       ...state,
       [action.field]: action.value
     }
 }
}


export type EditFlightState = {
  formations: string,
  flyers: string,
  date: string,
}

export type EditFlightAction =
  | { type: "formElementChange", field: string, value: string }
