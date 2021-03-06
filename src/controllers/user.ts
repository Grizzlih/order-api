import {NextFunction, Request, Response} from 'express';
import * as halson from 'halson';
import { UserModel } from '../schemas/user';
import {formatOutput} from '../utility/orderApiUtility';

export let getUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    UserModel.findOne({username}, (err, user) => {
        if (!user) {
            return res.status(404).send();
        }

        user = user.toJSON();
        user._id = user._id.toString();

        user = halson(user).addLink('self', `/users/${user._id}`);
        return formatOutput(res, user, 200, 'user');
    });
};

export let addUser = (req: Request, res: Response, next: NextFunction) => {
    const newUser = new UserModel(req.body);

    newUser.save((err, user) => {
        user = halson(user.toJSON()).addLink('self', `/users/${user._id}`);
        return formatOutput(res, user, 201, 'user');
    });
};

export let updateUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    UserModel.findOne({username}, (err, user) => {
        if (!user) {
            return res.status(404).send();
        }
        user.username = req.body.username || user.username;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.phone = req.body.phone || user.phone;
        user.userStatus = req.body.userStatus || user.userStatus;

        user.save(() => {
            res.status(204).send();
        });
    });
};

export let removeUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    UserModel.findOne({username}, (err, user) => {
        if (!user) {
            return res.status(404).send();
        }

        user.remove(() => {
            res.status(204).send();
        });
    });
};
