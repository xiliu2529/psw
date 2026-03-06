import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { registerUser } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("错误", "请填写所有字段");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("错误", "两次输入的密码不一致");
      return;
    }

    if (password.length < 6) {
      Alert.alert("错误", "密码长度至少为6位");
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, username);
    setLoading(false);

    if (result.success) {
      Alert.alert("成功", "注册成功！请登录", [
        {
          text: "确定",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } else {
      let errorMessage = "注册失败，请重试";
      if (result.error.includes("email-already-in-use")) {
        errorMessage = "该邮箱已被注册";
      } else if (result.error.includes("invalid-email")) {
        errorMessage = "邮箱格式不正确";
      } else if (result.error.includes("weak-password")) {
        errorMessage = "密码强度太弱";
      }
      Alert.alert("注册失败", errorMessage);
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo区域 */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>✨</Text>
              </View>
              <Text style={styles.appName}>创建账户</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>开始使用</Text>
              <Text style={styles.subtitle}>填写信息创建您的账户</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>👤</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="用户名"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>📧</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="邮箱"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>🔒</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="密码（至少6位）"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>🔑</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="确认密码"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ["#999", "#666"] : ["#ffffff", "#f0f0f0"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#667eea" />
                  ) : (
                    <Text style={styles.registerButtonText}>注册</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>或</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.loginButtonText}>已有账户？立即登录</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                注册即表示您同意我们的{"\n"}
                <Text style={styles.termsLink}>服务条款</Text> 和{" "}
                <Text style={styles.termsLink}>隐私政策</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 45,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 25,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  inputIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconText: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#fff",
  },
  registerButton: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#667eea",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },
  termsLink: {
    color: "#fff",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
