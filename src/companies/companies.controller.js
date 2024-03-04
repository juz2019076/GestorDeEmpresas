import bcryptjs from 'bcryptjs';
import Companies from './companies.model.js';

export const companiesPost = async (req, res) => {

    const {name, impactLevel, yearsExperience, companyCategory} = req.body;
    const userId = req.user._id;

    const companies = new Companies({ name, impactLevel, yearsExperience, companyCategory, user: userId });

    await companies.save();

    res.status(200).json({
        companies
    });
}

export const companiesPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...resto } = req.body;
        const { user } = req; 

        const companies = await Companies.findById(id);

        if (!companies || companies.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                msg: 'Unauthorized access',
            }); 
        }

        const companiesActualizada = await Companies.findByIdAndUpdate(id, resto);

        res.status(200).json({
            msg: 'The post was updated successfully.',
            companies: companiesActualizada
        });

    } catch (e) {
        console.error('Error creating companies', e);
        res.status(500).json({ e: "Internal Server Error" });
    }
}

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

export const getCompaniesByYear = async (req, res) => {
    try {
        let { startYear, endYear } = req.query;

        if (!startYear) {
            startYear = endYear;
        }

        if (!endYear) {
            endYear = startYear;
        }

        const query = {
            yearsExperience: {
                $gte: startYear,
                $lte: endYear
            }
        };
        const companies = await Companies.find(query).exec();

        res.status(200).json({
            companies
        })
    } catch (e) {
        res.status(500).json({
            message: error.message
        });

    }
}

export const getCompaniAZ = async (req, res) => {
    try {

        // obtener las empresar de forma ascendente por name utilizando valor 1 para indicar que es ascendente
        const companies = await Companies.find().sort({ name: 1 });
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error getting companies in ascending order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCompaniZA = async (req, res) => {
    try {
        // obtener las empresar de forma ascendente por name utilizando valor 1 para indicar que es ascendente
        const companies = await Companies.find().sort({ name: -1 });
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error getting companies in descending order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCompaniByCategory = async (req, res) => {
    try {
        let { companyCategory } = req.body;

        const companies = await Companies.find({ companyCategory });

        res.status(200).json({
            msg: `Companies with companyCategory '${companyCategory}' retrieved successfully`,
            companies,

        });
    } catch (error) {
        console.error("Error fetching companies by companyCategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const generateExcelReport = async (req, res) => {
    try {
        const companies = await Companies.find();

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet('Companies Report');

        // Definir encabezados
        const headers = ['Name', 'Business Activity', 'Years of Experience', 'Impact Level', 'Business Category'];
        headers.forEach((header, index) => {
            ws.cell(1, index + 1).string(header);
        });

        // Llenar datos
        companies.forEach((companies, rowIndex) => {
            ws.cell(rowIndex + 2, 1).string(companies.name);
            ws.cell(rowIndex + 2, 2).string(companies.impactLevel);
            ws.cell(rowIndex + 2, 3).number(companies.yearsExperience);
            ws.cell(rowIndex + 2, 4).string(companies.companyCategory);
        });

        // Obtener el archivo Excel como un buffer
        const buffer = await wb.xlsx.writeBuffer();

        // Configurar respuesta HTTP
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Companies_Report.xlsx');

        // Enviar el archivo Excel como respuesta
        res.send(buffer);

    } catch (error) {
        console.error("Error generating Excel report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}