import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cron from "node-cron";
var port = 3000;
const app = express();
var entry = true;
var booking = [];
var Leaves = [];
var complaint=[];
var complain=[];
var civil=[];
var mess=[];
    mongoose.connect('mongodb://127.0.0.1:27017/ProgoDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
const validateEmailDomain = function (value) {
    const domainToCheck = 'iiitu.ac.in';

    // Split the email address by "@" to get the domain part
    const parts = value.split('@');

    // Check if the email address has exactly two parts and the second part is the desired domain
    if (parts.length === 2 && parts[1] === domainToCheck) {
        return true; // Email belongs to the specified domain
    } else {
        return false; // Email does not belong to the specified domain
    }
};
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    roll: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validateEmailDomain,
            message: 'Email address must belong to @iiitu.ac.in'
        }
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        maxLength: [10],
        minLength: [10]
    }
});
const User = mongoose.model("User", UserSchema);
const BookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    room: { type: Number, required: true, min: 1, max: 325 },
    roll: {
        type: Number,
        required: true,
        minLength: [5],
        maxLength: [5],
        trim: true
    },
    removalTime: {
        type: Number,
        max: 60,
    },
    phone: Number
})

const LeaveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: {
        type: Number,
        required: true,
        minLength: [5],
        maxLength: [5],
        trim: true
    },
    room: { type: Number, required: true, min: 1, max: 325 },
    hostel:{type:String,required:true},
    departure:{type:String,required:true},
    arrival:{type:String,required:true},
    days:{type:Number,required:true},
    address:{type:String,required:true},
    phone: Number
})
const MessSchema=new mongoose.Schema({
    name:{type:String,required:true},
    roll:{
        type:Number,
        required:true,
        minLength: [5],
        maxLength: [5],
        trim: true
    },
    room: { type: Number, required: true, min: 1, max: 325 },
    mess:{type:String,required:true},
    complaint:{type:String,required:true}
})

const CivilSchema=new mongoose.Schema({
    name:{type:String,required:true},
    roll:{
        type:Number,
        required:true,
        minLength:[5],
        maxLength:[5],
        trim:true
    },
    room: { type: Number, required: true, min: 1, max: 325 },
    hostel:{type:String,required:true},
    complain:{type:String,required:true}
})

const Booking = mongoose.model("Booking", BookingSchema);
const Leave = mongoose.model("Leave", LeaveSchema);
const Mess=mongoose.model("Mess",MessSchema);
const Civil=mongoose.model("Civil",CivilSchema);


app.get("/", (req, res) => {
    console.log("hii");
    res.render("login.ejs")
})
app.get("/register", (req, res) => {
    res.render("Register.ejs")
})
app.get("/home", (req, res) => {
    res.render("Home.ejs");
})
app.get("/hostel", (req, res) => {
    res.render("Hostel.ejs")
})
app.get("/academics", (req, res) => {
    res.render("Academics.ejs")
})

app.get("/machine", (req, res) => {
    res.render("Machine.ejs")
})
app.get("/leave", (req, res) => {
    res.render("Leave.ejs")
})

app.get("/submission",(req,res)=>{
    res.render("Submission.ejs")
})
app.get("/civil",(req,res)=>{
    res.render("Civil.ejs")
})

app.get("/mess",(req,res)=>{
    res.render("Mess.ejs")
})
app.get("/machinestatus", (req, res) => {
    Booking.find()
        .then(book => {
            res.render("MachineStatus.ejs", { booking: book })
        })
        .catch(err => {
            console.log(err);
        })

})

app.get("/civilStatus",(req,res)=>{
    Civil.find()
    .then(civil=>{
        res.render("CivilStatus.ejs",{complain:civil})
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.get("/messStatus",(req,res)=>{
    Mess.find()
    .then(mess=>{
        res.render("MessStatus.ejs",{complaint:mess})
    })
    .catch((err=>{
        console.log(err)
    }))
})

app.get("/leavestatus", (req, res) => {
    res.render("LeaveStatus.ejs")
})
app.post("/leaverecord", (req, res) => {
    var rollno = req.body.leave;
    Leave.findOne({roll:rollno})
        .then(l => {
            res.render("LeaveStatus.ejs",{Leaves:l});
        })
})

app.post("/register", (req, res) => {
    const user = new User({
        username: req.body.username,
        roll: req.body.roll,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    });
    user.save()
        .then(() => {
            console.log("successfully added");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/register");
        })
})

app.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    async function findUser() {
        try {
            const foundUser = await User.findOne({ email: email }).exec();
            if (foundUser && foundUser.password === password) {
                res.redirect("/home");
            }
            else {
                console.log("error");
            }
        } catch (err) {
            console.log(err);
        }
    }
    findUser();
})
app.post("/submit", (req, res) => {
    const booking = new Booking({
        name: req.body.name,
        roll: req.body.roll,
        room: req.body.room,
        removalTime: req.body.time,
        phone: req.body.phone
    });
    booking.save()
        .then((e) => {
            console.log(e);
            res.redirect("/machine")
        })
        .catch((err) => {
            console.log(err.message);
        })

})
app.post("/submitleave", (req, res) => {
    const leave = new Leave({
        name: req.body.name,
        roll: req.body.roll,
        room: req.body.room,
        hostel: req.body.hostel,
        departure: req.body.departure,
        arrival: req.body.arrival,
        days: req.body.days,
        address: req.body.address,
        phone: req.body.phone
    });
    leave.save()
        .then((e) => {
            console.log(e);
            Leave.find()
                .then(l => {
                    res.render("Submission.ejs", { Leaves: l })
                })
            // res.render("Submission.ejs",{Leaves:leave})
            // res.redirect("/leave")
        })
        .catch((err) => {
            console.log(err.message);
        })
})
app.post("/submitmess", (req, res) => {
    const mess = new Mess({
        name: req.body.name,
        roll: req.body.roll,
        room: req.body.room,
        mess: req.body.mess,
        complaint: req.body.complain
    });
    mess.save()
        .then((f) => {
            Mess.find()
            .then(t=>{
                res.render("Submit.ejs",{mess:t})
            })
            
        })
        .catch((err) => {
            console.log(err.message);
        })
})
app.post("/submitcivil",(req,res)=>{
    const civil=new Civil({
        name:req.body.name,
        roll:req.body.roll,
        room:req.body.room,
        hostel:req.body.hostel,
        complain:req.body.complain

    });
    civil.save()
    .then((g)=>{
        Civil.find()
        .then(l=>{
            res.render("Submit.ejs",{civil:l})
        })
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

cron.schedule('0 */1 * * * *', async () => {
    try {
        await Booking.deleteOne()
        console.log("deleted")
    }
    catch (e) {
        console.log(e.message)
    }
});

app.listen(port, () => {
    console.log("Server is running on " + port);
})
