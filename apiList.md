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
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed- gets you the profiles of other users on platform

Status: ingnore, interested, accepted, rejected
