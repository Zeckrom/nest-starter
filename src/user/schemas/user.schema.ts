import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcrypt'

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: HookNextFunction) {
    try {
        if (!this.isModified('password')) {
            return next()
        }
        const hashed = await bcrypt.hash(this['password'], 10)
        this['password'] = hashed
        return next()
    } catch (err) {
        return next(err)
    }
})

export { UserSchema }