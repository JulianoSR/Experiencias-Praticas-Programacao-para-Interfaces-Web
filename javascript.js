window.addEventListener("DOMContentLoaded", renderPage);
window.addEventListener("hashchange", renderPage);

function renderPage() {
  const route = window.location.hash.replace("#", "") || "home";
  const app = document.getElementById("app");

  if (!app) return;

  switch (route) {
    case "home":
      app.innerHTML = renderHome();
      break;
    case "cadastro":
      app.innerHTML = renderCadastro();
      setupFormValidation();
      break;
    case "perfil":
      app.innerHTML = renderPerfil();
      break;
    default:
      app.innerHTML = "<h2>Página não encontrada.</h2>";
  }
}

function renderHome() {
  return `
    <h1>Bem-vindo à Área de Cadastro</h1>
    <p>Utilize o menu acima para navegar entre as páginas.</p>
  `;
}

function renderCadastro() {
  return `
    <h2>Formulário de Cadastro</h2>
    <form id="cadastroForm">
      <input type="text" name="nome" placeholder="Nome Completo" required />
      <input type="email" name="email" placeholder="E-mail" required />
      <input type="tel" name="telefone" placeholder="Telefone (XX-XXXXX-XXXX)" pattern="\\d{2}-\\d{5}-\\d{4}" />
      <input type="date" name="nascimento" />
      <input type="number" name="idade" placeholder="Idade (18-120)" min="18" max="120" />
      <input type="text" name="cpf" placeholder="CPF (000.000.000-00)" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" />
      <input type="text" name="cep" placeholder="CEP (00000-000)" pattern="\\d{5}-\\d{3}" />
      <button type="submit">Enviar</button>
    </form>
    <div id="feedback"></div>
  `;
}

function renderPerfil() {
  const dados = JSON.parse(localStorage.getItem("cadastro")) || null;

  if (!dados) {
    return `<h2>Perfil</h2><p>Nenhum dado cadastrado.</p>`;
  }

  return `
    <h2>Perfil do Usuário</h2>
    <p><strong>Nome:</strong> ${dados.nome}</p>
    <p><strong>Email:</strong> ${dados.email}</p>
    <p><strong>Telefone:</strong> ${dados.telefone}</p>
    <p><strong>Nascimento:</strong> ${dados.nascimento}</p>
    <p><strong>Idade:</strong> ${dados.idade}</p>
    <p><strong>CPF:</strong> ${dados.cpf}</p>
    <p><strong>CEP:</strong> ${dados.cep}</p>
  `;
}

function setupFormValidation() {
  const form = document.getElementById("cadastroForm");
  const feedback = document.getElementById("feedback");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      nascimento: form.nascimento.value,
      idade: form.idade.value,
      cpf: form.cpf.value.trim(),
      cep: form.cep.value.trim()
    };

    const erros = [];

    if (!dados.nome) erros.push("Nome é obrigatório.");
    if (!dados.email.includes("@")) erros.push("E-mail inválido.");
    if (!dados.telefone.match(/^\d{2}-\d{5}-\d{4}$/)) erros.push("Telefone inválido.");
    if (!dados.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) erros.push("CPF inválido.");
    if (!dados.cep.match(/^\d{5}-\d{3}$/)) erros.push("CEP inválido.");
    if (dados.idade < 18 || dados.idade > 120) erros.push("Idade fora do intervalo permitido.");

    if (erros.length > 0) {
      feedback.innerHTML = erros.map(e => `<p style="color:red;">${e}</p>`).join("");
    } else {
      localStorage.setItem("cadastro", JSON.stringify(dados));
      feedback.innerHTML = `<p style="color:green;">Cadastro realizado com sucesso!</p>`;
      form.reset();
    }
  });
}