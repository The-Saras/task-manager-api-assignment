import { NextFunction,Request,Response } from "express"
import jsonwebtoken from "jsonwebtoken"

const authSecret = process.env.AUTH_SECRET || "randomstring"


export const authenticate = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
        console.log("No token found")   
    }
    jsonwebtoken.verify(token || "",authSecret,(err:any,user)=>{
        if(err){
            return res.sendStatus(403)
        }
        if(!user){
            return res.sendStatus(403)
        }
        if(typeof user ==="string"){
            return res.sendStatus(403)
        }
        req.headers["userId"] = user.userId
        next();
    })
  };