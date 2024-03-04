import User from '../users/user.model.js';

export const existsEmail = async (correo = '') => {
    const existEmail = await User.findOne({correo});
    if (existEmail){
        throw new Error(`The email ${correo} has already been registered`);
    }
}

export const existUserById = async (id = '') => {
    const existUser = await User.findById(id);
    if (!existUser){
        throw new Error(`The ID: ${correo} does not exist`);
    }
}