import { Router } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {userService} from '../repositories/index.js';

export default class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter = () => {
    return this.router;
  };

  init() {}

  applyCallback(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500);
      }
    });
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload) => res.status(200).send({ status: "success", payload })
    res.sendServerError = (error) =>
      res.status(500).send({ status: "Server error", payload: error });
    res.sendUserError = (error) =>
      res.status(400).send({ status: "User Error", payload: error});
    next();
  };

  // Policies: [ 'PUBLIC' ] [ 'USER' ] ['ADMIN' ]
  handlePolicies = (policies) => async (req, res, next) => {
   try {
    if (policies[0] === "PUBLIC") return next();
    
    const token = req.cookies["cookieToken"];
    
    if (!token) {
      req.logger.error('Router Policies - Not Token')
      return res.status(404).json({payload : 'Not token'})
    }
    const user = jwt.verify(token, config.tokenKey);
    if (!policies.includes(user.role.toUpperCase())){
      req.logger.error('Router Policies - Role not authorized')
      return res.status(404).json({payload : 'Role not authorized'})
    }
    
    const {role} = await userService.getById(user._id)
    console.log(role);
    user.role = role
    req.user = user;
    return next();
   } catch (error) {
    res.status(404).json({payload: `Error: ${error}`})
   }
  };
  
  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallback(callbacks)
    );
  }
  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallback(callbacks)
    );
  }
  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallback(callbacks)
    );
  }
  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallback(callbacks)
    );
  }
}
