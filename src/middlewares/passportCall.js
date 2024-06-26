import passport from "passport";

export const passportCall = strategy => {
  return async (req, res, next) => { 
      passport.authenticate(strategy, function (err, user, info) {
          if(err) return next(err)
          if(!user) return res.sendServerError(info.payload)
          req.user = user
          return next()
      })(req, res, next)
  }
}