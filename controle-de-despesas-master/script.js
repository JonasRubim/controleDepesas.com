const transactionsUL = document.querySelector("#transactions");
const form = document.querySelector("#form");
const inputText = document.querySelector("#text");
const inputValue = document.querySelector("#amount");

/* localstorage api que da pra armazenar no browser os dadps */
const localStorageTransitions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransitions : [];

/* Criando função que remove elementos dentro de array */
const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== ID;
  });
  updateLocalStorage();
  init();
};

/* Função que faz as mudanças necessarias dentro do array  */
const addTransacaoNoDom = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const classCss = transaction.amount < 0 ? "minus" : "plus";
  const valorResultado = Math.abs(transaction.amount);
  const li = document.createElement("li");
  li.classList.add(classCss);
  li.innerHTML = `
   ${transaction.name}
   <span>${operator}$${valorResultado} </span>
   <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
   x</button>`;
  transactionsUL.append(li);
};

/* Função que atualiza os valores das transaçoes */
const updateValores = () => {
  const transacaoValores = transactions.map(
    (transaction) => transaction.amount
  );
  const total = transacaoValores.reduce(
    (acumulator, transaction) => acumulator + transaction,
    0
  );

  const positivos = transacaoValores
    .filter((value) => value > 0)
    .reduce((acumulator, transaction) => acumulator + transaction, 0)
    .toFixed(2);

  const negativos = Math.abs(
    transacaoValores
      .filter((value) => value < 0)
      .reduce((acumulator, transaction) => acumulator + transaction, 0)
  ).toFixed(2);

  /* Preencher os valores nos seus devidos dom */
  document.querySelector("#money-plus").innerHTML = `+ R$ ${positivos}`;
  document.querySelector("#money-minus").innerHTML = `- R$ ${negativos}`;

  document.querySelector(".balance").innerHTML = `R$ ${total.toFixed(2)}`;
};

/* função que pecorre todos os elementos e joga na pagina */
const init = () => {
  transactionsUL.innerHTML = "";
  transactions.forEach(addTransacaoNoDom);
  updateValores();
};

init();

/* funçaõ que armazenar os dados na localStorage */

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

/* Gerador de numeros aleatorios para o id */
const generateID = () => Math.round(Math.random() * 1000);

/* função que organizara o meu array */
const addToTransactionsArray = (transactionName, transactionValue) => {
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionValue),
  };

  /* inclementando os dados digitados e colocando dentro do array criado  */
  transactions.push(transaction);
};

/* Limpar os inputs */
const clearInputs = () => {
  transactionValue.value = "";
  transactionName.value = "";
};

/* modificando o formulario para preenchimento de dados */
const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputText.value.trim();
  const transactionValue = inputValue.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionValue === "";

  if (isSomeInputEmpty) {
    alert("Por favor preencha tanto o nome quanto o valor da transação!");
    return;
  }
  addToTransactionsArray(transactionName, transactionValue);
  init();
  updateLocalStorage();
  clearInputs();
};

form.addEventListener("submit", handleFormSubmit);
