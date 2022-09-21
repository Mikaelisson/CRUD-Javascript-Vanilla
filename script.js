const customerList = document.querySelector("#customers");
const newClient = document.querySelector("#newClient");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");
const addClient = document.querySelector("#addClient");
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

//MODAL
const hideModal = () => {
  modal.classList.toggle("active");
  modal.classList.toggle("desative");
};

//SAVE CUSTOMERS
const saveCustomers = (customers) => {
  return localStorage.setItem(SAVE_CUSTOMERS, JSON.stringify(customers));
};

//LOAD CUSTOMERS
const loadCustomers = () => {
  return JSON.parse(localStorage.getItem(SAVE_CUSTOMERS));
};

//CREATE
const createClient = () => {
  customerList.innerHTML = "";
  const newClient = new Client(inputName.value, inputAge.value);
  customers.push(newClient);
  saveCustomers(customers);
  readClient();
};

//READ
const readClient = () => {
  const DB_CUSTOMERS = loadCustomers();

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
        <button>Editar</button>
        <button>Deletar</button>
      </div>
      </div>
      `;
    });
  } else {
    customerList.innerHTML = "VAZIO";
  }
};

//UPDATE
const updateClient = (index, data) => {
  customers[index] = {
    name: data.name ? data.name : customers[index].name,
    age: data.age ? data.age : customers[index].age,
  };
  readClient();
};

//DELETE
const deleteClient = (id) => {
  const registeredCustomers = customers.filter((client) => client.id !== id);
  console.log("Usuário excluído com sucesso!");
  readClient();
};

// createClient("New Client", "Age");
// setInterval(() => {
//   readClient();
// }, 5000);
// updateClient(0, { age: "22"});
// deleteClient(1);
document.addEventListener("DOMContentLoaded", () => {
  readClient();
});
