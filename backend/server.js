const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://hieumn299:CabagnQm9dwfAZf8@cluster0.pctrbqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Schema for users of app
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },
    isLucky: {
        type: Boolean,
    },
    isSubmit: {
        type: Boolean,
    }
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by 
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});

app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            resp.send(req.body);
            console.log(result);
        } else {
            console.log("User already register");
        }

    } catch (e) {
        resp.send("Something Went Wrong");
    }
});

app.get("/users/:name", async (req, resp) => {
    const name = req.params.name;

    try {
        // Tìm người dùng trong database
        const user = await User.findOne({ name: name });

        if (user) {
            // Nếu tìm thấy người dùng, gửi thông tin người dùng về
            let userData = user.toObject(); // Xóa trường password để không trả về mật khẩu
            resp.json(userData);
        } else {
            // Nếu không tìm thấy người dùng
            resp.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        // Xử lý lỗi nếu có
        console.error(err);
        resp.status(500).send('Server Error');
    }
});

app.get("/users", async (req, resp) => {
    try {
        // Tìm người dùng trong database
        const users = await User.find({}).lean();
        if (users) {
            // Nếu tìm thấy người dùng, gửi thông tin người dùng về
            let userData = users;
            const result = userData.map((item, index) => {
                return {
                    ...item,
                    name: ''
                }
            })
            // delete result.name; // Xóa trường password để không trả về mật khẩu
            resp.json(result);
        } else {
            // Nếu không tìm thấy người dùng
            resp.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        // Xử lý lỗi nếu có
        console.error(err);
        resp.status(500).send('Server Error');
    }
});

app.put("/update/:name", async (req, res, next) => {
    const { name } = req.params;
    try {
        const updated = await User.findOneAndUpdate({ name: name }, req.body, {
            new: true,
        });

        res.json(updated);
    } catch (error) {
        next(error)
    }
})

app.listen(5000);