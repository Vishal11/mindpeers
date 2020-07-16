var mongoose =  require('mongoose');

const Schema = mongoose.Schema;
const UserDetail = new Schema({name: String, email: String, phone: Number, city: String, medIssue: String})

const DoctorSchema = new Schema({
    name: {
		type 	: String, 
		required: true
	},
    email: {
		type 	: String, 
		required: true
    },
    appointmentDate: Date,
    limit: {
      type: Number,
      default:3
    },
    aprovedList: [UserDetail],
    pendingList: [UserDetail]

},{collection : "doctor"})


exports.DoctorSchema = mongoose.model('doctor', DoctorSchema)