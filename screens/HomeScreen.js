import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as LocalAuthentication from 'expo-local-authentication';
import { logoutUser, getCurrentUser } from '../services/authService';
import { addPassword, getUserPasswords, deletePassword, togglePinPassword } from '../services/passwordService';
import { translations } from '../config/i18n';

export default function HomeScreen({ navigation }) {
  const [passwords, setPasswords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPurpose, setNewPurpose] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [language, setLanguage] = useState('zh'); // 默认中文
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // 加载语言设置
  useEffect(() => {
    loadLanguage();
  }, []);

  // 加载密码列表
  useEffect(() => {
    loadPasswords();
  }, []);

  // 检查生物识别支持
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang) {
        setLanguage(savedLang);
      }
    } catch (error) {
      console.error('加载语言设置失败:', error);
    }
  };

  const switchLanguage = async () => {
    const newLang = language === 'zh' ? 'ja' : 'zh';
    setLanguage(newLang);
    try {
      await AsyncStorage.setItem('app_language', newLang);
    } catch (error) {
      console.error('保存语言设置失败:', error);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    } catch (error) {
      console.error('检查生物识别支持失败:', error);
      setIsBiometricSupported(false);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      if (!isBiometricSupported) {
        return true; // 如果不支持生物识别，直接返回true
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: language === 'zh' ? '请验证身份以查看密码' : 'パスワードを表示するために認証してください',
        fallbackLabel: language === 'zh' ? '使用密码' : 'パスワードを使用',
        cancelLabel: language === 'zh' ? '取消' : 'キャンセル',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('生物识别验证失败:', error);
      return false;
    }
  };

  const loadPasswords = async () => {
    setRefreshing(true);
    const user = getCurrentUser();
    if (user) {
      const result = await getUserPasswords(user.uid);
      if (result.success) {
        setPasswords(result.passwords);
      } else {
        Alert.alert(t('error'), t('home.loadFailed'));
      }
    }
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      t('home.logout'),
      t('home.logoutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('confirm'),
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ]
    );
  };

  const handleAddPassword = async () => {
    if (!newPurpose || !newAccount || !newPassword) {
      Alert.alert(t('error'), t('home.fillAllFieldsError'));
      return;
    }

    setLoading(true);
    const user = getCurrentUser();
    if (user) {
      const result = await addPassword(user.uid, {
        purpose: newPurpose,
        account: newAccount,
        password: newPassword,
      });

      setLoading(false);

      if (result.success) {
        setModalVisible(false);
        setNewPurpose('');
        setNewAccount('');
        setNewPassword('');
        Alert.alert(t('success'), t('home.addSuccess'));
        loadPasswords();
      } else {
        Alert.alert(t('error'), t('home.addFailed'));
      }
    }
  };

  const handleDeletePassword = (passwordId, purpose) => {
    Alert.alert(
      t('home.delete'),
      t('home.deleteConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('home.delete'),
          style: 'destructive',
          onPress: async () => {
            const result = await deletePassword(passwordId);
            if (result.success) {
              Alert.alert(t('success'), t('home.deleteSuccess'));
              loadPasswords();
            } else {
              Alert.alert(t('error'), t('home.deleteFailed'));
            }
          },
        },
      ]
    );
  };

  const handleTogglePin = async (passwordId, isPinned, purpose) => {
    const result = await togglePinPassword(passwordId, isPinned);
    if (result.success) {
      const message = isPinned ? t('home.unpinSuccess') : t('home.pinSuccess');
      Alert.alert(t('success'), message);
      loadPasswords();
    } else {
      Alert.alert(t('error'), '操作失败');
    }
  };

  const togglePasswordVisibility = async (id) => {
    const isCurrentlyVisible = showPassword[id];
    
    if (!isCurrentlyVisible) {
      // 如果当前是隐藏状态，要显示密码，需要验证身份
      const isAuthenticated = await authenticateWithBiometrics();
      
      if (isAuthenticated) {
        setShowPassword(prev => ({
          ...prev,
          [id]: !prev[id]
        }));
      } else {
        // 验证失败，不显示密码
        Alert.alert(
          t('error'),
          language === 'zh' ? '身份验证失败，无法查看密码' : '認証に失敗しました。パスワードを表示できません。'
        );
      }
    } else {
      // 如果当前是显示状态，直接隐藏
      setShowPassword(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setNewPurpose('');
    setNewAccount('');
    setNewPassword('');
  };

  const renderPasswordItem = ({ item, index }) => (
    <Animated.View style={[styles.passwordCard, { opacity: 1 }]}>
      <LinearGradient
        colors={item.isPinned ? ['#ff6b6b', '#ee5a6f'] : ['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* 置顶标记 */}
        {item.isPinned && (
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedText}>📌 {t('home.pinned')}</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.purposeContainer}>
            <Text style={styles.purposeIcon}>🔑</Text>
            <Text style={styles.purposeText}>{item.purpose}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.pinButton}
              onPress={() => handleTogglePin(item.id, item.isPinned, item.purpose)}
            >
              <Text style={styles.pinIcon}>{item.isPinned ? '📌' : '📍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePassword(item.id, item.purpose)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('home.account')}</Text>
            <Text style={styles.value} numberOfLines={1}>{item.account}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('home.password')}</Text>
            <View style={styles.passwordRow}>
              <Text style={styles.value} numberOfLines={1}>
                {showPassword[item.id] ? item.password : '••••••••'}
              </Text>
              <TouchableOpacity onPress={() => togglePasswordVisibility(item.id)}>
                <Text style={styles.eyeIcon}>
                  {showPassword[item.id] ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'ja-JP')}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔐</Text>
      <Text style={styles.emptyText}>{t('home.emptyTitle')}</Text>
      <Text style={styles.emptySubtext}>{t('home.emptySubtitle')}</Text>
    </View>
  );

  const user = getCurrentUser();
  const pinnedCount = passwords.filter(p => p.isPinned).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t('home.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('home.welcome')} {user?.displayName || 'User'} • {passwords.length}{t('home.totalPasswords')}
              {pinnedCount > 0 && ` • 📌${pinnedCount}`}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={switchLanguage}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.languageGradient}
              >
                <Text style={styles.languageText}>{language === 'zh' ? '中' : '日'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.logoutGradient}
              >
                <Text style={styles.logoutIcon}>👋</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={passwords}
        renderItem={renderPasswordItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={loadPasswords}
      />

      {/* 悬浮添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 添加密码弹窗 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>{t('home.addTitle')} 🔐</Text>
            </LinearGradient>
            
            <View style={styles.modalBody}>
              <View style={styles.modalInputWrapper}>
                <Text style={styles.inputLabel}>{t('home.purposeLabel')}</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('home.purposePlaceholder')}
                  placeholderTextColor="#999"
                  value={newPurpose}
                  onChangeText={setNewPurpose}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.modalInputWrapper}>
                <Text style={styles.inputLabel}>{t('home.accountLabel')}</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('home.accountPlaceholder')}
                  placeholderTextColor="#999"
                  value={newAccount}
                  onChangeText={setNewAccount}
                  editable={!loading}
                />
              </View>
              
              <View style={styles.modalInputWrapper}>
                <Text style={styles.inputLabel}>{t('home.passwordLabel')}</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('home.passwordPlaceholder')}
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddPassword}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#999', '#666'] : ['#667eea', '#764ba2']}
                    style={styles.confirmButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>{t('home.saveButton')}</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  languageGradient: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoutGradient: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutIcon: {
    fontSize: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  passwordCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    position: 'relative',
  },
  pinnedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  pinnedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  purposeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  purposeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  purposeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pinButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  pinIcon: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  deleteIcon: {
    fontSize: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15,
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    width: 60,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  eyeIcon: {
    fontSize: 20,
  },
  cardFooter: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 10,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  addButtonGradient: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    marginTop: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 25,
    width: '88%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 25,
  },
  modalInputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f8f9fd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e8eaf6',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 14,
  },
  confirmButton: {
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
