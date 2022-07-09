const bcrypt = require("bcryptjs/dist/bcrypt");
const validator = require("validator");
const {Staff} = require('../models')
const genToken = require('../utils/genToken')
const createError = require("../utils/createError");

exports.staffLogin = async (req, res, next) => {
    try {
        // DESTRUCTURING REQUEST BODY
        const { email, password } = req.body;

        // CHECK FOR EMAIL 
        const staff = await Staff.findOne({
            where: {
                email: email
            }
        });
        
        if (!staff) {
            createError('invalid credentials 1', 400);
        }

        // console.log(staff.password)

        // CHECK FOR PASSWORD MATCH
        const isMatch = await bcrypt.compare(password, staff.password)
        if (!isMatch) {
            createError('invalid credentials 2', 400);
        }
        // GEN AND SEND TOKEN
        if (staff) {
            const token = genToken({ id: staff.id })

            // console.log(token)
            res.status(201).json({ token });
        }

   } catch (err) {
       next(err)
   }
}
    
exports.newStaff = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (!email) {
            createError('email required', 400)
        } if (!password) {
            createError('password required', 400)
        } if (password !== confirmPassword) {
            createError('passwords do not match', 400)
        };

        const isEmail = validator.isEmail(email + '')

        if (!isEmail) {
            createError('email is invalid format', 400)
        };

        const hashedPassword = await bcrypt.hash(password, 12);

        await Staff.create({
            firstName,
            lastName,
            email: email,
            password: hashedPassword
        });

        res.status(200).json({ message: 'staff creation complete' })
    } catch (err) {
        next(err)
    }
}

exports.getMe = async (req,res,next) => {
    try {
        // console.log(req.data)
        // console.log(JSON.stringify(req.data, null, 2))
        const user = JSON.parse(JSON.stringify(req.user));
        res.json({user})
    } catch (err) {
        next(err)
    }
}
