import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User, GetGPTResponseRequest } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import axios from 'axios';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: User = req.body;
      const updateUserData: User[] = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User[] = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getGPTResponse = async (req : Request, res:Response, next: NextFunction) : Promise<void> => {
    try{
      const systemData = req.body.systemData;
      const inputData = req.body.inputData;
      const SECRET_KEY = "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";
      const MAX_TOKENS = 800;
      const TEMPERATURE = 0.9;
      const url = "https://api.openai.com/v1/chat/completions";
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemData },
          { role: "user", content: inputData },
        ],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      };

      const options = {
        headers: {
          'Authorization': 'Bearer ' + SECRET_KEY,
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await axios.post(url, payload, options);
        if (response.status !== 200) {
          console.log( "Error: Unable to connect to the OpenAI API.");
        }

        const resData = response.data;
        res.status(200).json({responseData : resData.choices[0].message.content.trim()});
      } catch (error) {
        console.log( 'Error: ' + error.toString());
        res.status(400).json({ message : "error : " + error.toString() });
      }
    }catch (error) {
      console.log(error);
      res.status(400).json({ message : "error : " + error.toString() });
    }
  }
}
