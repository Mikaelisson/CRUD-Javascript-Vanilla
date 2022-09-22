const customerList = document.querySelector("#customers");
const newClient = document.querySelector("#newClient");
const addClient = document.querySelector("#addClient");

const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");

const inputName = document.querySelector("#name");
const inputAge = document.querySelector("#age");

const SAVE_CUSTOMERS = "clientes";

class Client {
  static lastId = 0;
  constructor(name, age) {
    this.id = Client.lastId++;
    (this.name = name), (this.age = age);
  }
}

const customers = [];

//Hide elements
const hideModal = () => {
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

//CREATE
const createClient = () => {
  const newClient = new Client(inputName.value, inputAge.value);
  const DB_CUSTOMERS = readClient() ? readClient() : [];
  DB_CUSTOMERS.push(newClient);
  saveCustomers(DB_CUSTOMERS);
  createListCustomers();
};

//CREATE LIST CUSTOMERS
const createListCustomers = () => {
  const DB_CUSTOMERS = readClient();

  customerList.innerHTML = "";
  if (DB_CUSTOMERS) {
    DB_CUSTOMERS.map((client) => {
      customerList.innerHTML += `
      <div id="${client.id}" class="client">
        <div class="customer-information">
          <p>Cliente n° ${client.id + 1}</p>
          <p>Nome: ${client.name}</p>
          <p>Idade: ${client.age}</p>
        </div>
        <div class="btn-delete-edit">
          <button type="button" id="edit-${client.id}">Editar</button>
          <button type="button" id="delete-${client.id}">Deletar</button>
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
      fillInputs(CUSTOMERS_DB[index]);
    }
    if (action === "delete") {
      deleteClient(index);
    }
  }
};

//GET INPUT VALUE
const fillInputs = (client) => {
  document.getElementById("nameEdit").value = client.name;
  document.getElementById("ageEdit").value = client.age;
  document.getElementById("id").value = client.id;
  hideEdit();
};

//SAVE NEW CUSTOMER DATA
const saveNewCustomerData = () => {
  const index = document.getElementById("id").value;
  const data = {
    id: index,
    name: document.getElementById("nameEdit").value,
    age: document.getElementById("ageEdit").value,
  };
  updateClient(index, data);
  hideEdit();
};

//UPDATE
const updateClient = (index, data) => {
  const CUSTOMERS_DB = readClient();
  CUSTOMERS_DB[index] = {
    id: parseInt(data.id),
    name: data.name ? data.name : CUSTOMERS_DB[index].name,
    age: data.age ? data.age : CUSTOMERS_DB[index].age,
  };
  saveCustomers(CUSTOMERS_DB); //save data to local storage
  createListCustomers();
};

//DELETE
const deleteClient = (id) => {
  const CUSTOMERS_DB = readClient();
  const registeredCustomers = CUSTOMERS_DB.filter(
    (client) => client.id !== parseInt(id)
  );
  saveCustomers(registeredCustomers);
  createListCustomers();
};

// createClient("New Client", "Age");
// setInterval(() => {
//   readClient();
// }, 5000);
// updateClient(0, { age: "22"});
// deleteClient(1);
document.addEventListener("DOMContentLoaded", () => {
  createListCustomers();
  document.querySelector(".close").addEventListener("click", hideEdit);
});

document.querySelector("#customers").addEventListener("click", findId);
document
  .querySelector("#saveEdit")
  .addEventListener("click", saveNewCustomerData);
newClient.addEventListener("click", hideModal);
