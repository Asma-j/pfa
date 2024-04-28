const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseCandidatSchema = new mongoose.Schema({
    reponse: [{
        type: Schema.Types.ObjectId,
        ref: 'Reponse', 
        required: true
    }],
    candidat: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    taux: {
        type: Number,
        required: true
    }
});

const ResponseCandidat = mongoose.model('ResponseCandidat', ResponseCandidatSchema);

module.exports = ResponseCandidat;
