import mongoose, { Schema, model } from 'mongoose';

const CompaniesSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "The name is require"],
    },
    impactLevel: {
        type: String,
        require: [true, "Impact level is mandatory"],
    },
    yearsExperience: {
        type: Number,
        require: [true, "Years of experience is mandatory"],
    },
    companyCategory: {
        type: String,
        require: [true, "The company category is mandatory"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, "The user is required"],
    },
    state: {
        type: Boolean,
        default: true,
    }
});

CompaniesSchema.methods.toJSON = function(){
    const { _v, password, _id, ...companies} = this.toObject();
    companies.uid = _id;
    return companies;
}

export default mongoose.model('Companies', CompaniesSchema);