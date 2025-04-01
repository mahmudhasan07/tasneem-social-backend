import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

//login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUserIntoDB(req.body);

  // res.cookie("accessToken", result.accessToken, {
  //   maxAge: 24 * 60 * 60 * 1000,
  //   path: "/",
  //   secure: true,
  //   sameSite: "lax",
  //   httpOnly: false,
  // });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully logged in",
    data: result,
  });
});

// get profile for logged in user
const getProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const user = await authService.getProfileFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

// update user profile only logged in user
const updateProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const updatedUser = await authService.updateProfileIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

// forget password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.fortgetPasswordFromDB(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reset password link sent via your email successfully",
  });
});

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, userId, password } = req.body;
  await authService.resetPasswordInDB(token, userId, password);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully",
  });
});

// change password
const changePassword = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  await authService.changePasswordInDB(id, currentPassword, newPassword);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
  });
});

export const authController = {
  loginUser,
  getProfile,
  updateProfile,
  forgetPassword,
  resetPassword,
  changePassword,
};
