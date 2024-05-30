import RouterClass from "./router.js";
import { SessionController } from "../controllers/sessions.controller.js";
import { passportCall } from "../middlewares/passportCall.js";

const { login, logout, register,recoveryPasswordEmail, recoveryPassword, generateToken} = new SessionController();

export default class sessionRouter extends RouterClass {
  init() {
    
    // --------------- POST --------------- //
    this.post("/login", ["PUBLIC"], passportCall("login"), login);
    this.post("/register", ["PUBLIC"], passportCall("register"), register);
    this.post("/recovery-password",["PUBLIC"], recoveryPasswordEmail);
    this.post("/logout", ["USER", "ADMIN", "PREMIUM"], logout);
    this.post('/recovery-password/:token', ['PUBLIC'], recoveryPassword)
    this.post('/generateToken', ['PUBLIC'], generateToken)
  }
}
