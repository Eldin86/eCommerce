const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

//Compare users password for login
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Before we save data
userSchema.pre('save', async function(next){
    //Ako password nije modifikovan proslijedi dalje, odnosno editovan prilikom editovanja profila, moramo provjeriti ovo jer bi inace generisalo novi hash i ne bi se mogli logirati
    //if there is not modification on password field then do not update hashed password on the db.
    if(!this.isModified('password')){
         return next()
    }

    //Store hashed password 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

module.exports = User