const jwt = require("jsonwebtoken");
const Interviewee = require("../models/interviewee");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        user
    });
};

const SignUp = catchAsync(async (req, res) => {
    const newUser = await Interviewee.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    createSendToken(newUser, 201, res);
});

const Login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await Interviewee.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await Interviewee.find();

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: users.length,
        users,
    });
});

const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
        return next(
            new AppError(
                "This route is not for password updates. Please use /updateMyPassword.",
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email",);

    // 3) Update user document
    const updatedUser = await Interviewee.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});


module.exports = {
    SignUp,
    Login,
    updateMe,
    getAllUsers
};
