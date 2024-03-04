import bcryptjs from 'bcryptjs';
import Users from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

  try {

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Incorrect credentials, Email does not exist in the database",
      });
    }

    if (!user.state) {
      return res.status(400).json({
        msg: "The user does not exist in the database",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password is incorrect",
      });
    }

    const token = await generarJWT( user.id);

    res.status(200).json({
      msg: 'Welcome',
      user,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact administrator",
    });
  }
}