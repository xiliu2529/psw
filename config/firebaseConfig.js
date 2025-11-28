import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Web 应用配置
const firebaseConfig = {
  apiKey: "AIzaSyA_JDKX_JJOr5vupe77s5sHaPq661EhoUk",
  authDomain: "psw-app-9b74e.firebaseapp.com",
  projectId: "psw-app-9b74e",
  storageBucket: "psw-app-9b74e.firebasestorage.app",
  messagingSenderId: "542930313062",
  appId: "1:542930313062:web:03e0cf253d9cfadd5332a7",
  measurementId: "G-R0VSK3463W"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Auth 并配置 AsyncStorage 持久化
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 导出 Firestore
export const db = getFirestore(app);
export default app;
