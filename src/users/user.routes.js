import { Router } from "express";
import { check } from "express-validator";
import { 
    usersPost
} from "./user.controller.js";
import {
    existsEmail,
} from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";

const router = Router();

router.post(
    "/",
    [
        check("name", "The name is required").not().isEmpty(),
        check("password", "The password must be greater than 6 characters").isLength({
          min: 6,
        }),
        check("email", "This is not a valid email").isEmail(),
        check("email").custom(existsEmail),
        validateFields,
    ],
    usersPost
);

export default router;