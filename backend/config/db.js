const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
    }catch(e){
        console.error(`Error, ${e.message}`.red.underline.bold)
        //Ako proslijedimo 1 znaci da ce exit sa failure
        process.exit(1)
    }
}

module.exports = connectDB