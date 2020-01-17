import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { home } from './features/Home/Home.sack'

export default combineReducers({
  form,
  routing,
  home
})
