const customers = [];
const SAVE_CUSTOMERS = "customers";

class Client {
  constructor(name, taxRegistration, contact, address) {
    this.id = checkId();
    (this.name = name),
      (this.taxRegistration = taxRegistration),
      (this.contact = contact),
      (this.address = address);
  }
}

//CREATE ID
const generateId = () => {
  return Math.random().toString(36).substring(2);
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
  const modal = document.querySelector("#modal");
  modal.classList.toggle("active");
  modal.classList.toggle("desative");
};

const hideEdit = () => {
  const editClient = document.querySelector("#editClient");
  editClient.classList.toggle("active");
  editClient.classList.toggle("desative");
};

//SAVE CUSTOMERS
const saveCustomers = (customers) => {
  return localStorage.setItem(SAVE_CUSTOMERS, JSON.stringify(customers));
};

//LOAD CUSTOMERS
const loadCustomers = () => {
  return JSON.parse(localStorage.getItem(SAVE_CUSTOMERS));
};

//READ
const readClient = () => {
  return loadCustomers();
};

//INPUT VALUE
const inputValue = () => {
  document.getElementById("name").value = "";
  document.getElementById("taxRegistration").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("address").value = "";
};
const getInput = (a) => {
  return document.querySelector(a);
};
//CREATE
const createClient = () => {
  const inputName = getInput("#name");
  const inputTaxRegistration = document.querySelector("#taxRegistration");
  const inputContact = document.querySelector("#contact");
  const inputAddress = document.querySelector("#address");

  const newClient = new Client(
    inputName.value,
    inputTaxRegistration.value,
    inputContact.value,
    inputAddress.value
  );
  const DB_CUSTOMERS = readClient() ? readClient() : [];

  DB_CUSTOMERS.push(newClient);
  saveCustomers(DB_CUSTOMERS);
  hideModal();
  inputValue();
  createListCustomers();
};

//CREATE LIST CUSTOMERS
const createListCustomers = () => {
  const customerList = document.querySelector("#customers");

  const DB_CUSTOMERS = readClient();

  customerList.innerHTML = "";
  if (DB_CUSTOMERS) {
    DB_CUSTOMERS.map((client, index) => {
      customerList.innerHTML += `
      <div id="${client.id}" class="client">
        <div class="customer-information">
          <p>Nome: ${client.name}</p>
          <p>CNPJ/CPF: ${client.taxRegistration}</p>
          <p>Contato: ${client.contact}</p>
          <p>Endereço: ${client.address}</p>
        </div>
        <div class="btn-delete-edit">
          <button type="button" id="edit-${index}">Editar</button>
          <button type="button" id="delete-${index}">Deletar</button>
        </div>
      </div>
      `;
    }).reverse();
  } else {
    customerList.innerHTML = '<div id="empty">VAZIO</div>';
  }
};

//FIND ID
const findId = (e) => {
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
  document.getElementById("id").value = client.id;
  document.getElementById("nameEdit").value = client.name;
  document.getElementById("taxRegistrationEdit").value = client.taxRegistration;
  document.getElementById("contactEdit").value = client.contact;
  document.getElementById("addressEdit").value = client.address;

  hideEdit();
};

//SAVE NEW CUSTOMER DATA
const saveNewCustomerData = () => {
  const index = document.getElementById("indexEdit").value;
  const data = {
    id: document.getElementById("id").value,
    name: document.getElementById("nameEdit").value,
    taxRegistration: document.getElementById("taxRegistrationEdit").value,
    contact: document.getElementById("contactEdit").value,
    address: document.getElementById("addressEdit").value,
  };
  updateClient(index, data);
  hideEdit();
};

//UPDATE
const updateClient = (index, data) => {
  const CUSTOMERS_DB = readClient();
  CUSTOMERS_DB[index] = {
    id: data.id,
    name: data.name ? data.name : CUSTOMERS_DB[index].name,
    taxRegistration: data.taxRegistration
      ? data.taxRegistration
      : CUSTOMERS_DB[index].taxRegistration,
    contact: data.contact ? data.contact : CUSTOMERS_DB[index].contact,
    address: data.address ? data.address : CUSTOMERS_DB[index].address,
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

document.querySelector("#customers").addEventListener("click", findId);
document.querySelector("#addClient").addEventListener("click", createClient);
document.querySelector("#cancelEdit").addEventListener("click", hideEdit);
document.querySelector("#closeEdit").addEventListener("click", hideEdit);
document.querySelector("#newClient").addEventListener("click", hideModal);
document.querySelector("#closeModal").addEventListener("click", hideModal);
document
  .querySelector("#saveEdit")
  .addEventListener("click", saveNewCustomerData);
