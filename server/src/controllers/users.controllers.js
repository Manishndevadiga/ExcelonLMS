import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";


// -----------------------------------------
// Generate Access + Refresh Tokens
// -----------------------------------------

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};


// -----------------------------------------
// Cookie Options
// -----------------------------------------

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


// -----------------------------------------
// Seed Admin
// -----------------------------------------

const seedAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate fields
  if (
    !name ||
    !email ||
    !password ||
    !name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    throw new ApiError(
      400,
      "Name, email and password are required"
    );
  }

  // Check whether an admin already exists
  const existingAdmin = await User.findOne({
    role: "admin",
  });

  if (existingAdmin) {
    throw new ApiError(
      400,
      "Admin already exists"
    );
  }

  // Create admin
  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  // Remove sensitive fields
  const createdAdmin = await User.findById(
    admin._id
  ).select("-password -refreshToken");

  return res.status(201).json({
    success: true,
    user: createdAdmin,
    message: "Admin created successfully",
  });
});


// -----------------------------------------
// Employee Signup
// -----------------------------------------

const userSignup = asyncHandler(async (req, res) => {

  const {
    name,
    email,
    password,
  } = req.body;


  // Validate fields

  if (
    [name, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(
      400,
      "All fields are required"
    );
  }


  // Check existing user

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User already exists"
    );
  }


  // -----------------------------------------
  // IMPORTANT:
  // Role is NOT taken from req.body.
  // Every public signup is an employee.
  // Admin accounts should be created using admin seed from the backend script itself 
  // -----------------------------------------

  const user = await User.create({
    name,
    email,
    password,
    role: "employee",
  });


  // Generate tokens

  const {
    accessToken,
    refreshToken,
  } = await generateAccessAndRefreshTokens(
    user._id
  );


  // Return user without sensitive fields

  const createdUser = await User.findById(
    user._id
  ).select("-password -refreshToken");


  return res
    .status(201)
    .cookie(
      "accessToken",
      accessToken,
      cookieOptions
    )
    .cookie(
      "refreshToken",
      refreshToken,
      cookieOptions
    )
    .json({
      success: true,
      user: createdUser,
      message: "Employee account created successfully",
    });
});


// -----------------------------------------
// Login
// Employee + Admin
// -----------------------------------------

const userLogin = asyncHandler(async (req, res) => {

  const {
    email,
    password,
  } = req?.body;

  


  // Validate fields

  if (
    [email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }


  // Find user

  const loggedUser = await User.findOne({
    email,
  });

  if (!loggedUser) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  // Check password

  const passwordCorrect =
    await loggedUser.isPasswordCorrect(password);

  if (!passwordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  // Generate tokens

  const {
    accessToken,
    refreshToken,
  } = await generateAccessAndRefreshTokens(
    loggedUser._id
  );


  // Get user without sensitive fields

  const userInfo = await User.findById(
    loggedUser._id
  ).select("-password -refreshToken");


  return res
    .status(200)
    .cookie(
      "accessToken",
      accessToken,
      cookieOptions
    )
    .cookie(
      "refreshToken",
      refreshToken,
      cookieOptions
    )
    .json({
      success: true,
      user: userInfo,
      message: "Logged in successfully",
    });
});


// -----------------------------------------
// Check Authentication
// Employee + Admin
// -----------------------------------------

const checkAuth = asyncHandler(async (req, res) => {

  const accessToken =
    req.cookies?.accessToken;

  if (!accessToken) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }


  try {

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );


    const user = await User.findById(
      decodedToken._id
    ).select("-password -refreshToken");


    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }


    return res.status(200).json({
      success: true,
      user,
      message: "Authentication successful",
    });

  } catch (error) {

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      401,
      "Invalid or expired access token"
    );
  }
});


// -----------------------------------------
// Logout
// Employee + Admin
// -----------------------------------------

const userLogout = asyncHandler(async (req, res) => {

  const userId = req.user._id;


  // Remove refresh token from database

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    }
  );


  return res
    .status(200)
    .clearCookie(
      "accessToken",
      cookieOptions
    )
    .clearCookie(
      "refreshToken",
      cookieOptions
    )
    .json({
      success: true,
      message: "User logged out successfully",
    });
});



export {
  userSignup,
  userLogin,
  checkAuth,
  userLogout,
  seedAdmin,
};