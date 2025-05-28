import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.kakaoId;
      },
    },
    // 카카오 로그인을 위한 필드 추가
    kakaoId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profileImage: String,
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
