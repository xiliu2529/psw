import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// 添加新密码记录
export const addPassword = async (userId, passwordData) => {
  try {
    const docRef = await addDoc(collection(db, 'passwords'), {
      userId,
      purpose: passwordData.purpose,
      account: passwordData.account,
      password: passwordData.password,
      isPinned: false, // 默认不置顶
      pinnedAt: null, // 置顶时间
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户的所有密码
export const getUserPasswords = async (userId) => {
  try {
    // 暂时不使用 orderBy，避免索引错误
    const q = query(
      collection(db, 'passwords'), 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const passwords = [];
    
    querySnapshot.forEach((doc) => {
      passwords.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // 在客户端进行排序
    // 规则：置顶的在前面，按置顶时间倒序；未置顶的在后面，按创建时间倒序
    passwords.sort((a, b) => {
      // 如果都置顶或都不置顶
      if (a.isPinned === b.isPinned) {
        if (a.isPinned) {
          // 都置顶，按置顶时间倒序
          return new Date(b.pinnedAt) - new Date(a.pinnedAt);
        } else {
          // 都不置顶，按创建时间倒序
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      }
      // 置顶的排在前面
      return b.isPinned ? 1 : -1;
    });
    
    return { success: true, passwords };
  } catch (error) {
    console.error('获取密码列表失败:', error);
    return { success: false, error: error.message };
  }
};

// 删除密码记录
export const deletePassword = async (passwordId) => {
  try {
    await deleteDoc(doc(db, 'passwords', passwordId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 更新密码记录
export const updatePassword = async (passwordId, passwordData) => {
  try {
    const passwordRef = doc(db, 'passwords', passwordId);
    await updateDoc(passwordRef, {
      ...passwordData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 置顶/取消置顶密码
export const togglePinPassword = async (passwordId, isPinned) => {
  try {
    const passwordRef = doc(db, 'passwords', passwordId);
    await updateDoc(passwordRef, {
      isPinned: !isPinned,
      pinnedAt: !isPinned ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('置顶操作失败:', error);
    return { success: false, error: error.message };
  }
};
