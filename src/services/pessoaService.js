import apiFetch from './apiFetch';

export const login = async (email, senha) => {
  const response = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const signup = async (email, senha, telefone, sexo, nome, imagem) => {
    const body = { email, senha, telefone, sexo, nome };
    if (imagem) {
      body.imagem = imagem;
    }
    await apiFetch('/cadastrar', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
