export function getAuthErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email ja esta em uso.';
    case 'auth/invalid-email':
      return 'Informe um email valido.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha incorretos.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'Login cancelado antes de concluir.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela de login do Google.';
    case 'auth/unauthorized-domain':
      return 'Este dominio nao esta autorizado no Firebase Authentication.';
    case 'auth/operation-not-allowed':
      return 'Este metodo de login nao esta habilitado no Firebase Authentication.';
    case 'auth/configuration-not-found':
      return 'A configuracao de login do Firebase nao foi encontrada ou nao esta habilitada.';
    default:
      return 'Erro de autenticacao. Verifique a configuracao do Firebase e tente novamente.';
  }
}
