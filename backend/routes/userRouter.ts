import express, {Request, Response} from "express";
import * as bodyParser from "body-parser";

import * as userModel from "../models/user";
import {User} from "../types/User";
import { generateToken } from '../jwt';

const userRouter = express.Router();
var jsonParser = bodyParser.json();


userRouter.get("/", async (req: Request, res: Response) => {
  userModel.findAll((err: Error, users: User[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({"data": users});
  });
});


userRouter.get("/:id", async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);
  userModel.findOne(userId, (err: Error, user: User) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }
    res.status(200).json({"data": user});
  })
});

userRouter.post("/",jsonParser, async (req: Request, res: Response) => {
  console.log(req.body);
  const newUser: User = req.body;
  userModel.create(newUser, (err: Error, userId: number) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }

    res.status(200).json({"message": 'Utilizatorul a fost adaugat cu succes!'});
  });
});

// Edit user
userRouter.put("/:id",jsonParser, async (req: Request, res: Response) => {
  const user: User = req.body;
  console.log(req.body);
  userModel.update(user, (err: Error) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }

    // res.status(200).send();
    res.status(200).json({
      "message": 'success'
      });
  })
});
// Delete user
userRouter.delete("/:id",jsonParser, async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);
  console.log(userId);
  userModel.deleteUser(userId, (err: Error) => {
    if (err) {
      return res.status(500).json({"message": err.message});
    }

    // res.status(200).send();
    res.status(200).json({
      "message": 'success'
      });
  })
});
userRouter.post("/veifyLogin",jsonParser, async (req: Request, res: Response) => {
  console.log(req.body);
  const loginUser: User = req.body;
  userModel.veifyPassword(loginUser, (err: Error, user: User) => {
    if (err) {
      return res.status(401).send({
        accessToken: null,
        message: err.message
      });
      //return res.status(500).json({"message": err.message});
    }
     var token = generateToken();
     console.log('JWT', token);
    //res.status(200).json({"message": 'success'});
    res.status(200).send({
      id: user.id,
      fname: user.fname,
      email: user.email,
      roles: 'ADMIN',
      accessToken: token
    });
  });
});

export {userRouter};