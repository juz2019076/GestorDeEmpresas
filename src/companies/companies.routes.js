import { Router } from "express";
import { check } from "express-validator";
import { 
    companiesPost,
    getCompaniesByYear,
    getCompaniAZ,
    getCompaniZA,
    getCompaniByCategory,
    companiesPut,
    generateExcelReport
} from "./companies.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("name", "The name is require"), 
        check("impactLevel", "Impact level is mandatory"),
        check("yearsExperience", "Years of experience is mandatory"),
        check("companyCategory", "The company category is mandatory"),
        validateFields,
    ],
    companiesPost
);

router.put(
    "/:id",
    [
        validarJWT,
        check("name", "The name is require"),
        check("impactLevel", "Impact level is mandatory"),
        check("yearsExperience", "Years of experience is mandatory"),
        check("companyCategory", "The company category is mandatory"),
        validateFields,
    ],
    companiesPut
);

/*
    NOTA: Para evitar problemas de plagio especificamos que con los compañeros:
        Jose David Soto Puac - 2019315
        Brandon Steev Mendoza Peres - 2019349
        Alejandro Benjamin Max López - 2019189
        
        Nos reunimos en una llamada para trabajar en conjunto para poder realizar 
        las validaciones de filtros de A-Z, Z-A, Años, se puede evidenciar que los 
        tres trabajamos en conjunto y los tres realizamos aportes significativos para
        realizar estas validaciones. 
*/

router.get(
    "/",
    validarJWT,
    getCompaniesByYear
);

router.get("/companies-az", getCompaniAZ);
router.get("/companies-za", getCompaniZA);

router.get('/category', getCompaniByCategory);

router.get('/report', generateExcelReport);

export default router;