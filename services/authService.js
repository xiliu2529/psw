import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// 注册新用户
export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 更新用户显示名称
    await updateProfile(user, {
      displayName: username
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 用户登录（自动保持登录状态）
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Firebase 默认会保持登录状态，无需额外配置
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 用户登出
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取当前用户
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 忘记密码 - 发送重置邮件
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 监听认证状态变化
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
