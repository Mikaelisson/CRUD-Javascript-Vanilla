const SAVE_CUSTOMERS = "customers";

const customerList = document.querySelector("#customers");
const topBar = document.querySelector("#topBar");

const inputName = document.querySelector("#name");
const inputRegistration = document.querySelector("#registration");
const inputPhone = document.querySelector("#phone");
const inputAddress = document.querySelector("#address");
const inputInvoice = document.querySelector("#invoice");

const idInputEdit = document.querySelector("#id");
const nameInputEdit = document.querySelector("#nameEdit");
const registrationInputEdit = document.querySelector("#registrationEdit");
const phoneInputEdit = document.querySelector("#phoneEdit");
const addressInputEdit = document.querySelector("#addressEdit");
const invoiceInputEdit = document.querySelector("#invoiceEdit");

//CLIENT DATA SCHEMA
class Client {
  constructor(name, registration, phone, address, invoice) {
    this.id = checkId();
    (this.name = name),
      (this.registration = registration),
      (this.phone = phone),
      (this.address = address),
      (this.invoice = invoice);
  }
}

//CREATE ID
const generateId = () => {
  return Math.random().toString().substring(2, 16);
};

//CHECK DUPLICATE ID
const checkId = () => {
  const DB_CUSTOMERS = readClient();
  const id = generateId();
  const check = DB_CUSTOMERS.filter((client) => client.id === id);
  if (check[0] === undefined) {
    return id;
  } else {
    checkId();
  }
};

//Hide elements
const hideModal = () => {
  document.querySelector("#modal").classList.toggle("active");
  document.querySelector("#modal").classList.toggle("desative");
};

const hideEdit = () => {
  document.querySelector("#editClient").classList.toggle("active");
  document.querySelector("#editClient").classList.toggle("desative");
};

//SAVE CUSTOMERS
const saveCustomers = (customers) => {
  return localStorage.setItem(
    SAVE_CUSTOMERS,
    JSON.stringify(customers.reverse())
  );
};

//LOAD CUSTOMERS
const loadCustomers = () => {
  return JSON.parse(localStorage.getItem(SAVE_CUSTOMERS));
};

//READ
const readClient = () => {
  const CUSTOMERS_DB = loadCustomers();
  if (CUSTOMERS_DB) {
    return CUSTOMERS_DB;
  } else {
    return [];
  }
};

//INPUT VALUE
const inputValue = () => {
  inputName.value = "";
  inputRegistration.value = "";
  inputPhone.value = "";
  inputAddress.value = "";
  inputInvoice.value = "";
};

//MASK CPF OR CNPJ
const formatCpfCnpj = (cpfOrCnpj) => {
  if (cpfOrCnpj.length == 11) {
    let cpf = cpfOrCnpj.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");
    return cpf;
  }
  if (cpfOrCnpj.length == 14) {
    let cnpj = cpfOrCnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})/,
      "$1.$2.$3/$4-"
    );
    return cnpj;
  }
};

//CREATE
const createClient = (event) => {
  event.preventDefault();

  if (
    inputName.value !== "" &&
    inputName.value !== null &&
    inputRegistration.value !== "" &&
    inputRegistration.value !== null &&
    inputPhone.value !== "" &&
    inputPhone.value !== null &&
    inputPhone.value.length >= 9 &&
    inputAddress.value !== "" &&
    inputAddress.value !== null &&
    inputInvoice.value !== "" &&
    inputInvoice.value !== null
  ) {
    if (
      inputRegistration.value.length === 11 ||
      inputRegistration.value.length === 14
    ) {
      const newClient = new Client(
        inputName.value,
        inputRegistration.value,
        inputPhone.value,
        inputAddress.value,
        inputInvoice.value
      );
      const DB_CUSTOMERS = readClient() ? readClient() : [];

      DB_CUSTOMERS.push(newClient);
      saveCustomers(DB_CUSTOMERS);
      hideModal();
      createListCustomers();
      inputValue();
    } else {
      alert("CPF ou CNPJ inválido, preencha os dados e tente novamente!");
    }
  } else {
    alert("Preencha todos os dados e tente novamente!");
  }
};

