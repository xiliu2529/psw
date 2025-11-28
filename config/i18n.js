// 国际化配置文件

export const translations = {
  zh: {
    // 通用
    confirm: '确定',
    cancel: '取消',
    success: '成功',
    error: '错误',
    loading: '加载中...',
    
    // 登录页面
    login: {
      title: '欢迎回来',
      subtitle: '登录您的账户继续使用',
      email: '邮箱',
      password: '密码',
      loginButton: '登录',
      forgotPassword: '忘记密码？',
      createAccount: '创建新账户',
      emailError: '请填写邮箱和密码',
      loginFailed: '登录失败',
      userNotFound: '该邮箱未注册',
      wrongPassword: '密码错误',
      invalidEmail: '邮箱格式不正确',
      invalidCredential: '邮箱或密码错误',
    },
    
    // 注册页面
    register: {
      title: '创建账户',
      subtitle: '注册一个新账户开始使用',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      registerButton: '注册',
      hasAccount: '已有账户？立即登录',
      terms: '注册即表示同意服务条款',
      fillAllFields: '请填写所有字段',
      passwordMismatch: '两次密码输入不一致',
      registerFailed: '注册失败',
      emailInUse: '该邮箱已被注册',
      weakPassword: '密码强度不够（至少6位）',
      registerSuccess: '注册成功！',
      redirecting: '正在跳转到登录页面...',
    },
    
    // 主页
    home: {
      title: '密码管家',
      welcome: '你好',
      totalPasswords: '个密码',
      addButton: '添加密码',
      logout: '退出登录',
      logoutConfirm: '确定要退出当前账号吗？',
      emptyTitle: '还没有密码记录',
      emptySubtitle: '点击右下角按钮添加第一个密码',
      refreshing: '刷新中...',
      
      // 密码项
      purpose: '用途',
      account: '账号',
      password: '密码',
      show: '显示',
      hide: '隐藏',
      delete: '删除',
      pin: '置顶',
      unpin: '取消置顶',
      pinned: '已置顶',
      deleteConfirm: '确定要删除这个密码吗？',
      deleteSuccess: '密码已删除',
      deleteFailed: '删除失败',
      pinSuccess: '已置顶',
      unpinSuccess: '已取消置顶',
      
      // 添加密码弹窗
      addTitle: '添加新密码',
      editTitle: '编辑密码',
      purposeLabel: '用途/网站',
      accountLabel: '账号/用户名',
      passwordLabel: '密码',
      purposePlaceholder: '例如：微信、淘宝',
      accountPlaceholder: '例如：user@example.com',
      passwordPlaceholder: '输入密码',
      saveButton: '保存',
      fillAllFieldsError: '请填写所有字段',
      addSuccess: '密码已添加',
      addFailed: '添加密码失败，请重试',
      loadFailed: '加载密码列表失败',
    },
  },
  
  ja: {
    // 共通
    confirm: '確定',
    cancel: 'キャンセル',
    success: '成功',
    error: 'エラー',
    loading: '読み込み中...',
    
    // ログインページ
    login: {
      title: 'おかえりなさい',
      subtitle: 'アカウントにログインして続行',
      email: 'メールアドレス',
      password: 'パスワード',
      loginButton: 'ログイン',
      forgotPassword: 'パスワードを忘れた？',
      createAccount: '新規アカウント作成',
      emailError: 'メールアドレスとパスワードを入力してください',
      loginFailed: 'ログインに失敗しました',
      userNotFound: 'このメールアドレスは登録されていません',
      wrongPassword: 'パスワードが間違っています',
      invalidEmail: 'メールアドレスの形式が正しくありません',
      invalidCredential: 'メールアドレスまたはパスワードが間違っています',
    },
    
    // 登録ページ
    register: {
      title: 'アカウント作成',
      subtitle: '新規アカウントを登録して開始',
      username: 'ユーザー名',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      registerButton: '登録',
      hasAccount: 'アカウントをお持ちですか？ログイン',
      terms: '登録すると利用規約に同意したことになります',
      fillAllFields: 'すべてのフィールドを入力してください',
      passwordMismatch: 'パスワードが一致しません',
      registerFailed: '登録に失敗しました',
      emailInUse: 'このメールアドレスは既に登録されています',
      weakPassword: 'パスワードが弱すぎます（6文字以上）',
      registerSuccess: '登録成功！',
      redirecting: 'ログインページへ移動中...',
    },
    
    // ホーム
    home: {
      title: 'パス管',
      welcome: 'こんにちは',
      totalPasswords: '件のパスワード',
      addButton: 'パスワード追加',
      logout: 'ログアウト',
      logoutConfirm: '本当にログアウトしますか？',
      emptyTitle: 'パスワードがありません',
      emptySubtitle: '右下のボタンをタップして最初のパスワードを追加',
      refreshing: '更新中...',
      
      // パスワード項目
      purpose: '用途',
      account: 'アカウント',
      password: 'パスワード',
      show: '表示',
      hide: '非表示',
      delete: '削除',
      pin: 'ピン留め',
      unpin: 'ピン解除',
      pinned: 'ピン留め済み',
      deleteConfirm: 'このパスワードを削除してもよろしいですか？',
      deleteSuccess: 'パスワードを削除しました',
      deleteFailed: '削除に失敗しました',
      pinSuccess: 'ピン留めしました',
      unpinSuccess: 'ピン留めを解除しました',
      
      // パスワード追加ダイアログ
      addTitle: '新しいパスワード追加',
      editTitle: 'パスワード編集',
      purposeLabel: '用途/サイト',
      accountLabel: 'アカウント/ユーザー名',
      passwordLabel: 'パスワード',
      purposePlaceholder: '例：Twitter、Amazon',
      accountPlaceholder: '例：user@example.com',
      passwordPlaceholder: 'パスワードを入力',
      saveButton: '保存',
      fillAllFieldsError: 'すべてのフィールドを入力してください',
      addSuccess: 'パスワードを追加しました',
      addFailed: 'パスワードの追加に失敗しました',
      loadFailed: 'パスワードリストの読み込みに失敗しました',
    },
  },
};

// 获取当前语言的翻译
export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
