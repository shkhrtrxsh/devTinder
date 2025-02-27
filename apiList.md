# DevTinder APIs

authRouter

- POST /signup
- POST /login
- POST /logout

profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // forgot password API

conncetionRequestRouter

- POST /request/send/:status/:userId

- POST /request/:status/:requestId
- POST /request/:status/:requestId
  use indexing
  userRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed- gets you the profiles of other users on platform

Status: ingnore, interested, accepted, rejected
