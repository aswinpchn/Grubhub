var mongoose = require('mongoose');

const connectionPromise = mongoose.connect('mongodb+srv://root:11923914@grubhub-aq07l.mongodb.net/grubhub?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, });

connectionPromise.then(response => {
    console.log('Connection success');
}).catch(error => {
    console.log('Connection failure');
});