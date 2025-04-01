import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { ILogin, IProfileUpdate } from "./auth.interface";
import { ObjectId } from "mongodb";
import emailSender from "../../../shared/emailSender";
import httpStatus from "http-status";

//login user
const loginUserIntoDB = async (payload: ILogin) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, status, createdAt, updatedAt, ...userInfo } = user;

  return {
    accessToken,
    userInfo,
  };
};

// get profile for logged in user
const getProfileFromDB = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, createdAt, updatedAt, ...sanitizedUser } = user;

  return sanitizedUser;
};

// update user profile only logged in user
const updateProfileIntoDB = async (
  userId: string,
  userData: IProfileUpdate
) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile,
    },
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};

// forget password
const fortgetPasswordFromDB = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, `User not found with email: ${email}`);
  }

  const resetPassToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink = `${config.reset_pass_link}?userId=${user.id}&token=${resetPassToken}`;

  await emailSender(
    "Reset Your Password",
    user.email,
    `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <table width="100%" style="border-collapse: collapse;">
    <tr>
      <td style="background-color: #007BFF; padding: 20px; text-align: center; color: #ffffff; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Reset Your Password</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 16px; margin: 0;">Hello <strong>${
          user.firstName
        }</strong>,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Please click the button below to proceed with resetting your password.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetPassLink}" style="
              background-color: #007BFF;
              color: white;
              padding: 12px 24px;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #555;">If you did not request this change, please ignore this email. No further action is needed.</p>
        
        <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>Raaya Social</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Raaya Social Team. All rights reserved.</p>
      </td>
    </tr>
    </table>
  </div>`
  );

  return;
};

// reset password
const resetPasswordInDB = async (
  token: string,
  userId: string,
  password: string
) => {
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as string
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your token is invalid");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found for reset password"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

// change password
const changePasswordInDB = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  console.log(newPassword)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found for change password"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.FORBIDDEN, "Incorrect current password");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

export const authService = {
  loginUserIntoDB,
  getProfileFromDB,
  updateProfileIntoDB,
  fortgetPasswordFromDB,
  resetPasswordInDB,
  changePasswordInDB,
};
