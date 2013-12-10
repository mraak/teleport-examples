// Application
applicationView = new View
( "application"
, [ authenticationState
  , getProcessSessionState()
  , loginState
  , startState
  , getProcessSessionState()
  , trackUserState
  , toolState
  , errorState
  , notFoundState
  ]
);