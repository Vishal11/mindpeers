var mongoose =  require('mongoose');

const Schema = mongoose.Schema;
const UserDetail = new Schema({name: String, email: String, phone: Number, city: String, medIssue: String})

const AppointmentSchema = new Schema({
    name: {
		type 	: String, 
		required: true
	},
    email: {
		type 	: String, 
		required: true
    },
    limit:{
      type: Number,
      default: 3
    },
    appointmentDate: Date,
    approvedList: [UserDetail],
    pendingList: [UserDetail]

},{collection : "appointment"})


exports.AppointmentSchema = mongoose.model('appointment', AppointmentSchema)