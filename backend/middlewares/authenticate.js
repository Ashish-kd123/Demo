  const { verifyToken } = require("../utils/helper");
  const { getAllModels } = require("./loadModels");
  const CustomError = require("./customError");

  const findUser = async (where, next) => {
    try {
      const { Users } = await getAllModels(process.env.DB_TYPE);
      if (typeof where !== "object" || Object.keys(where).length === 0) {
        throw { message: "Invalid where condition" };
      }

      let user = await Users.findOne({
        where: where,
      });

      return user;
    } catch (error) {
      return next(
        new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
      );
    }
  };

  exports.authenticate = async (req, res, next) => {
    try {
       console.log("AUTH HEADER:", req.headers.authorization);
      if (req.headers.authorization) {
        let token = null;
        const authorization = req.headers.authorization.split(" ");
        if (authorization.length === 2) {
          const key = authorization[0];
          const val = authorization[1];
          if (/^Bearer$/i.test(key)) {
            token = val.replace(/"/g, "");
            console.log("TOKEN RECEIVED:", token);
            if (token) {
              verifyToken(token, async function (err, decoded) {
                if (err) {
                   console.log("TOKEN VERIFY FAILED:", err);
                  return next(
                    new CustomError(`You are not authenticated! ${err}`, 400)
                  );
                }
 console.log("TOKEN DECODED:", decoded);
                req.decoded = decoded;
                let userDetail = await findUser({ id: req.decoded.id }, next);

                if (userDetail) {
                  req.user = userDetail;
                  req.user_id = userDetail.id;
                  return next();
                } else {
                  console.log("USER NOT FOUND FROM TOKEN");
                  return next(new CustomError("Invalid Token", 401));
                }
              });
            }
          }
        } else {
            console.log("Bearer token not provided correctly.");
          return next(
            new CustomError(
              "You are not authorized to perform this operation!",
              401
            )
          );
        }
      } else {
         console.log("Authorization header missing.");
        return next(
          new CustomError(
            "You are not authorized to perform this operation!",
            401
          )
        );
      }
    } catch (error) {
      console.log("Unexpected error in auth:", error.message);
      return next(
        new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
      );
    }
  };

  exports.authorize = async (req, res, next) => {
    try {
      
      if (req.headers.authorization) {
        let token = null;
        const authorization = req.headers.authorization.split(" ");
        if (authorization.length === 2) {
          const key = authorization[0];
          const val = authorization[1];
          if (/^Bearer$/i.test(key)) {
            token = val.replace(/"/g, "");
            if (token) {
              verifyToken(token, async function (err, decoded) {
                if (err) {
                  return next(
                    new CustomError(`You are not authenticated! ${err}`, 400)
                  );
                }

                req.decoded = decoded;
                let userDetail = await findUser({ id: req.decoded.id }, next);

                if (userDetail) {
                  req.user = userDetail; // No role-based check is needed here.
                  return next();
                } else {
                  return next(new CustomError("Invalid Token", 401));
                }
              });
            }
          }
        } else {
          return next(
            new CustomError(
              "You are not authorized to perform this operation!",
              401
            )
          );
        }
      } else {
        return next(
          new CustomError(
            "You are not authorized to perform this operation!",
            401
          )
        );
      }
    } catch (error) {
      return next(
        new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
      );
    }
  };
