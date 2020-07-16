var mongoose =  require('mongoose');

mongoose.connect('mongodb://localhost:27017/Mindpeers',{ useNewUrlParser: true, useUnifiedTopology: true});


mongoose.connection.on('connected', ()=> {
    console.log('Connection Open');
})
mongoose.connection.on('error', (err)=> {
    console.log(`Connection error ${err}`);
})
mongoose.connection.on('disconnected', ()=> {
    console.log('Connection closed');
})

process.on('SIGINT', () => {
    mongoose.connection.close(()=> {
        console.log('Connection closed: Service terminated');
    })
})