//CREATE LIST CUSTOMERS
const createListCustomers = () => {
  const DB_CUSTOMERS = readClient();

  customerList.innerHTML = "";
  topBar.innerHTML = "";

  if (DB_CUSTOMERS != "") {
    let soma = 0;
    for (let i = 0; i < DB_CUSTOMERS.length; i++) {
      let invoicedAmount = parseFloat(
        DB_CUSTOMERS[i].invoice.replace(".", "").replace(",", ".")
      );
      soma += invoicedAmount;
    }

    const BRL = soma.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    topBar.innerHTML = `
      <div class="card-topBar">
        <p>Faturamento</p>
        <p>${BRL}</p>
      </div>
      <div class="card-topBar">
        <p>Total de clientes</p>
        <p>${DB_CUSTOMERS.length} clientes</p>
      </div>
      `;

    DB_CUSTOMERS.map((client, index) => {
      customerList.innerHTML += `
      <div id="${client.id}" class="client">
        <div class="customer-information">
          <p>ID: ${client.id}</p>
          <p>Nome: ${client.name}</p>
          <p>CNPJ/CPF: ${formatCpfCnpj(client.registration)}</p>
          <p>Telefone: ${client.phone}</p>
          <p>Endereço: ${client.address}</p>
          <p>Valor: R$ ${client.invoice}</p>
        </div>
        <div class="btn-delete-edit">
          <button type="button" class="btn-edit" id="edit-${index}">Editar</button>
          <button type="button" class="btn-delete" id="delete-${index}">Deletar</button>
        </div>
      </div>
      `;
    });
  } else {
    customerList.innerHTML = '<div id="empty">VAZIO</div>';
  }
};

//KIND OF EVENT
const kindOfEvent = (e) => {
  if (e.target.type === "button") {
    const [action, index] = e.target.id.split("-");

    if (action === "edit") {
      const CUSTOMERS_DB = readClient();
      fillInputs(CUSTOMERS_DB[index], index);
    }
    if (action === "delete") {
      const CUSTOMERS_DB = readClient();
      const id = CUSTOMERS_DB[index].id;
      deleteClient(id);
    }
  }
};

//GET INPUT VALUE
const fillInputs = (client, index) => {
  document.getElementById("indexEdit").value = index;
  idInputEdit.value = client.id;
  nameInputEdit.value = client.name;
  registrationInputEdit.value = client.registration;
  phoneInputEdit.value = client.phone;
  addressInputEdit.value = client.address;
  invoiceInputEdit.value = client.invoice;

  hideEdit();
};

//SAVE NEW CUSTOMER DATA
const saveNewCustomerData = () => {
  const index = document.getElementById("indexEdit").value;
  if (
    nameInputEdit.value === "" ||
    nameInputEdit.value === null ||
    registrationInputEdit.value === "" ||
    registrationInputEdit.value === null ||
    phoneInputEdit.value === "" ||
    phoneInputEdit.value === null ||
    addressInputEdit.value === "" ||
    addressInputEdit.value === null ||
    invoiceInputEdit.value === "" ||
    invoiceInputEdit.value === null
  ) {
    alert("Preencha todos os dados e tente novamente!");
  } else {
    const data = {
      id: idInputEdit.value,
      name: nameInputEdit.value,
      registration: registrationInputEdit.value,
      phone: phoneInputEdit.value,
      address: addressInputEdit.value,
      invoice: invoiceInputEdit.value,
    };
    updateClient(index, data);
    hideEdit();
  }
};

//UPDATE
const updateClient = (index, data) => {
  const CUSTOMERS_DB = readClient();
  CUSTOMERS_DB[index] = {
    id: data.id,
    name: data.name ? data.name : CUSTOMERS_DB[index].name,
    registration: data.registration
      ? data.registration
      : CUSTOMERS_DB[index].registration,
    phone: data.phone ? data.phone : CUSTOMERS_DB[index].phone,
    address: data.address ? data.address : CUSTOMERS_DB[index].address,
    invoice: data.invoice ? data.invoice : CUSTOMERS_DB[index].invoice,
  };
  saveCustomers(CUSTOMERS_DB); //save data to local storage
  createListCustomers();
};

//DELETE
const deleteClient = (id) => {
  const CUSTOMERS_DB = readClient();
  const registeredCustomers = CUSTOMERS_DB.filter((client) => client.id !== id);
  saveCustomers(registeredCustomers);
  createListCustomers();
};

document.addEventListener("DOMContentLoaded", () => {
  createListCustomers();
});

customerList.addEventListener("click", kindOfEvent);
document.querySelector("#addClient").addEventListener("click", createClient);
document.querySelector("#cancelEdit").addEventListener("click", hideEdit);
document.querySelector("#closeEdit").addEventListener("click", hideEdit);
document.querySelector("#newClient").addEventListener("click", hideModal);
document.querySelector("#closeModal").addEventListener("click", hideModal);
document.querySelector("#cancelClient").addEventListener("click", hideModal);
document
  .querySelector("#saveEdit")
  .addEventListener("click", saveNewCustomerData);

const convertBRL = (i) => {
  var v = i.value.replace(/\D/g, "");
  v = (v / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  i.value = v;
};

inputInvoice.addEventListener("keyup", () => convertBRL(inputInvoice));
invoiceInputEdit.addEventListener("keyup", () => convertBRL(invoiceInputEdit));
