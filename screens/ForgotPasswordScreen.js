import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { resetPassword } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('错误', '请输入您的邮箱地址');
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        '邮件已发送',
        '我们已向您的邮箱发送了密码重置链接，请查收邮件并按照说明重置密码。',
        [
          {
            text: '确定',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      let errorMessage = '发送重置邮件失败，请重试';
      if (result.error.includes('user-not-found')) {
        errorMessage = '该邮箱未注册';
      } else if (result.error.includes('invalid-email')) {
        errorMessage = '邮箱格式不正确';
      } else if (result.error.includes('too-many-requests')) {
        errorMessage = '请求过于频繁，请稍后再试';
      }
      Alert.alert('重置失败', errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo区域 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🔐</Text>
            </View>
            <Text style={styles.appName}>密码管家</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>忘记密码</Text>
            <Text style={styles.subtitle}>请输入您的邮箱地址，我们将发送重置链接</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>📧</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="请输入邮箱地址"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.resetButton, loading && styles.resetButtonDisabled]} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#999', '#666'] : ['#ffffff', '#f0f0f0']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#667eea" />
                ) : (
                  <Text style={styles.resetButtonText}>发送重置邮件</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backButtonText}>← 返回登录</Text>
            </TouchableOpacity>
          </View>

          {/* 说明信息 */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>重置密码说明：</Text>
            <Text style={styles.infoText}>1. 输入您注册时使用的邮箱</Text>
            <Text style={styles.infoText}>2. 查收邮件中的重置链接</Text>
            <Text style={styles.infoText}>3. 点击链接设置新密码</Text>
            <Text style={styles.infoText}>4. 使用新密码登录</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 25,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  inputIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconText: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#fff',
  },
  resetButton: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
    paddingLeft: 10,
  },
});