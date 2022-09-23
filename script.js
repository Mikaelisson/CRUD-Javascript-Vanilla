const SAVE_CUSTOMERS = "customers";

class Client {
  constructor(name, registration, contact, address) {
    this.id = checkId();
    (this.name = name),
      (this.registration = registration),
      (this.contact = contact),
      (this.address = address);
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
  return localStorage.setItem(SAVE_CUSTOMERS, JSON.stringify(customers));
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
  document.getElementById("name").value = "";
  document.getElementById("registration").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("address").value = "";
};

//CREATE
const createClient = () => {
  const inputName = document.querySelector("#name");
  const inputRegistration = document.querySelector("#registration");
  const inputContact = document.querySelector("#contact");
  const inputAddress = document.querySelector("#address");

  const newClient = new Client(
    inputName.value,
    inputRegistration.value,
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
  if (DB_CUSTOMERS != "") {
    DB_CUSTOMERS.map((client, index) => {
      customerList.innerHTML += `
      <div id="${client.id}" class="client">
        <div class="customer-information">
          <p>Nome: ${client.name}</p>
          <p>CNPJ/CPF: ${client.registration}</p>
          <p>Contato: ${client.contact}</p>
          <p>Endereço: ${client.address}</p>
        </div>
        <div class="btn-delete-edit">
          <button type="button" class="btn-edit" id="edit-${index}">Editar</button>
          <button type="button" class="btn-delete" id="delete-${index}">Deletar</button>
        </div>
      </div>
      `;
    }).reverse();
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
  document.getElementById("id").value = client.id;
  document.getElementById("nameEdit").value = client.name;
  document.getElementById("registrationEdit").value = client.registration;
  document.getElementById("contactEdit").value = client.contact;
  document.getElementById("addressEdit").value = client.address;

  hideEdit();
};

//SAVE NEW CUSTOMER DATA
const saveNewCustomerData = () => {
  const index = document.getElementById("indexEdit").value;
  const id = document.getElementById("id").value;
  const name = document.getElementById("nameEdit").value;
  const registration = document.getElementById("registrationEdit").value;
  const contact = document.getElementById("contactEdit").value;
  const address = document.getElementById("addressEdit").value;

  const data = {
    id,
    name,
    registration,
    contact,
    address,
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
    registration: data.registration
      ? data.registration
      : CUSTOMERS_DB[index].registration,
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

document.querySelector("#customers").addEventListener("click", kindOfEvent);
document.querySelector("#addClient").addEventListener("click", createClient);
document.querySelector("#cancelEdit").addEventListener("click", hideEdit);
document.querySelector("#closeEdit").addEventListener("click", hideEdit);
document.querySelector("#newClient").addEventListener("click", hideModal);
document.querySelector("#closeModal").addEventListener("click", hideModal);
document.querySelector("#cancelClient").addEventListener("click", hideModal);
document
  .querySelector("#saveEdit")
  .addEventListener("click", saveNewCustomerData);
