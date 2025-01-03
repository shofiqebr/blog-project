import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required:[true, 'Please provide your name'],
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        validate: {
            validator : function (value : string){
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
            },
            message: '{VALUE} is not a valid email',
        },
        immutable: true,
    },
password: {
    type: String,
    required: true,
    select: false,
},
role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not valid, please provide a valid role',
    },
    default: 'user',
    required: true,
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
  } 
}
// , { timestamps: true }
)

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;

    // Check if the password is being modified
    if (!user.isModified('password')) {
        return next();
    }

    // Ensure password is present
    if (!user.password) {
        throw new Error('Password is required for hashing.');
    }

    // Ensure bcrypt salt rounds are set properly
    const saltRounds = Number(config.bcrypt_salt_rounds);
    if (isNaN(saltRounds) || saltRounds <= 0) {
        throw new Error('Invalid bcrypt salt rounds configuration.');
    }

    // Hash the password
    user.password = await bcrypt.hash(user.password, saltRounds);

    next();
});


userSchema.post('save', function(doc, next){
    doc.password = '';
    next();
})


const User = model<IUser>('User',userSchema)
export default User